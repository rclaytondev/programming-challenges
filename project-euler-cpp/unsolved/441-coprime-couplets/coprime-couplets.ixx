export module Problem441;

import std;
import PeriodicSet;

namespace Problem441 {
	export int firstWithRemainder(int remainder, int modulo, int min) {
		int smaller = modulo * (min / modulo) + remainder;
		int larger = modulo * (min / modulo + 1) + remainder;
		return smaller >= min ? smaller : larger;
	}

	int calls = 0;
	int iterations = 0;

	std::map<std::vector<int>, double> reciprocalSumCache;
	std::map<std::vector<int>, double> decreasingReciprocalSumCache;
	double reciprocalSum(int remainder, int modulo, int max) {
		std::vector<int> args = { remainder, modulo, max };
		auto it = Problem441::reciprocalSumCache.find(args);
		if (it != Problem441::reciprocalSumCache.end()) {
			return it->second;
		}

		calls++;

		double sum = 0;
		int first = Problem441::firstWithRemainder(remainder, modulo, 1);
		for (int i = first; i <= max; i += modulo) {
			sum += 1.0 / i;
			Problem441::iterations++;
		}
		Problem441::reciprocalSumCache[args] = sum;
		return sum;
	}
	double decreasingReciprocalSum(int remainder, int modulo, int max, int upperBound) {
		std::vector<int> args = { remainder, modulo, max, upperBound };
		auto it = Problem441::decreasingReciprocalSumCache.find(args);
		if (it != Problem441::decreasingReciprocalSumCache.end()) {
			return it->second;
		}

		calls++;

		double sum = 0;
		int first = Problem441::firstWithRemainder(remainder, modulo, 1);
		for (int i = first; i <= max; i += modulo) {
			sum += static_cast<double>(upperBound - i + 1) / i;
			Problem441::iterations++;
		}
		Problem441::decreasingReciprocalSumCache[args] = sum;
		return sum;
	}

	double lowCoprimeCoupletSum(int smaller, const PeriodicSet<int>& coprime, int upperBound) {
		if (smaller > upperBound - smaller) { return 0; }
		double sum = 0;
		for (int remainder : coprime.offsets) {
			auto upToMax = Problem441::reciprocalSum(remainder, coprime.period, upperBound - smaller);
			auto upToMin = Problem441::reciprocalSum(remainder, coprime.period, smaller);
			sum += upToMax - upToMin;
		}
		return static_cast<double>(smaller + 1) / smaller * sum;
	}
	double highCoprimeCoupletSum(int smaller, const PeriodicSet<int>& coprime, int upperBound) {
		int min = std::max(smaller + 1, upperBound - smaller + 1);
		double sum = 0;
		for (int remainder : coprime.offsets) {
			auto upToMax = Problem441::decreasingReciprocalSum(remainder, coprime.period, upperBound, upperBound);
			auto upToMin = Problem441::decreasingReciprocalSum(remainder, coprime.period, min - 1, upperBound);
			sum += upToMax - upToMin;
		}
		return sum / smaller;
	}
	double coprimeCoupletSum(int smaller, int upperBound) {
		PeriodicSet<int> coprime = PeriodicSet<int>::coprimeTo(smaller);
		auto low = Problem441::lowCoprimeCoupletSum(smaller, coprime, upperBound);
		auto high = Problem441::highCoprimeCoupletSum(smaller, coprime, upperBound);
		return low + high;
	}

	export double solve(int upperBound) {
		double sum = 0;
		for (int smaller = 1; smaller < upperBound; smaller++) {
			sum += Problem441::coprimeCoupletSum(smaller, upperBound);
		}
		return sum;
	}

	export void run() {
		double answer = Problem441::solve(2'000);
		std::cout << "Answer: " << answer << " in " << Problem441::calls << " calls to reciprocalSum and decreasingReciprocalSum, and " << Problem441::iterations << " iterations" << "\n";
	}
}
