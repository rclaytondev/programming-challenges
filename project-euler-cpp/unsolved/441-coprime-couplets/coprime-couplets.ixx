module;

#include <boost/multiprecision/cpp_int.hpp>

export module Problem441;

import std;
import PeriodicSet;

using boost::multiprecision::cpp_rational;

namespace Problem441 {
	export int firstWithRemainder(int remainder, int modulo, int min) {
		int smaller = modulo * (min / modulo) + remainder;
		int larger = modulo * (min / modulo + 1) + remainder;
		return smaller >= min ? smaller : larger;
	}

	cpp_rational reciprocalSum(int remainder, int modulo, int min, int max) {
		cpp_rational sum = 0;
		int first = Problem441::firstWithRemainder(remainder, modulo, min);
		for (int i = first; i <= max; i += modulo) {
			sum += cpp_rational{ 1, i };
		}
		return sum;
	}

	cpp_rational coprimeCoupletSum(int smaller, int upperBound) {
		PeriodicSet<int> coprime = PeriodicSet<int>::coprimeTo(smaller);
		cpp_rational sum = 0;
		for (int larger = smaller + 1; larger <= upperBound; larger++) {
			if (!coprime.contains(larger)) { continue; }
			int count = (larger <= upperBound - smaller) ? smaller + 1 : upperBound - larger + 1;
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
