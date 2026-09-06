module;

export module Factorization;

import std;
import MathUtils;

export class Factorization {
public:
	std::map<int, int> exponents;

	Factorization(std::map<int, int> exponents) : exponents(exponents) { }
	
	int toNumber() {
		int result = 1;
		for (const auto& [prime, exponent] : this->exponents) {
			result *= std::pow(prime, exponent);
		}
		return result;
	}

	static Factorization factorial(int num) {
		std::map<int, int> exponents;
		for (int prime : MathUtils::primes(num)) {
			exponents[num] = 0;
			int power = prime;
			for (int power = prime; power <= num; power *= prime) {
				exponents[prime] += num / power;
			}
		}
		return Factorization(exponents);
	}
};