export module Problem386;

import std;
import MathUtils;
import Factorization;
import RectPrism;

using Antichain = std::set<int>;

namespace Problem386 {
	bool isUnionAntichain(const Antichain& antichain1, const Antichain& antichain2) {
		for (int x : antichain1) {
			for (int y : antichain2) {
				if (x % y == 0 || y % x == 0) { return false; }
			}
		}
		return true;
	}

	std::set<Antichain> combine(const std::set<Antichain>& antichains1, const std::set<Antichain>& antichains2) {
		std::set<Antichain> result;
		for (const Antichain antichain1 : antichains1) {
			const int max = *antichain1.rbegin();
			for (auto it = antichains2.lower_bound({ max + 1 }); it != antichains2.end(); it ++) {
				const Antichain antichain2 = *it;
				if (Problem386::isUnionAntichain(antichain1, antichain2)) {
					Antichain setUnion;
					std::set_union(
						antichain1.begin(), antichain1.end(),
						antichain2.begin(), antichain2.end(),
						std::inserter(setUnion, setUnion.begin())
					);
					result.insert(setUnion);
				}
			}
		}
		return result;
	}

	export bool isUnimodal(const std::vector<int>& nums) {
		if (nums.size() <= 2) { return true; }
		bool decreasing = false;
		for (int i = 0; i < nums.size() - 1; i++) {
			if (nums[i] > nums[i + 1]) {
				decreasing = true;
			}
			else if (nums[i] < nums[i + 1] && decreasing) {
				return false;
			}
		}
		return true;
	}

	export template<typename T>
	bool allOf(const std::vector<T>& vec, std::function<bool(T, int)> predicate) {
		for (int i = 0; i < vec.size(); i++) {
			if (!predicate(vec[i], i)) { return false; }
		}
		return true;
	}


	export std::optional<std::map<std::vector<int>, std::vector<int>>> injectiveChainMap(const std::set<std::vector<int>>& domain, const std::set<std::vector<int>>& codomain) {
		if (domain.size() > codomain.size()) {
			return std::nullopt;
		}
		if (domain.size() == 0) {
			return std::optional{ std::map<std::vector<int>, std::vector<int>>{} };
		}
		std::vector<int> first = *domain.begin();
		std::set<std::vector<int>> nextDomain = domain;
		nextDomain.erase(first);
		for (const std::vector<int>& next : codomain) {
			bool smaller = Problem386::allOf<int>(first, [&next](int val, int i) { return val <= next[i]; });
			bool greater = Problem386::allOf<int>(first, [&next](int val, int i) { return val >= next[i]; });
			if (!(smaller || greater)) {
				continue;
			}
			std::set<std::vector<int>> nextCodomain = codomain;
			nextCodomain.erase(next);
			auto map = Problem386::injectiveChainMap(nextDomain, nextCodomain);
			if (map.has_value()) {
				(*map)[first] = next;
				return map;
			}
		}
		return std::nullopt;
	}


	export std::optional<int> longestDiagonalAntichain(const RectPrism<int>& poset) {
		/* Returns the length of the longest "diagonal antichain" if it can prove it is among the longest antichains. */
		auto diagonals = poset.diagonals();
		auto diagonalLengths = (diagonals
			| std::views::transform([](const std::set<std::vector<int>>& d) { return d.size(); })
			| std::ranges::to<std::vector<int>>()
		);
		if (!Problem386::isUnimodal(diagonalLengths)) {
			return std::nullopt;
		}

		for (int i = 0; i < diagonals.size() - 1; i++) {
			auto diagonal = diagonals[i];
			auto next = diagonals[i + 1];
			if (diagonal.size() > next.size()) {
				std::swap(diagonal, next);
			}
			auto chainMap = Problem386::injectiveChainMap(diagonal, next);
			if (!chainMap.has_value()) { return std::nullopt; }
		}
		int longest = *std::max_element(diagonalLengths.begin(), diagonalLengths.end());
		return std::optional{ longest };
	}


	std::map<std::map<int, int>, int> cache;
	export int longestAntichain(const std::set<int>& values) {
		std::map<int, std::set<Antichain>> antichainsBySize;
		antichainsBySize[1] = (values
			| std::views::transform([](int v) { return std::set<int>{ v }; })
			| std::ranges::to<std::set<Antichain>>()
		);
		for (int size = 1; size <= values.size(); size *= 2) {
			const std::set<Antichain>& antichains = antichainsBySize[size];
			const std::set<Antichain> combined = Problem386::combine(antichains, antichains);
			antichainsBySize[2 * size] = combined;
			if (combined.size() == 0) { break; }
		}

		int maxExclusive = antichainsBySize.rbegin()->first;
		int minInclusive = maxExclusive / 2;
		while (maxExclusive - minInclusive > 1) {
			int mid = (maxExclusive + minInclusive) / 2;
			const std::set<Antichain>& antichains = Problem386::combine(
				antichainsBySize[minInclusive],
				antichainsBySize[(maxExclusive - minInclusive) / 2]
			);
			antichainsBySize[mid] = antichains;
			if (antichains.size() == 0) {
				maxExclusive = mid;
			}
			else {
				minInclusive = mid;
			}
		}
		return minInclusive;
	}
	template<typename K, typename V>
	std::map<V, int> mapValCounts(const std::map<K, V>& map) {
		std::map<V, int> result;
		for (const auto [key, value] : map) {
			auto it = result.find(value);
			if (it != result.end()) {
				it->second++;
			}
			else {
				result[value] = 1;
			}
		}
		return result;
	}
	int longestAntichain(const Factorization<int>& factorization) {
		if (factorization.exponents.size() == 2) {
			int exponent1 = factorization.exponents.begin()->second;
			int exponent2 = std::next(factorization.exponents.begin())->second;
			return std::min(exponent1, exponent2) + 1;
		}

		std::vector<int> lengths;
		for (const auto& [prime, exp] : factorization.exponents) {
			lengths.push_back(exp + 1);
		}
		RectPrism poset{ lengths };
		auto longestDiag = Problem386::longestDiagonalAntichain(poset);
		if (longestDiag.has_value()) {
			return *longestDiag;
		}

		std::cout << "Reverting to brute-force algorithm on an input of " << factorization.toNumber() << "\n";
		auto divisors = factorization.divisors() | std::ranges::to<std::set<int>>();
		return Problem386::longestAntichain(divisors);
	}
	int longestAntichainMemoized(const Factorization<int>& factorization) {
		std::map<int, int> counts = Problem386::mapValCounts(factorization.exponents);
		auto it = Problem386::cache.find(counts);
		if (it != Problem386::cache.end()) {
			return it->second;
		}

		int result = Problem386::longestAntichain(factorization);
		Problem386::cache[counts] = result;
		return result;
	}


	export long long solve(int upperBound) {
		long long sum = 0;
		for (int n = 1; n <= upperBound; n ++) {
			Factorization fact = n;
			sum += Problem386::longestAntichainMemoized(fact);
		}
		return sum;
	}

	export void run() {
		long long answer = Problem386::solve(3'000'000);
		std::cout << "Answer: " << answer << "\n";
	}
}