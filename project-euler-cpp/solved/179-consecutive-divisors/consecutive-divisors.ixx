export module Problem179;

import std;

namespace Problem179 {
	export std::vector<int> allDivisorCounts(int num) {
		std::vector<int> counts(num + 1, 2);
		counts[0] = 0;
		counts[1] = 1;

		for (int i = 2; i <= num; i++) {
			for (int j = 2 * i; j <= num; j+= i) {
				counts[j]++;
			}
		}
		return counts;
	}

	export int solve(int upperBound) {
		int count = 0;
		std::vector<int> divisorCounts = Problem179::allDivisorCounts(upperBound);
		for (int i = 1; i < upperBound; i++) {
			if (divisorCounts[i] == divisorCounts[i + 1]) {
				count++;
			}
		}
		return count;
	}

	export void run() {
		int answer = Problem179::solve(std::pow(10, 7));
		std::cout << "Answer: " << answer << "\n";
	}
}