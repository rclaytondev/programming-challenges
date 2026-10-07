module;

#include <boost/multiprecision/cpp_int.hpp>

export module Problem441;

import std;

using boost::multiprecision::cpp_rational;

namespace Problem441 {
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
		}
		return sum;
	}

	export void run() {
		cpp_rational answer = Problem441::solve(10'000'000);
		std::cout << "Answer: " << answer << " = " << answer.convert_to<double>() << "\n";
	}
}