export module Problem458;

import std;

export class PartialString {
private:
	std::vector<int> before; // 0th element = just before string
	std::vector<int> after; // 0th element = just after string
	int length;
	int alphabetSize;

public:
	PartialString(std::vector<int> before, std::vector<int> after, int length, int alphabetSize) : before(before), after(after), length(length), alphabetSize(alphabetSize) {
		this->trim();
		this->standardize();
	}
	const std::vector<int>& getBefore() {
		return this->before;
	}
	const std::vector<int>& getAfter() {
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
		//int seen = 0;
		//for (int i = 0; i < this->before.size(); i++) {
		//	if (this->before[i] >= seen) {

		//	}
		//}
	}
};