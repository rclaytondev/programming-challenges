export module Problem125;

import std;
import MathUtils;

namespace Problem125 {
	std::unordered_set<int> sumsOfSquares(int upperBound) {
		std::unordered_set<int> result;
		for (int start = 1; start * start < upperBound; start++) {
			int sum = start * start + (start + 1) * (start + 1);
			for (int count = 2; sum < upperBound; count++) {
				result.insert(sum);
				sum += (start + count) * (start + count);
			}
		}
		return result;
	}

	bool isPalindrome(int num) {
		std::vector<int> reversed = MathUtils::digitsReversed(num);
		std::vector<int> digits(reversed.rbegin(), reversed.rend());
		return digits == reversed;
	}

	export unsigned long long solve(int upperBound) {
		std::unordered_set<int> sums = Problem125::sumsOfSquares(upperBound);
		std::erase_if(sums, [](int x) { return !Problem125::isPalindrome(x); });
		std::unordered_set<unsigned long long> bigSums(sums.begin(), sums.end());
		return std::reduce(bigSums.begin(), bigSums.end(), 0ULL);
	}

	export void run() {
		unsigned long long answer = Problem125::solve(std::pow(10, 8));
		std::cout << "Answer: " << answer << "\n";
	}
}
