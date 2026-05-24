import subprocess
import tempfile
import os
import time
import sys
from models import TestCase, ExecutionResult

# Safety limits
TIMEOUT_SECONDS = 5
MAX_OUTPUT_CHARS = 10_000
MAX_MEMORY_MB = 256


BLOCKED_IMPORTS = [
    "import os", "import sys", "import subprocess", "import shutil",
    "import socket", "import requests", "import urllib",
    "__import__", "eval(", "exec(", "open(",
    "os.system", "os.popen", "subprocess.", "shutil.",
]


def _is_safe_python(code: str) -> tuple[bool, str]:
    """Basic static safety check for Python code."""
    code_lower = code.lower()
    for blocked in BLOCKED_IMPORTS:
        if blocked.lower() in code_lower:
            return False, f"Blocked pattern detected: {blocked}"
    return True, ""


def _wrap_python_code(user_code: str, stdin_input: str) -> str:
    """Wrap user code to run safely with given input."""
    escaped_input = stdin_input.replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
    
    wrapper = f'''
import sys
import io
import signal

# Timeout handler
def timeout_handler(signum, frame):
    raise TimeoutError("Execution timed out")

# Redirect stdin
sys.stdin = io.StringIO("{escaped_input}")

# Run user code
{user_code}
'''
    return wrapper


def execute_python(code: str, stdin_input: str, test_case_id: str) -> ExecutionResult:
    """Execute Python code in a subprocess sandbox."""
    
    # Safety check
    safe, reason = _is_safe_python(code)
    if not safe:
        return ExecutionResult(
            test_case_id=test_case_id,
            actual_output=None,
            passed=False,
            error=f"Security violation: {reason}",
            execution_time_ms=0,
        )

    # Write code to temp file
    with tempfile.NamedTemporaryFile(
        mode="w", suffix=".py", delete=False, prefix="tc_exec_"
    ) as f:
        # Inject stdin override at the top
        full_code = f'import sys, io\nsys.stdin = io.StringIO({repr(stdin_input)})\n\n' + code
        f.write(full_code)
        tmp_path = f.name

    start_time = time.perf_counter()
    
    try:
        result = subprocess.run(
            [sys.executable, tmp_path],
            capture_output=True,
            text=True,
            timeout=TIMEOUT_SECONDS,
            # Restrict environment
            env={
                "PATH": os.environ.get("PATH", ""),
                "PYTHONPATH": "",
                "HOME": "/tmp",
            },
        )
        elapsed_ms = (time.perf_counter() - start_time) * 1000

        stdout = result.stdout[:MAX_OUTPUT_CHARS].strip()
        stderr = result.stderr[:2000].strip()

        if result.returncode != 0:
            return ExecutionResult(
                test_case_id=test_case_id,
                actual_output=stdout or None,
                passed=False,
                error=stderr or f"Exit code {result.returncode}",
                execution_time_ms=round(elapsed_ms, 2),
            )

        return ExecutionResult(
            test_case_id=test_case_id,
            actual_output=stdout,
            passed=False,  # Will be set by caller comparing with expected
            error=None,
            execution_time_ms=round(elapsed_ms, 2),
        )

    except subprocess.TimeoutExpired:
        return ExecutionResult(
            test_case_id=test_case_id,
            actual_output=None,
            passed=False,
            error=f"Time Limit Exceeded (>{TIMEOUT_SECONDS}s)",
            execution_time_ms=TIMEOUT_SECONDS * 1000,
        )
    except Exception as e:
        return ExecutionResult(
            test_case_id=test_case_id,
            actual_output=None,
            passed=False,
            error=str(e),
            execution_time_ms=0,
        )
    finally:
        try:
            os.unlink(tmp_path)
        except Exception:
            pass


def normalize_output(s: str) -> str:
    """Normalize output for comparison."""
    if s is None:
        return ""
    return "\n".join(line.rstrip() for line in s.strip().splitlines())


def run_test_cases(
    code: str, test_cases: list[TestCase], language: str
) -> list[ExecutionResult]:
    """Run all test cases and return results."""
    results = []

    for tc in test_cases:
        if language == "python":
            result = execute_python(code, tc.input, tc.id)
        else:
            # For hackathon: only Python execution supported
            result = ExecutionResult(
                test_case_id=tc.id,
                actual_output=None,
                passed=False,
                error=f"Execution for {language} not yet supported in this MVP",
                execution_time_ms=0,
            )

        # Compare output
        if result.error is None and tc.expected_output is not None:
            actual_norm = normalize_output(result.actual_output or "")
            expected_norm = normalize_output(tc.expected_output)
            result.passed = actual_norm == expected_norm
            result.expected_output = tc.expected_output
        elif result.error is None and tc.expected_output is None:
            # No expected output — mark as ran successfully
            result.passed = True

        results.append(result)

    return results