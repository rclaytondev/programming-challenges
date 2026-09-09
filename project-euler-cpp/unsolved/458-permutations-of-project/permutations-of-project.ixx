module;

#include <boost/container_hash/hash.hpp>

export module Problem458;

import std;

export class PartialString {
private:
	std::vector<int> before; // 0th element = just before string
	std::vector<int> after; // 0th element = just after string
	int length; // TODO: replace with long long (since 10^12 is greater than the max int size)
	int alphabetSize;

public:
	PartialString(const std::vector<int>& before, const std::vector<int>& after, int length, int alphabetSize) : before(before), after(after), length(length), alphabetSize(alphabetSize) {
		this->trim();
		this->standardize();
	}
	int getAlphabetSize() const {
		return this->alphabetSize;
	}
	int getLength() const {
		return this->length;
	}
	const std::vector<int>& getBefore() const {
		return this->before;
	}
	const std::vector<int>& getAfter() const {
		return this->after;
	}

private:
	static std::vector<int> trim(const std::vector<int>& nums, int alphabetSize) {
		std::vector<int> result;
		std::set<int> seen;
		for (auto [i, num] : std::views::enumerate(nums)) {
			if (!seen.contains(num) && i < alphabetSize) {
				result.push_back(num);
				seen.insert(num);
			}
			else { break; }
		}
		return result;
	}
	void trim() {
		this->before = std::move(PartialString::trim(this->before, this->alphabetSize));
		this->after = std::move(PartialString::trim(this->after, this->alphabetSize));
	}

	void replace(int value, int replacement) {
		std::ranges::replace(this->before, value, replacement);
		std::ranges::replace(this->after, value, replacement);
	}
	void swap(int label1, int label2) {
		if (label1 == label2) { return; }
		this->replace(label1, -1);
		this->replace(label2, label1);
		this->replace(-1, label2);
	}
	void standardize() {
		int seen = 0;
		for (int i = 0; i < this->before.size(); i++) {
			if (this->before[i] >= seen) {
				this->swap(this->before[i], seen);
				seen++;
			}
		}
		for (int i = 0; i < this->after.size(); i++) {
			if (this->after[i] >= seen) {
				this->swap(this->after[i], seen);
				seen++;
			}
		}
	}

public:
	bool operator==(const PartialString& str) const = default;
};

namespace Problem458 {
	struct PartialStringHasher {
		std::size_t operator()(const PartialString& str) const noexcept {
			std::size_t hash = 0;
			boost::hash_combine(hash, str.getLength());
			boost::hash_combine(hash, str.getAlphabetSize());
			for (int num : str.getBefore()) {
				boost::hash_combine(hash, num);
			}
			for (int num : str.getAfter()) {
				boost::hash_combine(hash, num);
			}
			return hash;
		}
	};
	std::unordered_map<PartialString, long long, PartialStringHasher> cache;

	long long calls = 0;

	long long completions(PartialString str);
	long long completionsByFirst(PartialString str) {
		Problem458::calls++;
		auto it = Problem458::cache.find(str);
		if (it != Problem458::cache.end()) {
			auto [str, result] = *it;
			return result;
		}
		if (str.getLength() == 0) { return 1; }

		long long result = 0;
		for (int first = 0; first < str.getAlphabetSize(); first++) {
			std::vector<int> before{ str.getBefore() };
			std::vector<int> after{ str.getAfter() };
			if (
				(before.size() >= str.getAlphabetSize() - 1 && !std::ranges::contains(before, first))
				|| (str.getLength() == 1 && after.size() >= str.getAlphabetSize() - 1 && !std::ranges::contains(after, first))
			) {
				continue;
			}

			std::vector<int> nextBefore = before;
			nextBefore.insert(nextBefore.begin(), first);
			PartialString next{ nextBefore, after, str.getLength() - 1, str.getAlphabetSize() };
			result += Problem458::completions(next);
		}
		Problem458::cache[str] = result;
		return result;
	}
	std::generator<std::vector<int>> tuples(int maxInclusive, int length) {
		if (length <= 0) {
			co_yield{ };
			co_return;
		}
		for (int last = 0; last <= maxInclusive; last ++) {
			for (auto tuple : Problem458::tuples(maxInclusive, length - 1)) {
				tuple.push_back(last);
				co_yield tuple;
			}
		}
	}
	long long completions(PartialString str) {
		if (str.getLength() < str.getAlphabetSize() + 2 || str.getLength() % 2 == str.getAlphabetSize() % 2) {
			return Problem458::completionsByFirst(str);
		}

		int centerLength = str.getAlphabetSize() - 1;
		int half = (str.getLength() - centerLength) / 2;
		long long result = 0;
		for (const std::vector<int>& center : Problem458::tuples(str.getAlphabetSize(), centerLength)) {
			std::vector<int> reversed(centerLength);
			std::reverse_copy(center.begin(), center.end(), reversed.begin());

			PartialString left{ str.getBefore(), center, half, str.getAlphabetSize() };
			PartialString right{ reversed, str.getAfter(), half, str.getAlphabetSize()};
			long long leftCompletions = Problem458::completions(left);
			long long rightCompletions = Problem458::completions(right);
			result += leftCompletions * rightCompletions;
		}
		return result;
	}

	export long long solve(int length, int alphabetSize) {
		PartialString empty{ {}, {}, length, alphabetSize };
		return Problem458::completions(empty);
	}

	export void run() {
		long long answer = Problem458::solve(7, 5);
		std::cout << "Answer: " << answer << "\n";
		std::cout << "Function calls: " << Problem458::calls << "\n";
	}
}