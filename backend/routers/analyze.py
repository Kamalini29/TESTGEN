from fastapi import APIRouter, HTTPException
from models import RunRequest, FullAnalysisResponse
from services.openai_service import generate_test_cases, analyze_failures
from services.executor import run_test_cases

router = APIRouter(prefix="/api", tags=["analysis"])


@router.post("/analyze", response_model=FullAnalysisResponse)
async def full_analyze(request: RunRequest):
    try:
        test_cases = await generate_test_cases(
            problem_statement=request.problem_statement,
            solution_code=request.solution_code,
            language=request.language.value,
            platform=request.platform or "general",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Test generation failed: {str(e)}")

    try:
        execution_results = run_test_cases(
            code=request.solution_code,
            test_cases=test_cases,
            language=request.language.value,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Execution failed: {str(e)}")

    failed_cases = []
    tc_map = {tc.id: tc for tc in test_cases}

    for result in execution_results:
        if not result.passed:
            tc = tc_map.get(result.test_case_id)
            failed_cases.append({
                "test_case_id": result.test_case_id,
                "description": tc.description if tc else "",
                "type": tc.type if tc else "",
                "input": tc.input if tc else "",
                "expected_output": result.expected_output,
                "actual_output": result.actual_output,
                "error": result.error,
                "reasoning": tc.reasoning if tc else "",
            })

    try:
        analyses, complexity, overall_score, summary = await analyze_failures(
            problem_statement=request.problem_statement,
            solution_code=request.solution_code,
            language=request.language.value,
            failed_cases=failed_cases,
            all_results=execution_results,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

    total_passed = sum(1 for r in execution_results if r.passed)
    total_failed = len(execution_results) - total_passed
    critical_failures = sum(
        1 for r in execution_results
        if not r.passed
        and tc_map.get(r.test_case_id)
        and tc_map[r.test_case_id].risk_level == "critical"
    )

    return FullAnalysisResponse(
        test_cases=test_cases,
        execution_results=execution_results,
        failure_analyses=analyses,
        complexity_insight=complexity,
        overall_score=overall_score,
        summary=summary,
        total_passed=total_passed,
        total_failed=total_failed,
        critical_failures=critical_failures,
    )


@router.post("/generate-only")
async def generate_only(request: RunRequest):
    test_cases = await generate_test_cases(
        problem_statement=request.problem_statement,
        solution_code=request.solution_code,
        language=request.language.value,
        platform=request.platform or "general",
    )
    return {"test_cases": test_cases}


@router.get("/health")
async def health():
    return {"status": "ok", "service": "AI Test Case Generator"}