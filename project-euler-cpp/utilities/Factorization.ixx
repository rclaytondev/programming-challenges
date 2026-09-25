module;

export module Factorization;

import std;
import MathUtils;
import RectPrism;

export template<typename N>
	requires std::integral<N>
class Factorization {
public:
	std::map<N, N> exponents;

	Factorization() = default;
	Factorization(N num) : exponents(Factorization::factorize(num)) { }
	Factorization(std::map<N, N> exponents) : exponents(exponents) { }
	Factorization(const Factorization& fact) = default;
	Factorization(Factorization&& fact) noexcept = default;

	static std::map<N, N> factorize(int num) {
		std::map<N, N> result;
		for (N n = 2; n * n <= num; n++) {
			int exponent = 0;
			while (num % n == 0) {
				num /= n;
				exponent++;
			}
			if (exponent != 0) {
				result[n] = exponent;
			}
		}
		if (num != 1) {
			result[num] = 1;
		}
		return result;
	}
	static N valuation(N prime, N num) {
		N valuation = 0;
		while (num % prime == 0) {
			num /= prime;
			valuation++;
		}
		return valuation;
	}
	static std::vector<Factorization> factorizeAll(int upperBound) {
		std::vector<Factorization> result(upperBound + 1, 1);
		for (int i = 2; i <= upperBound; i++) {
			if (result[i].exponents.size() == 0) {
				for (int j = i; j <= upperBound; j+= i) {
					result[j].exponents[i] = Factorization::valuation(i, j);
				}
			}
		}
		return result;
	}
	static std::generator<Factorization> factorizeAll() {
		co_yield Factorization{};
		std::map<N, std::set<N>> factors;
		for (N num = 2; true; num++) {
			auto it = factors.find(num);
			if (it == factors.end()) {
				/* `num` is prime */
				std::map<N, N> exponents = { { num, 1 } };
				co_yield Factorization{ exponents };
				auto nextIt = factors.find(num * 2);
				if (nextIt == factors.end()) {
					factors[num * 2] = { num };
				}
				else {
					nextIt->second.insert(num);
				}
			}
			else {
				/* `num` is composite */
				std::map<N, N> exponents;
				for (const N factor : it->second) {
					exponents[factor] = Factorization::valuation(factor, num);
					auto nextIt = factors.find(num + factor);
					if (nextIt == factors.end()) {
						factors[num + factor] = { factor };
					}
					else {
						nextIt->second.insert(factor);
					}
				}
				co_yield Factorization{ exponents };
			}
		}
	}

	std::generator<Factorization> divisors() const {
		std::vector<N > combinations;
		for (const auto& [prime, exponent] : this->exponents) {
			combinations.push_back(exponent + 1);
		}
		RectPrism rectPrism{ combinations };
		for (const std::vector<int>& divExp : rectPrism.points()) {
			std::map<N, N> divExpMap;
			int i = 0;
			for (const auto [prime, _] : this->exponents) {
				divExpMap[prime] = divExp[i];
				i++;
			}
			co_yield Factorization{ divExpMap };
		}
	}
	
	N toNumber() const {
		int result = 1;
		for (const auto& [prime, exponent] : this->exponents) {
			result *= std::pow(prime, exponent);
		}
		return result;
	}
	bool isValid() const {
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

	friend bool operator==(const N& num, const Factorization<N>& factorization) {
		return num == factorization.toNumber();
	}
	friend bool operator==(const Factorization<N>& factorization, const N& num) {
		return num == factorization.toNumber();
	}
	operator N() const {
		return this->toNumber();
	}
};