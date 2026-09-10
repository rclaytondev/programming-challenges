export module Problem429;

import Factorization;
import MathUtils;
import Modular;
import std;

namespace Problem429 {
	export template<long long modulo>
	auto unitaryDivSumSq(Factorization<long long> factorization) {
		Modular<long long, modulo> product = 1;
		for (const auto& [prime, exponent] : factorization.exponents) {
			Modular<long long, modulo> term = 1LL + MathUtils::pow<Modular<long long, modulo>, long long>(
				Modular<long long, modulo>{prime},
				2LL * exponent
			);
			product *= term;
		}
		return product;
	}

	export template<long long modulo>
	Modular<long long, modulo> solve(long long num) {
		Factorization<long long> factorial{ Factorization<long long>::factorial(num) };
		return Problem429::unitaryDivSumSq<modulo>(factorial);
	}

	export void run() {
		Modular answer = Problem429::solve< 1'000'000'009>(100'000'000);
		std::cout << "Answer: " << answer << "\n";
	}
}