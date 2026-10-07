module;

#include <boost/multiprecision/cpp_int.hpp>

export module Problem441;

import std;

using boost::multiprecision::cpp_rational;

namespace Problem441 {
	export double solve(int upperBound) {
		double sum = 0;
		for (int smaller = 1; smaller < upperBound; smaller++) {
			for (int larger = smaller + 1; larger <= upperBound; larger++) {
				if (std::gcd(smaller, larger) != 1) { continue; }
				int min = larger;
				int max = std::min(upperBound, smaller + larger);
				int count = (max < min) ? 0 : (max - min + 1);
				double term = static_cast<double>(count) / static_cast<double>(smaller * larger);
				sum += term;
			}
		}
		return sum;
	}

	export void run() {
		double answer = Problem441::solve(10'000);
		std::cout << "Answer: " << answer << "\n";
	}
}