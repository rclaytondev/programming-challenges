module;

#include <boost/numeric/ublas/matrix.hpp>
#include <boost/multiprecision/cpp_int.hpp>
#include <boost/container_hash/hash.hpp>

export module Problem324;

import std;
import Modular;
import MathUtils;

using boost::numeric::ublas::matrix;
using boost::multiprecision::cpp_int;

constexpr int SIDE_LENGTH = 3;

export class TowerState {
public:
	std::array<std::array<int, SIDE_LENGTH>, SIDE_LENGTH> heights;

	TowerState() = default;
	TowerState(std::array<std::array<int, SIDE_LENGTH>, SIDE_LENGTH> heights) : heights(heights) { }

	int minHeight() const {
		return std::ranges::min(this->heights | std::views::join);
	}
	TowerState& normalizeHeights() {
		int minHeight = this->minHeight();
		for (int x = 0; x < SIDE_LENGTH; x++) {
			for (int y = 0; y < SIDE_LENGTH; y++) {
				this->heights[x][y] -= minHeight;
			}
		}
		return *this;
	}

	std::optional<TowerState> placeBlockRight(int x, int y) const {
		if (x < SIDE_LENGTH - 1 && this->heights[x+1][y] == 0) {
			TowerState state = *this;
			state.heights[x][y]++;
			state.heights[x + 1][y]++;
			return state.normalizeHeights().normalize();
		}
		return std::nullopt;
	}
	std::optional<TowerState> placeBlockDown(int x, int y) const {
		if (y < SIDE_LENGTH - 1 && this->heights[x][y+1] == 0) {
			TowerState state = *this;
			state.heights[x][y]++;
			state.heights[x][y + 1]++;
			return state.normalizeHeights().normalize();
		}
		return std::nullopt;
	}
	TowerState placeBlockVertical(int x, int y) const {
		TowerState state = *this;
		state.heights[x][y] += 2;
		return state.normalizeHeights().normalize();
	}
	std::pair<int, int> nextPosition() const {
		for (int x = 0; x < SIDE_LENGTH; x++) {
			for (int y = 0; y < SIDE_LENGTH; y++) {
				if (this->heights[x][y] == 0) {
					return std::make_pair(x, y);
				}
			}
		}
		throw std::logic_error("Cannot find the next position if the position has no column with a height of 0.");
	}
	std::vector<TowerState> next() const {
		auto [x, y] = this->nextPosition();
		std::vector<TowerState> next{ this->placeBlockVertical(x, y) };
		auto right = this->placeBlockRight(x, y);
		if (right.has_value()) {
			next.push_back(*right);
		}
		auto down = this->placeBlockDown(x, y);
		if (down.has_value()) {
			next.push_back(*down);
		}
		return next;
	}

	TowerState rotate90CW() const {
		std::array<std::array<int, SIDE_LENGTH>, SIDE_LENGTH> heights = {};
		for (int x = 0; x < SIDE_LENGTH; x++) {
			for (int y = 0; y < SIDE_LENGTH; y++) {
				heights[x][y] = this->heights[SIDE_LENGTH - y - 1][x];
			}
		}
		return TowerState{ heights };
	}
	TowerState rotate90CCW() const {
		std::array<std::array<int, SIDE_LENGTH>, SIDE_LENGTH> heights = {};
		for (int x = 0; x < SIDE_LENGTH; x++) {
			for (int y = 0; y < SIDE_LENGTH; y++) {
				heights[x][y] = this->heights[y][SIDE_LENGTH - x - 1];
			}
		}
		return TowerState{ heights };
	}
	TowerState reflectX() const {
		std::array<std::array<int, SIDE_LENGTH>, SIDE_LENGTH> heights = {};
		for (int x = 0; x < SIDE_LENGTH; x++) {
			for (int y = 0; y < SIDE_LENGTH; y++) {
				heights[x][y] = this->heights[SIDE_LENGTH - x - 1][y];
			}
		}
		return TowerState{ heights };
	}
	TowerState normalize() const {
		return std::min({
			*this,
			this->rotate90CW(),
			this->rotate90CW().rotate90CW(),
			this->rotate90CCW(),
			this->reflectX(),
			this->reflectX().rotate90CW(),
			this->reflectX().rotate90CW().rotate90CW(),
			this->reflectX().rotate90CCW(),
		});
	}

	static std::vector<TowerState> reachable() {
		TowerState start{};
		std::set<TowerState> visited;
		std::set<TowerState> unvisited = { start };
		while (unvisited.size() > 0) {
			const auto firstIt = unvisited.begin();
			const TowerState first = *firstIt;
			unvisited.erase(firstIt);
			visited.insert(first);

			for (const TowerState& next : first.next()) {
				if (!visited.contains(next)) {
					unvisited.insert(next);
				}
			}
		}
		return std::vector<TowerState> { visited.begin(), visited.end() };
	}

	bool operator==(const TowerState& state) const {
		return this->heights == state.heights;
	}
	auto operator<=>(const TowerState&) const = default;

	struct Hasher {
		std::size_t operator()(const TowerState& state) const noexcept {
			std::size_t hash = 0;
			for (const auto& row : state.heights) {
				for (int h : row) {
					boost::hash_combine(hash, h);
				}
			}
			return hash;
		}
	};
};

namespace Problem324 {
	export template<long long modulo>
	matrix<Modular<long long, modulo>> adjacencyMatrix(const std::vector<TowerState>& states) {
		std::unordered_map<TowerState, int, TowerState::Hasher> indices;
		for (int i = 0; i < states.size(); i++) {
			TowerState state = states[i];
			indices[state] = i;
		}

		matrix<Modular<long long, modulo>> mat(states.size(), states.size());
		for (int i = 0; i < states.size(); i++) {
			for (const TowerState& next : states[i].next()) {
				int j = indices[next];
				mat(i, j) = Modular<long long, modulo>{ 1 };
			}
		}
		return mat;
	}

	export template<long long modulo>
	Modular<long long, modulo> solve(cpp_int upperBound) {
		using ModularType = Modular<long long, modulo>;
		if (cpp_int(upperBound % 2) != 0) { return ModularType{ 0 }; }
		std::vector<TowerState> states = TowerState::reachable();
		matrix<Modular<long long, modulo>> mat = Problem324::adjacencyMatrix<modulo>(states);
		auto it = std::find(states.begin(), states.end(), TowerState{});
		int indexOfStart = std::distance(states.begin(), it);
		cpp_int exponent = cpp_int(upperBound * 9) / 2;
		auto power = MathUtils::matrixPow<ModularType, cpp_int>(mat, exponent);
		return power(indexOfStart, indexOfStart);
	}
}