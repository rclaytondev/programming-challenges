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

	export template<typename T> T pow(T base, int exponent, int modulo = -1) {
		// Used for computing integer powers (std::pow is for floats and can lose precision).
		T power = base;
		T result = 1;
		for (int exp = 1; exp <= exponent; exp *= 2) {
			if ((exponent & exp) != 0) {
				result *= power;
				if (modulo > 0) {
					result %= modulo;
				}
			}
			power = power * power;
		}
		return result;
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
