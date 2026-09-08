export module Problem166;

import std;

namespace Problem166 {
	const int MAX = 9;
	const std::array<int, 10> VALUES = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };

	bool isValid(int num) {
		return 0 <= num && num <= Problem166::MAX;
	}

	long long solve() {
		long long result = 0;
		auto combinations = std::views::cartesian_product(VALUES, VALUES, VALUES, VALUES, VALUES, VALUES, VALUES);
		for (const auto& [x11, x22, x33, x44, x14, x23, x32] : combinations) {
			int sum = x11 + x22 + x33 + x44;
			int x41 = sum - x14 - x23 - x32;
			if (!Problem166::isValid(x41)) { continue; }

			int outerColCombinations = 0;
			for (int x21 = 0; x21 <= Problem166::MAX; x21++) {
				int x31 = sum - x11 - x21 - x41;
				int x24 = sum - x21 - x22 - x23;
				int x34 = sum - x31 - x32 - x33;
				bool lastColValid = (x14 + x24 + x34 + x44) == sum;
				if (lastColValid && Problem166::isValid(x31) && Problem166::isValid(x24) && Problem166::isValid(x34)) {
					outerColCombinations++;
				}
			}
			if (outerColCombinations == 0) { continue; }


			int outerRowCombinations = 0;
			for (int x12 = 0; x12 <= Problem166::MAX; x12++) {
				int x13 = sum - x11 - x12 - x14;
				int x42 = sum - x12 - x22 - x32;
				int x43 = sum - x13 - x23 - x33;
				bool lastRowValid = (x41 + x42 + x43 + x44) == sum;
				if (lastRowValid && Problem166::isValid(x13) && Problem166::isValid(x42) && Problem166::isValid(x43)) {
					outerRowCombinations++;
				}
			}

			result += static_cast<long long>(outerColCombinations) * outerRowCombinations;
		}
		return result;
	}

	export void run() {
		long long answer = Problem166::solve();
		std::cout << "Answer: " << answer << "\n";
	}
}