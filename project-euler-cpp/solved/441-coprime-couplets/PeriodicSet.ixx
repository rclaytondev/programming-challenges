export module PeriodicSet;

import std;
import Factorization;
import MathUtils;

export template<typename N>
class PeriodicSet {
public:
	N period;
	std::set<N> offsets;

	PeriodicSet(N period, std::set<N> offsets) : period(period), offsets(offsets) { }

	static PeriodicSet coprimeTo(N num) {
		if (num == 1) {
			return PeriodicSet{ 1, { 0 } };
		}
		N period = Factorization{ num }.radical();
		std::set<int> offsets = { 1 };
		for (int i = 2; i < period; i++) {
			if (std::gcd(i, num) == 1) {
				offsets.insert(i);
			}
		}
		return PeriodicSet{ period, offsets };
	}
	static PeriodicSet<N> allIntegers() {
		return PeriodicSet<N>{ 1, { 0 } };
	}

	bool contains(N num) const {
		N remainder = MathUtils::mod(num, this->period);
		return this->offsets.contains(remainder);
	}

	double density() const {
		return static_cast<double>(this->offsets.size()) / this->period;
	}

	PeriodicSet<N> complement() const {
		std::set<N> offsets;
		for (int i = 0; i < this->period; i++) {
			if (!this->offsets.contains(i)) {
				offsets.insert(i);
			}
		}
		return PeriodicSet{ this->period, offsets };
	}
};