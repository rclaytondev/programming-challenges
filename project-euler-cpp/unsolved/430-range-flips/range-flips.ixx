module;

#include <boost/math/special_functions/binomial.hpp>
#include <boost/math/tools/polynomial.hpp>
#include <boost/multiprecision/cpp_int.hpp>
#include <boost/multiprecision/cpp_dec_float.hpp>

export module Problem430;

using boost::math::tools::polynomial;
using boost::multiprecision::cpp_rational;
using boost::multiprecision::cpp_dec_float_100;

import std;

namespace Problem430 {
	export template<typename Num, auto fromInt>
		requires std::invocable<decltype(fromInt), int>
	polynomial<Num> monomialSummation(int power) {
		std::vector<Num> coefs{ fromInt(1) / fromInt(power + 1) };
		for (int i = power - 1; i >= 0; i--) {
			Num coef{ fromInt(0) };
			for (int k = i + 2; k <= power + 1; k++) {
				long long sign = (k % 2 == i % 2) ? 1 : -1;
				long long binomial = boost::math::binomial_coefficient<double>(k, i);
				int index = coefs.size() - 1 - (k - (i + 2));
				coef += fromInt(sign * binomial) * coefs[index];
			}
			coef /= fromInt(i + 1);
			coefs.push_back(coef);
		}
		coefs.push_back(fromInt(0));
		std::vector<Num> reversed(coefs.rbegin(), coefs.rend());
		return polynomial<Num> {reversed};
	}
	export template<typename Num, auto fromInt>
		requires std::invocable<decltype(fromInt), int>
	polynomial<Num> summation(polynomial<Num> poly) {
		std::vector<Num> coefs = poly.data();
		polynomial<Num> sum;
		for (int i = 0; i < coefs.size(); i++) {
			Num coef{ coefs[i] };
			sum += Problem430::monomialSummation<Num, fromInt>(i)* coef;
		}
		return sum;
	}

	export template<typename Num> cpp_rational cppRationalFromInt(Num num) {
		return cpp_rational{ num };
	}

	template<typename N>
	std::vector<N> powers(N initial, N multiplier, int count) {
		std::vector<N> powers{ initial };
		std::generate_n(
			std::back_inserter(powers), count - 1,
			[multiplier, p = initial]() mutable {
				return p *= multiplier;
			}
		);
		return powers;
	}


	polynomial<cpp_dec_float_100> flipChance(long long disks) {
		polynomial<cpp_dec_float_100> left{ -1, 1 };
		polynomial<cpp_dec_float_100> right{ cpp_dec_float_100(disks), -1 };
		return polynomial< cpp_dec_float_100>{ 1.0 } - ((left * left) + (right * right)) / ( disks * disks );
	}
	polynomial<cpp_dec_float_100> whiteChance(long long disks, int iterations) {
		auto flipChance{ Problem430::flipChance(disks) };
		auto nonFlipChance{ polynomial<cpp_dec_float_100>{1} - flipChance };

		auto flipChancePowers{ Problem430::powers(polynomial<cpp_dec_float_100>{{1.0}}, flipChance, iterations + 1) };
		auto nonFlipChancePowers{ Problem430::powers(polynomial<cpp_dec_float_100>{{1.0}}, nonFlipChance, iterations + 1) };

		polynomial<cpp_dec_float_100> sum;
		for (int n = 0; n <= iterations; n += 2) {
			cpp_dec_float_100 binomial{ boost::math::binomial_coefficient<double>(iterations, n) };
			sum += (binomial
				* flipChancePowers[n]
				* nonFlipChancePowers[iterations - n]
			);
		}
		return sum;
	}
	export cpp_dec_float_100 expectedWhites(long long disks, int iterations) {
		auto whiteChance{ Problem430::whiteChance(disks, iterations) };
		auto whiteChanceSum{ Problem430::summation < cpp_dec_float_100, [](int n) { return cpp_dec_float_100 { n }; } > (whiteChance) };
		return whiteChanceSum(static_cast<double>(disks));
	}


	export void run() {
		cpp_dec_float_100 answer{ Problem430::expectedWhites(100, 30) };
		std::cout << "Answer: " << answer << "\n";
	}
}
