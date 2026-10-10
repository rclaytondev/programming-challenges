export module SetUtils;

import std;
import MathUtils;

namespace SetUtils {
	export template<typename T>
	std::generator<std::set<T>> subsets(std::set<T> values) {
		int size = values.size();
		for (int i = 0; true; i++) {
			std::set<T> subset;
			int j = 1;
			for (const T& value : values) {
				if ((i & j) != 0) {
					subset.insert(subset.end(), value);
				}
				j <<= 1;
			}
			co_yield subset;
			if (subset.size() >= values.size()) { co_return; }
		}
	}
}