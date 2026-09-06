export module Problem429;

import Factorization;
import MathUtils;
import std;

namespace Problem429 {
	export int unitaryDivSumSq(const Factorization& factorization, long long modulo) {
		long long product = 1;
		for (const auto& [prime, exponent] : factorization.exponents) {
			long long term = 1 + MathUtils::pow<long long>(prime, 2 * exponent);
			product *= term;
		}
		return product;
	}

	export int solve(long long num, long long modulo = 1'000'000'009) {
		Factorization factorial{ Factorization::factorial(num) };
		std::cout << "done with factorial" << "\n";
		return Problem429::unitaryDivSumSq(factorial, modulo);
	}

	export void run() {
		long long answer = Problem429::solve(100'000'000);
		std::cout << "Answer: " << answer << "\n";
	}
}