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

	export std::vector<int> primes(int upperBound) {
		std::vector<bool> foundFactors(upperBound + 1, false);
		std::vector<int> primes;
		for (int i = 2; i <= upperBound; i++) {
			const bool isPrime = !foundFactors[i];
			if (isPrime) {
				primes.push_back(i);
				for (int j = i * i; j <= upperBound; j += i) {
					foundFactors[j] = true;
				}
			}
		}
		return primes;
	}
}
