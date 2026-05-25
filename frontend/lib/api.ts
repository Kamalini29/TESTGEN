const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export interface TestCase {
  id: string;
  type: "edge" | "hidden" | "stress" | "adversarial" | "basic";
  input: string;
  expected_output?: string;
  description: string;
  risk_level: "low" | "medium" | "high" | "critical";
  reasoning: string;
}

export interface ExecutionResult {
  test_case_id: string;
  actual_output?: string;
  expected_output?: string;
  passed: boolean;
  error?: string;
  execution_time_ms: number;
  memory_used_kb?: number;
}

export interface FailureAnalysis {
  test_case_id: string;
  failure_reason: string;
  bug_category: string;
  fix_suggestion: string;
  code_snippet?: string;
}

export interface ComplexityInsight {
  time_complexity: string;
  space_complexity: string;
  bottleneck: string;
  optimization_suggestions: string[];
  confidence_score: number;
}

export interface AnalysisResponse {
  test_cases: TestCase[];
  execution_results: ExecutionResult[];
  failure_analyses: FailureAnalysis[];
  complexity_insight: ComplexityInsight;
  overall_score: number;
  summary: string;
  total_passed: number;
  total_failed: number;
  critical_failures: number;
}

export interface RunRequest {
  problem_statement: string;
  solution_code: string;
  language: "python" | "cpp" | "java";
  platform?: string;
}

export async function runAnalysis(request: RunRequest): Promise<AnalysisResponse> {
  const res = await fetch(`${BASE_URL}/api/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: "Unknown error" }));
    throw new Error(err.detail || `HTTP ${res.status}`);
  }

  return res.json();
}

export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE_URL}/api/health`);
    return res.ok;
  } catch {
    return false;
  }
}

export const EXAMPLE_PROBLEM = `Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

Constraints:
- 2 <= nums.length <= 10^4
- -10^9 <= nums[i] <= 10^9
- -10^9 <= target <= 10^9
- Only one valid answer exists.

Example:
Input: nums = [2,7,11,15], target = 9
Output: [0,1]`;

export const EXAMPLE_CODE = `def twoSum(nums, target):
    seen = {}
    for i, num in enumerate(nums):
        complement = target - num
        if complement in seen:
            return [seen[complement], i]
        seen[num] = i
    return []

import sys
input_data = sys.stdin.read().split()
n = int(input_data[0])
nums = list(map(int, input_data[1:n+1]))
target = int(input_data[n+1])
print(twoSum(nums, target))`;