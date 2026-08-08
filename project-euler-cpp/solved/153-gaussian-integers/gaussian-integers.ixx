export module Problem153;

import std;

namespace Problem153 {
	long long divisorSumSum(long long upperBound) {
		long long sum = upperBound;
		for (long long i = 2; i <= upperBound; i++) {
			sum += i * (upperBound / i);
		}
		return sum;
	}

	long long complexDivisorSumSum(long long upperBound) {
		long long sum = 0;
		for (long long a = 1; a * a <= upperBound; a++) {
			for (long long b = 1; a * a + b * b <= upperBound; b++) {
				long long normSq = a * a + b * b;
				long long generator = std::lcm(std::lcm(a * normSq, b * normSq), a * b) / (a * b);
				long long first = (normSq / generator) * generator;
				long long last = (upperBound / generator) * generator;
				for (int n = first; n <= last; n+= generator) {
					// OPTIMIZATION: this loop can be skipped using the triangular number formula.
					sum += a;
					if (n != normSq) {
						sum += (n * a) / normSq;
					}
				}
			}
		}
		return 2LL * sum;
	}

	export long long solve(long long upperBound) {
		long long real = Problem153::divisorSumSum(upperBound);
		long long complex = Problem153::complexDivisorSumSum(upperBound);
		return real + complex;
	}

	export void run() {
		long long answer = Problem153::solve(std::pow(10, 8));
		std::cout << "Answer: " << answer << "\n";
	}
}