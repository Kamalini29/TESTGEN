import os
import json
import re
from groq import AsyncGroq
from dotenv import load_dotenv
from models import TestCase, FailureAnalysis, ComplexityInsight, ExecutionResult
from services.prompts import GENERATE_TEST_CASES_PROMPT, ANALYZE_FAILURES_PROMPT

load_dotenv()

client = AsyncGroq(api_key=os.getenv("GROQ_API_KEY"))
MODEL = "llama-3.3-70b-versatile"

def _extract_json(text: str) -> dict:
    text = text.strip()
    text = re.sub(r"^```(?:json)?\s*", "", text)
    text = re.sub(r"\s*```$", "", text)
    start = text.find("{")
    end = text.rfind("}") + 1
    if start != -1 and end > start:
        text = text[start:end]
    return json.loads(text)

async def generate_test_cases(problem_statement, solution_code, language, platform):
    prompt = GENERATE_TEST_CASES_PROMPT.format(
        problem_statement=problem_statement,
        solution_code=solution_code,
        language=language,
        platform=platform,
    )
    response = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are an expert competitive programming judge. Respond with valid JSON only. No markdown, no explanation outside JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=4000,
    )
    data = _extract_json(response.choices[0].message.content)
    test_cases = []
    for tc in data.get("test_cases", []):
        test_cases.append(TestCase(
            id=tc["id"],
            type=tc["type"],
            input=tc["input"],
            expected_output=tc.get("expected_output"),
            description=tc["description"],
            risk_level=tc["risk_level"],
            reasoning=tc["reasoning"],
        ))
    return test_cases

async def analyze_failures(problem_statement, solution_code, language, failed_cases, all_results):
    if not failed_cases:
        complexity = ComplexityInsight(
            time_complexity="Unknown",
            space_complexity="Unknown",
            bottleneck="No failures detected",
            optimization_suggestions=["Solution passed all generated test cases"],
            confidence_score=95.0,
        )
        return [], complexity, 100.0, "All test cases passed! Solution appears robust."

    results_summary = [
        {"id": r.test_case_id, "passed": r.passed, "actual": r.actual_output,
         "expected": r.expected_output, "error": r.error, "time_ms": r.execution_time_ms}
        for r in all_results
    ]
    prompt = ANALYZE_FAILURES_PROMPT.format(
        problem_statement=problem_statement,
        solution_code=solution_code,
        language=language,
        failed_cases=json.dumps(failed_cases, indent=2),
        all_results=json.dumps(results_summary, indent=2),
    )
    response = await client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a senior code reviewer. Respond with valid JSON only. No markdown outside JSON."},
            {"role": "user", "content": prompt},
        ],
        temperature=0.3,
        max_tokens=4000,
    )
    data = _extract_json(response.choices[0].message.content)
    analyses = [
        FailureAnalysis(
            test_case_id=fa["test_case_id"],
            failure_reason=fa["failure_reason"],
            bug_category=fa["bug_category"],
            fix_suggestion=fa["fix_suggestion"],
            code_snippet=fa.get("code_snippet"),
        )
        for fa in data.get("failure_analyses", [])
    ]
    ci = data.get("complexity_insight", {})
    complexity = ComplexityInsight(
        time_complexity=ci.get("time_complexity", "Unknown"),
        space_complexity=ci.get("space_complexity", "Unknown"),
        bottleneck=ci.get("bottleneck", ""),
        optimization_suggestions=ci.get("optimization_suggestions", []),
        confidence_score=ci.get("confidence_score", 50.0),
    )
    return analyses, complexity, data.get("overall_score", 50.0), data.get("summary", "Analysis complete.")
