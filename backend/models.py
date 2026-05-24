from pydantic import BaseModel
from typing import Optional, List
from enum import Enum


class Language(str, Enum):
    python = "python"
    cpp = "cpp"
    java = "java"


class TestCaseType(str, Enum):
    edge = "edge"
    hidden = "hidden"
    stress = "stress"
    adversarial = "adversarial"
    basic = "basic"


class GenerateRequest(BaseModel):
    problem_statement: str
    solution_code: str
    language: Language = Language.python
    platform: Optional[str] = "general"  # leetcode, hackerrank, codeforces


class TestCase(BaseModel):
    id: str
    type: TestCaseType
    input: str
    expected_output: Optional[str] = None
    description: str
    risk_level: str  # low, medium, high, critical
    reasoning: str


class ExecutionResult(BaseModel):
    test_case_id: str
    actual_output: Optional[str] = None
    expected_output: Optional[str] = None
    passed: bool
    error: Optional[str] = None
    execution_time_ms: float
    memory_used_kb: Optional[float] = None


class FailureAnalysis(BaseModel):
    test_case_id: str
    failure_reason: str
    bug_category: str  # off-by-one, overflow, edge-case, logic, etc.
    fix_suggestion: str
    code_snippet: Optional[str] = None


class ComplexityInsight(BaseModel):
    time_complexity: str
    space_complexity: str
    bottleneck: str
    optimization_suggestions: List[str]
    confidence_score: float  # 0-100


class FullAnalysisResponse(BaseModel):
    test_cases: List[TestCase]
    execution_results: List[ExecutionResult]
    failure_analyses: List[FailureAnalysis]
    complexity_insight: ComplexityInsight
    overall_score: float  # 0-100
    summary: str
    total_passed: int
    total_failed: int
    critical_failures: int


class RunRequest(BaseModel):
    problem_statement: str
    solution_code: str
    language: Language = Language.python
    platform: Optional[str] = "general"
