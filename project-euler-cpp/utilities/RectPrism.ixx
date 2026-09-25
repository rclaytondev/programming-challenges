export module RectPrism;

import std;

export template<typename N = int>
class RectPrism {
public:
	std::vector<N> lengths;

	RectPrism(const std::vector<N>& lengths) : lengths(lengths) {}

private:
	std::generator<std::vector<N>> points(int startDimension) const {
		if (startDimension < this->lengths.size()) {
			for (std::vector<N> point : this->points(startDimension + 1)) {
				for (N next = 0; next < this->lengths[startDimension]; next++) {
					std::vector<int> copy = point;
					copy.insert(copy.begin(), next);
					co_yield copy;
				}
			}
		}
		else {
			co_yield{};
		}
	}
public:
	std::generator<std::vector<N>> points() const {
		co_yield std::ranges::elements_of(this->points(0));
	}

	std::vector<std::set<std::vector<N>>> diagonals() const {
		int maxDiagonal = std::accumulate(this->lengths.begin(), this->lengths.end(), 0, std::plus<N>()) - this->lengths.size();
		std::vector<std::set<std::vector<N>>> diagonals(maxDiagonal + 1, {});
		for (std::vector<N> tuple : this->points()) {
			N sum = std::accumulate(tuple.begin(), tuple.end(), 0, std::plus<N>());
			diagonals[sum].insert(tuple);
		}
		return diagonals;
	}
};