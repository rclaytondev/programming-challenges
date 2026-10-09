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

	bool contains(N num) const {
		N remainder = MathUtils::mod(num, this->period);
		return this->offsets.contains(remainder);
	}
};