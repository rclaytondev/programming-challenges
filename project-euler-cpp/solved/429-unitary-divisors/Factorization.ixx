module;

export module Factorization;

import std;
import MathUtils;

export template<typename N>
	requires std::integral<N>
class Factorization {
public:
	std::map<N, N> exponents;

	Factorization(std::map<N, N> exponents) : exponents(exponents) { }
	
	N toNumber() {
		int result = 1;
		for (const auto& [prime, exponent] : this->exponents) {
			result *= std::pow(prime, exponent);
		}
		return result;
	}
	bool isValid() {
		for (const auto& [prime, exponent] : this->exponents) {
			if (!MathUtils::isPrime(prime)) {
				return false;
			}
		}
		return true;
	}

	static Factorization factorial(N num) {
		std::map<N, N> exponents;
		for (N prime : MathUtils::primes(num)) {
			exponents[prime] = 0;
			for (N power = prime; power <= num; power *= prime) {
				exponents[prime] += num / power;
			}
		}
		return Factorization(exponents);
	}
};