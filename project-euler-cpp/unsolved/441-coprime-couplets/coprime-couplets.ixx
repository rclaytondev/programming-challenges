module;

#include <boost/multiprecision/cpp_int.hpp>

export module Problem441;

import std;

using boost::multiprecision::cpp_rational;

namespace Problem441 {
	//int numCoprimeTo(int num, int min, int max) {
	//	int count = 0;
	//	for (int i = min; i <= max; i++) {
	//		if (std::gcd(i, num) == 1) {
	//			count++;
	//		}
	//	}
	//	return count;
	//}

	//cpp_rational sumBySmaller(int smaller, int upperBound) {
	//	cpp_rational sum = 0;
	//	for (int larger = smaller + 1; larger <= upperBound; larger++) {
	//		if (std::gcd(smaller, larger) == 1) {
	//			sum += cpp_rational(1, larger);
	//		}
	//	}
	//	return sum;
	//}

	export cpp_rational solve(int upperBound) {
		cpp_rational sum = 0;
		for (int smaller = 1; smaller < upperBound; smaller++) {
			//if (smaller % 1000 == 0) {
			std::cout << "outer loop: " << smaller << "\n";
			//}
			for (int larger = smaller + 1; larger <= upperBound; larger++) {
				if (larger % 10000 == 0) {
					std::cout << larger << "\n";
				}
				if (std::gcd(smaller, larger) != 1) { continue; }
				int min = larger;
				int max = std::min(upperBound, smaller + larger);
				int count = (max < min) ? 0 : (max - min + 1);
				cpp_rational term(count, smaller * larger);
				sum += term;
			}
			//int numCoprime = Problem441::numCoprimeTo(smaller, smaller + 1, upperBound);
			//int min = smaller + 1;
			//int max = std::min(upperBound, )
			//cpp_rational coef(smaller + 1, smaller);
			//cpp_rational innerSum = Problem441::sumBySmaller(smaller, upperBound);
			//sum += coef * innerSum;
		}
		return sum;
	}

	export void run() {
		cpp_rational answer = Problem441::solve(10'000'000);
		std::cout << "Answer: " << answer << " = " << answer.convert_to<double>() << "\n";
	}
}