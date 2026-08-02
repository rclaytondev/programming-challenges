export module Problem124;

import std;

namespace Problem124 {
	static auto factorize(int num) {
		std::map<int, int> factors = {};
		for (int i = 2; i * i <= num; i++) {
			if (num % i == 0) {
				factors[i] = 1;
				num /= i;
				while (num % i == 0) {
					factors[i]++;
					num /= i;
				}
			}
		}
		if (num != 1) {
			factors[num] = 1;
		}
		return factors;
	}

	static auto getMapKeys(std::map<int, int> map) {
		std::vector<int> keys = {};
		for (const auto& [key, value] : map) {
			keys.push_back(key);
		}
		return keys;
	}

	static auto getRadical(int num) {
		auto factorization = factorize(num);
		auto factors = getMapKeys(factorization);
		return std::reduce(factors.begin(), factors.end(), 1, std::multiplies{});
	}

	class NumberWithRadical {
	public:
		int radical;
		int num;

		NumberWithRadical(int num) : num(num), radical(getRadical(num)) {}

		auto operator<=>(const NumberWithRadical&) const = default;
	};

	export int solve(int upperBound, int index) {
		std::vector<Problem124::NumberWithRadical> nums = {};
		for (int i = 1; i <= upperBound; i++) {
			nums.push_back(Problem124::NumberWithRadical{ i });
		}
		std::sort(nums.begin(), nums.end());
		return nums[index - 1].num;
	}

	export void run() {
		std::cout << "Test " << solve(10, 4) << "\n";
		std::cout << "Test " << solve(10, 6) << "\n";
		std::cout << "Answer " << solve(100000, 10000);
	}
}
