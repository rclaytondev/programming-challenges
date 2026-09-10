module;

#include <boost/numeric/ublas/matrix.hpp>

export module MathUtils;

import std;

using boost::numeric::ublas::matrix;

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

	export template<typename T, typename N, auto multiply>
	T pow(T base, N exponent) {
		T power = base;
		T result = 1;
		for (N exp = 1; exp <= exponent; exp *= 2) {
			if ((exponent & exp) != 0) {
				result *= power;
			}
			power = power * power;
		}
		return result;
	}
	export template<typename T, typename N>
	T pow(T base, N exponent) {
		// Used for computing integer powers (std::pow is for floats and can lose precision).
		return MathUtils::pow < T, N, std::multiplies<T>{} > (base, exponent);
	}

	export template<typename N>
	N mod(N num, N modulo) {
		if (num < 0) {
			if (num % modulo == 0) { return num % modulo; }
			return modulo - ((-num) % modulo);
		}
		return num % modulo;
	}

	export template<typename T>
		requires std::integral<T>
	std::vector<T> primes(T upperBound) {
		std::vector<bool> foundFactors(upperBound + 1, false);
		std::vector<T> primes;
		for (T i = 2; i <= upperBound; i++) {
			const bool isPrime = !foundFactors[i];
			if (isPrime) {
				primes.push_back(i);
				for (T j = i * i; j <= upperBound; j += i) {
					foundFactors[j] = true;
				}
			}
		}
		return primes;
	}
	export template<typename T>
		requires std::integral<T>
	bool isPrime(T num) {
		if (num <= 1) { return false; }
		for (T i = 2; i * i <= num; i ++) {
			if (num % i == 0) {
				return false;
			}
		}
		return true;
	}
}

export template<typename N>
bool operator==(const matrix<N>& m1, const matrix<N>& m2) {
	if (m1.size1() != m2.size1() || m1.size2() != m2.size2()) {
		return false;
	}

	for (int i = 0; i < m1.size1(); i++) {
		for (int j = 0; j < m2.size2(); j++) {
			if (m1(i, j) != m2(i, j)) {
				return false;
			}
		}
	}
	return true;
}

export template<typename N>
std::ostream& operator<<(std::ostream& os, const matrix<N>& mat) {
	for (int i = 0; i < mat.size1(); i++) {
		for (int j = 0; j < mat.size2(); j++) {
			os << mat(i, j) << ", ";
		}
		os << "\n";
	}
	os << "\n";
	return os;
}
