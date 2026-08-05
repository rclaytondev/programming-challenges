export module Problem78;

import std;

namespace Problem78 {
	int calls = 0;

	std::unordered_map<std::uint64_t, int> partitionsCache;
	int partitionsHelper(int num, int maxTerm, int modulo) {
		if (num <= 1) { return 1; }
		if (maxTerm <= 0) { return 0; }
		maxTerm = std::min(num, maxTerm);

		std::uint64_t key = (((std::uint64_t) num) << 32) | maxTerm;
		auto iterator = Problem78::partitionsCache.find(key);
		if (iterator != Problem78::partitionsCache.end()) {
			return iterator->second;
		}

		Problem78::calls ++;

		int withMaxTerm = Problem78::partitionsHelper(num - maxTerm, maxTerm, modulo);
		int withoutMaxTerm = Problem78::partitionsHelper(num, maxTerm - 1, modulo);
		int partitions = (withMaxTerm + withoutMaxTerm) % modulo;

		Problem78::partitionsCache[key] = partitions;
		return partitions;
	}
	export int partitions(int n, int modulo) {
		return partitionsHelper(n, n, modulo);
	}

	export int solve(int divisor, int upperBound = -1) {
		for (int i = 1; i < upperBound || upperBound == -1; i++) {

			for (int j = 1; j < i; j++) {
				partitionsHelper(i, j, divisor); // pre-populate cache to prevent deep recursion
			}
			int partitions = Problem78::partitions(i, divisor);
			//std::cout << "p(" << i << ") == " << partitions << " (mod " << divisor << ").\n";
			if (partitions == 0) {
				return i;
			}
		}
		return -1;
	}

	export void run() {
		int answer = solve(std::pow(10, 6), 10000);
		std::cout << "Answer: " << answer << "\n";
		std::cout << "Calls: " << Problem78::calls << "\n";
	}
}