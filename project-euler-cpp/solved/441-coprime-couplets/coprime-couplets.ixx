export module Problem441;

import std;
import PeriodicSet;
import SetUtils;
import Factorization;

namespace Problem441 {
	extern int iterations;
	extern int calls;
	export int lastWithRemainder(int remainder, int modulo, int max);
}

export class PeriodicAdder {
public:
	int remainder;
	int modulo;
	std::map<int, double> cache;
	virtual double getTerm(int) const = 0;

	PeriodicAdder(int remainder, int modulo) : remainder(remainder), modulo(modulo) { }

	int first() {
		return this->remainder == 0 ? this->modulo : this->remainder;
	}

	double sumUpTo(int max) {
		Problem441::calls++;
		max = Problem441::lastWithRemainder(this->remainder, this->modulo, max);
		auto it = this->cache.find(max);
		if (it != this->cache.end()) { return it->second; }

		if (this->cache.size() == 0) {
			int first = this->first();
			this->cache.emplace(first, this->getTerm(first));
		}
		auto [start, sum] = *this->cache.rbegin();
		for (int i = start + this->modulo; i <= max; i+= this->modulo) {
			sum += this->getTerm(i);
			Problem441::iterations++;
			this->cache.emplace(i, sum);
		}
		return sum;
	}

	double sumBetween(int min, int max) {
		double upToMax = this->sumUpTo(max);
		double upToMin = (min == 0) ? 0 : this->sumUpTo(min - 1);
		return upToMax - upToMin;
	}
};

class LowPeriodicAdder : public PeriodicAdder {
public:
	LowPeriodicAdder(int remainder, int modulo) : PeriodicAdder(remainder, modulo) { }

	double getTerm(int n) const override {
		return 1.0 / n;
	}
};
class HighPeriodicAdder : public PeriodicAdder {
public:
	int upperBound;
	HighPeriodicAdder(int remainder, int modulo, int upperBound) : PeriodicAdder(remainder, modulo), upperBound(upperBound) { }

	double getTerm(int n) const override {
		return static_cast<double>(upperBound - n + 1) / n;
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

	std::map<std::vector<int>, LowPeriodicAdder> lowAdders;
	std::map<std::vector<int>, HighPeriodicAdder> highAdders;

	LowPeriodicAdder& getLowAdder(int remainder, int modulo) {
		std::vector<int> args = { remainder, modulo };
		auto it = Problem441::lowAdders.find(args);
		if (it != Problem441::lowAdders.end()) {
			return it->second;
		}

		LowPeriodicAdder adder{ remainder, modulo };
		Problem441::lowAdders.emplace(args, adder);
		return Problem441::lowAdders.at(args);
	}
	HighPeriodicAdder& getHighAdder(int remainder, int modulo, int upperBound) {
		std::vector<int> args = { remainder, modulo, upperBound };
		auto it = Problem441::highAdders.find(args);
		if (it != Problem441::highAdders.end()) {
			return it->second;
		}

		HighPeriodicAdder adder{ remainder, modulo, upperBound };
		Problem441::highAdders.emplace(args, adder);
		return Problem441::highAdders.at(args);
	}

	double lowCoprimeCoupletSum(int smaller, int remainder, int modulo, int upperBound) {
		if (smaller > upperBound - smaller) { return 0; }
		PeriodicAdder& adder = Problem441::getLowAdder(remainder, modulo);
		double sum = adder.sumBetween(smaller + 1, upperBound - smaller);
		return static_cast<double>(smaller + 1) / smaller * sum;
	}
	double highCoprimeCoupletSum(int smaller, int remainder, int modulo, int upperBound) {
		int min = std::max(smaller + 1, upperBound - smaller + 1);
		PeriodicAdder& adder = Problem441::getHighAdder(remainder, modulo, upperBound);
		double sum = adder.sumBetween(min, upperBound);
		return sum / smaller;
	}
	double coprimeCoupletSum(int smaller, int upperBound, double allLowSum, double allHighSum) {
		Factorization factorization = smaller;
		double sum = 0;
		std::set<int> allPrimes = factorization.primes();
		for (const std::set<int> primes : SetUtils::subsets(allPrimes)) {
			if (primes.size() == 0) { continue; }
			int product = std::accumulate(primes.begin(), primes.end(), 1, std::multiplies<int>());
			double low = Problem441::lowCoprimeCoupletSum(smaller, 0, product, upperBound);
			double high = Problem441::highCoprimeCoupletSum(smaller, 0, product, upperBound);
			sum += (low + high) * (primes.size() % 2 == 0 ? -1 : 1);
		}
		return allLowSum + allHighSum - sum;
	}

	export double solve(int upperBound) {
		double sum = 0;
		for (int smaller = 1; smaller < upperBound; smaller++) {
			double allLowSum = Problem441::lowCoprimeCoupletSum(smaller, 0, 1, upperBound);
			double allHighSum = Problem441::highCoprimeCoupletSum(smaller, 0, 1, upperBound);
			sum += Problem441::coprimeCoupletSum(smaller, upperBound, allLowSum, allHighSum);
		}
		return sum;
	}

	export void run() {
		double answer = Problem441::solve(100'000);
		std::cout << "Answer: " << std::format("{}\n", answer) << " in " << Problem441::calls << " calls and " << Problem441::iterations << " iterations" << "\n";
	}
}
