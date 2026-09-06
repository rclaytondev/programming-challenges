export module MathUtils;

import std;

namespace MathUtils {
	export std::vector<int> digitsReversed(int num) {
		std::vector<int> digits;
		while (num != 0) {
			digits.push_back(num % 10);
			num /= 10;
		}
		return digits;
	}
	export std::vector<int> digits(int num) {
		std::vector<int> reversed{ MathUtils::digitsReversed(num) };
		return std::vector<int> { reversed.rbegin(), reversed.rend() };
	}
}
