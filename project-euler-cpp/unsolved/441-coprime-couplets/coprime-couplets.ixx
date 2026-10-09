module;

#include <boost/multiprecision/cpp_int.hpp>

export module Problem441;

import std;
import PeriodicSet;

using boost::multiprecision::cpp_rational;

namespace Problem441 {
	cpp_rational coprimeCoupletSum(int smaller, int upperBound) {
		PeriodicSet<int> coprime = PeriodicSet<int>::coprimeTo(smaller);
		cpp_rational sum = 0;
		for (int larger = smaller + 1; larger <= upperBound; larger++) {
			if (!coprime.contains(larger)) { continue; }
			int min = larger;
			int max = std::min(upperBound, smaller + larger);
			int count = (max < min) ? 0 : (max - min + 1);
			cpp_rational term(count, smaller * larger);
			sum += term;
		}
		return sum;
	}

	export cpp_rational solve(int upperBound) {
		cpp_rational sum = 0;
		for (int smaller = 1; smaller < upperBound; smaller++) {
			sum += Problem441::coprimeCoupletSum(smaller, upperBound);
		}
		return sum;
	}

	export void run() {
		cpp_rational answer = Problem441::solve(2'000);
		std::cout << "Answer: " << answer << " = " << answer.convert_to<double>() << "\n";
	}
}
