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
	cpp_rational decreasingReciprocalSum(int remainder, int modulo, int min, int max, int upperBound) {
		cpp_rational sum = 0;
		int first = Problem441::firstWithRemainder(remainder, modulo, min);
		for (int i = first; i <= max; i += modulo) {
			sum += cpp_rational{ upperBound - i + 1, i};
		}
		return sum;
	}

	cpp_rational lowCoprimeCoupletSum(int smaller, const PeriodicSet<int>& coprime, int upperBound) {
		cpp_rational sum = 0;
		for (int remainder : coprime.offsets) {
			sum += Problem441::reciprocalSum(remainder, coprime.period, smaller + 1, upperBound - smaller);
		}
		return cpp_rational{ smaller + 1, smaller } * sum;
	}
	cpp_rational highCoprimeCoupletSum(int smaller, const PeriodicSet<int>& coprime, int upperBound) {
		int min = std::max(smaller + 1, upperBound - smaller + 1);
		cpp_rational sum = 0;
		for (int remainder : coprime.offsets) {
			sum += Problem441::decreasingReciprocalSum(remainder, coprime.period, min, upperBound, upperBound);
		}
		return sum / smaller;
	}
	cpp_rational coprimeCoupletSum(int smaller, int upperBound) {
		PeriodicSet<int> coprime = PeriodicSet<int>::coprimeTo(smaller);
		auto low = Problem441::lowCoprimeCoupletSum(smaller, coprime, upperBound);
		auto high = Problem441::highCoprimeCoupletSum(smaller, coprime, upperBound);
		return low + high;
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
