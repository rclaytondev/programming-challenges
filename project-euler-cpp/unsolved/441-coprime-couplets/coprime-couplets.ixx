export module Problem441;

import std;
import PeriodicSet;

namespace Problem441 {
	extern int iterations;
	extern int calls;
	export int lastWithRemainder(int remainder, int modulo, int max);
}

class PeriodicAdder {
public:
	int remainder;
	int modulo;
	std::vector<double> cache;
	std::function<double(int)> getTerm;

	PeriodicAdder(int remainder, int modulo, std::function<double(int)> getTerm) : remainder(remainder), modulo(modulo), getTerm(getTerm) {}

	double sumUpTo(int max) {
		Problem441::calls++;
		max = Problem441::lastWithRemainder(this->remainder, this->modulo, max);
		double sum = 0;
		int start = (this->remainder == 0) ? this->modulo : this->remainder;
		for (int i = start; i <= max; i+= this->modulo) {
			sum += this->getTerm(i);
			Problem441::iterations++;
		}
		return sum;
	}

	double sumBetween(int min, int max) {
		double upToMax = this->sumUpTo(max);
		double upToMin = (min == 0) ? 0 : this->sumUpTo(min - 1);
		return upToMax - upToMin;
	}
};

namespace Problem441 {
	export int firstWithRemainder(int remainder, int modulo, int min) {
		int smaller = modulo * (min / modulo) + remainder;
		int larger = modulo * (min / modulo + 1) + remainder;
		return smaller >= min ? smaller : larger;
	}
	export int lastWithRemainder(int remainder, int modulo, int max) {
		int smaller = modulo * (max / modulo - 1) + remainder;
		int larger = modulo * (max / modulo) + remainder;
		return larger <= max ? larger : smaller;
	}

	int calls = 0;
	int iterations = 0;

	std::map<std::vector<int>, PeriodicAdder> lowAdders;
	std::map<std::vector<int>, PeriodicAdder> highAdders;

	double lowCoprimeCoupletSum(int smaller, const PeriodicSet<int>& coprime, int upperBound) {
		if (smaller > upperBound - smaller) { return 0; }
		double sum = 0;
		for (int remainder : coprime.offsets) {
			std::vector<int> args = { smaller, upperBound, remainder };
			auto it = Problem441::lowAdders.find(args);
			if (it != Problem441::lowAdders.end()) {
				sum += it->second.sumBetween(smaller + 1, upperBound - smaller);
			}
			else {
				PeriodicAdder adder{ remainder, coprime.period, [](int n) { return 1.0 / n; } };
				Problem441::lowAdders.emplace(args, adder);
				sum += adder.sumBetween(smaller + 1, upperBound - smaller);
			}
		}
		return static_cast<double>(smaller + 1) / smaller * sum;
	}
	double highCoprimeCoupletSum(int smaller, const PeriodicSet<int>& coprime, int upperBound) {
		int min = std::max(smaller + 1, upperBound - smaller + 1);
		double sum = 0;
		for (int remainder : coprime.offsets) {
			std::vector<int> args = { smaller, upperBound, remainder };
			auto it = Problem441::highAdders.find(args);
			if (it != Problem441::highAdders.end()) {
				sum += it->second.sumBetween(min, upperBound);
			}
			else {
				PeriodicAdder adder{ remainder, coprime.period, [upperBound](int n) { return static_cast<double>(upperBound - n + 1) / n; } };
				Problem441::highAdders.emplace(args, adder);
				sum += adder.sumBetween(min, upperBound);
			}
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
		std::cout << "Answer: " << answer << " in " << Problem441::calls << " calls and " << Problem441::iterations << " iterations" << "\n";
	}
}
