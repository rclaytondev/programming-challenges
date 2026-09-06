export module Problem1004;

import std;
import MathUtils;

namespace Problem1004 {
	int maxDecreasing(const std::vector<int>& nums, int max = 9) {
		if (nums.size() == 0) {
			return 0;
		}
		int maxDecreasing = 0;
		for (int i = 0; i < nums.size(); i++) {
			std::vector<int> remaining{ nums.begin() + i + 1, nums.end() };
			if (nums[i] <= max) {
				maxDecreasing = std::max(maxDecreasing, 1 + Problem1004::maxDecreasing(remaining, nums[i] - 1));
			}
			maxDecreasing = std::max(maxDecreasing, Problem1004::maxDecreasing(remaining, max));
		}
		return maxDecreasing;
	}
	int maxNondecreasing(const std::vector<int>& nums, int min = 0) {
		if (nums.size() == 0) {
			return 0;
		}
		int maxNondecreasing = 0;
		for (int i = 0; i < nums.size(); i++) {
			std::vector<int> remaining{ nums.begin() + i + 1, nums.end() };
			if (nums[i] >= min) {
				maxNondecreasing = std::max(maxNondecreasing, 1 + Problem1004::maxNondecreasing(remaining, nums[i]));
			}
			maxNondecreasing = std::max(maxNondecreasing, Problem1004::maxNondecreasing(remaining, min));
		}
		return maxNondecreasing;
	}

	bool isBalanced(int num) {
		auto digits{ MathUtils::digits(num) };
		int maxDecreasing = Problem1004::maxDecreasing(digits);
		int maxNondecreasing = Problem1004::maxNondecreasing(digits);
		return (maxDecreasing == maxNondecreasing);
	}

	export std::vector<int> allBalanced(int maxDigits) {
		std::vector<int> result;
		for (int i = 1; i < std::pow(10, maxDigits); i++) {
			if (Problem1004::isBalanced(i)) {
				result.push_back(i);
			}
		}
		return result;
	}
}