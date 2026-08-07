export module Problem259;

import std;
import Rational;

namespace Problem259 {
	export int concatDigits(int minDigit, int maxDigit) {
		int result = 0;
		for (int i = minDigit; i <= maxDigit; i++) {
			result += i * std::pow(10, maxDigit - i);
		}
		return result;
	}
	export std::unordered_set<Rational, RationalHasher> reachableRationals(int minDigit, int maxDigit) {
		std::unordered_set<Rational, RationalHasher> reachables;
		reachables.insert(Problem259::concatDigits(minDigit, maxDigit));
		if (minDigit == maxDigit) { return reachables; }

		for (int i = minDigit; i < maxDigit; i++) {
			auto half1{ Problem259::reachableRationals(minDigit, i) };
			auto half2{ Problem259::reachableRationals(i + 1, maxDigit) };
			for (Rational x : half1) {
				for (Rational y : half2) {
					reachables.insert(x + y);
					reachables.insert(x - y);
					reachables.insert(x * y);
					if (y != 0) {
						reachables.insert(x / y);
					}
				}
			}
		}
		return reachables;
	}
	std::unordered_set<int> reachables(int minDigit, int maxDigit) {
		auto reachables = Problem259::reachableRationals(minDigit, maxDigit);
		return reachables
			| std::ranges::views::filter([](Rational x) { return x.isInt(); })
			| std::ranges::views::transform([](Rational x) { return x.numerator / x.denominator; })
			| std::ranges::views::filter([](int x) { return x > 0; })
			| std::ranges::to<std::unordered_set<int>>();
	}

	long long solve() {
		std::unordered_set<int> reachables = Problem259::reachables(1, 9);
		std::unordered_set<long long> longReachables(reachables.begin(), reachables.end());
		return std::reduce(reachables.begin(), reachables.end(), 0LL);
	}

	export void run() {
		long long answer = Problem259::solve();
		std::cout << "Answer: " << answer << "\n";
	}
}