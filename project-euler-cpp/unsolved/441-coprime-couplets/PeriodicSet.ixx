export module PeriodicSet;

import std;
import Factorization;

export template<typename N>
class PeriodicSet {
public:
	N period;
	std::set<N> offsets;

	PeriodicSet(N period, std::set<N> offsets) : period(period), offsets(offsets) { }

	static PeriodicSet coprimeTo(N num) {
		N period = Factorization{ num }.radical();
		std::set<int> offsets = { 1 };
		for (int i = 2; i < period; i++) {
			if (std::gcd(i, num) == 1) {
				offsets.insert(i);
			}
		}
		return PeriodicSet{ period, offsets };
	}
};