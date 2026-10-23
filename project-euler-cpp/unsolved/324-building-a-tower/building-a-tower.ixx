module;

#include <boost/numeric/ublas/matrix.hpp>
#include <boost/multiprecision/cpp_int.hpp>
#include <boost/container_hash/hash.hpp>

export module Problem324;

import std;
import RectPrism;
import Modular;
import MathUtils;
import DirectedWeightedGraph;

using boost::numeric::ublas::matrix;
using boost::multiprecision::cpp_int;

constexpr int SIDE_LENGTH = 3;

using TowerStateGrid = std::array<std::array<int, SIDE_LENGTH>, SIDE_LENGTH>;

export class TowerState {
public:
	TowerStateGrid heights;

	TowerState() = default;
	TowerState(TowerStateGrid heights) : heights(TowerState::normalize(heights)) { }

	static int minHeight(const TowerStateGrid& heights) {
		return std::ranges::min(heights | std::views::join);
	}
	static int maxHeight(const TowerStateGrid& heights) {
		return std::ranges::max(heights | std::views::join);
	}
	static TowerStateGrid normalizeHeights(const TowerStateGrid& heights) {
		int minHeight = TowerState::minHeight(heights);
		TowerStateGrid newHeights = heights;
		for (int x = 0; x < SIDE_LENGTH; x++) {
			for (int y = 0; y < SIDE_LENGTH; y++) {
				newHeights[x][y] -= minHeight;
			}
		}
		return newHeights;
	}

	std::optional<TowerState> placeBlockRight(int x, int y) const {
		if (x < SIDE_LENGTH - 1 && this->heights[x+1][y] == 0) {
			TowerStateGrid heights = this->heights;
			heights[x][y]++;
			heights[x + 1][y]++;
			return TowerState{ heights };
		}
		return std::nullopt;
	}
	std::optional<TowerState> placeBlockDown(int x, int y) const {
		if (y < SIDE_LENGTH - 1 && this->heights[x][y+1] == 0) {
			TowerStateGrid heights = this->heights;
			heights[x][y]++;
			heights[x][y + 1]++;
			return TowerState{ heights };
		}
		return std::nullopt;
	}
	TowerState placeBlockVertical(int x, int y) const {
		TowerStateGrid heights = this->heights;
		heights[x][y] += 2;
		return TowerState{ heights };
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

	static TowerStateGrid rotate90CW(const TowerStateGrid& heights) {
		TowerStateGrid rotated = {};
		for (int x = 0; x < SIDE_LENGTH; x++) {
			for (int y = 0; y < SIDE_LENGTH; y++) {
				rotated[x][y] = heights[SIDE_LENGTH - y - 1][x];
			}
		}
		return rotated;
	}
	static TowerStateGrid rotate90CCW(const TowerStateGrid& heights) {
		TowerStateGrid rotated = {};
		for (int x = 0; x < SIDE_LENGTH; x++) {
			for (int y = 0; y < SIDE_LENGTH; y++) {
				rotated[x][y] = heights[y][SIDE_LENGTH - x - 1];
			}
		}
		return rotated;
	}
	static TowerStateGrid reflectX(const TowerStateGrid& heights) {
		TowerStateGrid reflected = {};
		for (int x = 0; x < SIDE_LENGTH; x++) {
			for (int y = 0; y < SIDE_LENGTH; y++) {
				reflected[x][y] = heights[SIDE_LENGTH - x - 1][y];
			}
		}
		return reflected;
	}
	static TowerStateGrid normalize(const TowerStateGrid& heights) {
		TowerStateGrid normalized = TowerState::normalizeHeights(heights);
		TowerStateGrid reflected = TowerState::reflectX(normalized);
		return std::min({
			normalized,
			TowerState::rotate90CW(normalized),
			TowerState::rotate90CW(TowerState::rotate90CW(normalized)),
			TowerState::rotate90CCW(normalized),

			reflected,
			TowerState::rotate90CW(reflected),
			TowerState::rotate90CW(TowerState::rotate90CW(reflected)),
			TowerState::rotate90CCW(reflected),
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
	static std::vector<TowerState> all() {
		std::vector<int> maxes(SIDE_LENGTH * SIDE_LENGTH, 3);
		std::set<TowerState> result;
		RectPrism allTuples{ maxes };
		for (const std::vector<int>& tuple : allTuples.points()) {
			if (std::ranges::find(tuple, 0) == tuple.end()) { continue; }
			std::array<std::array<int, SIDE_LENGTH>, SIDE_LENGTH> heights = {};
			for (int i = 0; i < tuple.size(); i++) {
				heights[i % SIDE_LENGTH][i / SIDE_LENGTH] = tuple[i];
			}
			result.insert(TowerState{ heights });
		}


		return std::vector<TowerState>{ result.begin(), result.end() };
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
				if (indices.contains(next)) {
					int j = indices[next];
					mat(j, i) = Modular<long long, modulo>{ 1 };
				}
			}
		}
		return mat;
	}

	DirectedWeightedGraph<TowerState, int> stateGraph() {
		std::vector<TowerState> all = TowerState::all();
		DirectedWeightedGraph<TowerState, int> graph;
		for (const TowerState& state : all) {
			graph.add(state);
		}
		for (const TowerState& state : all) {
			for (const TowerState& next : state.next()) {
				int weight = graph.edgeWeight(state, next).value_or(0);
				graph.connect(state, next, weight + 1);
			}
		}
		return graph;
	}

	export template<long long modulo>
	Modular<long long, modulo> solve(const cpp_int& upperBound) {
		using ModularType = Modular<long long, modulo>;
		if (cpp_int(upperBound % 2) != 0) { return ModularType{ 0 }; }

		TowerState start{};
		cpp_int blocks = cpp_int(upperBound * 9) / 2;
		DirectedWeightedGraph<TowerState, int> graph = Problem324::stateGraph();
		return graph.paths<ModularType, cpp_int>(start, start, blocks);
	}

	export template<long long modulo>
	Modular<long long, modulo> solveRecursively(const cpp_int& blocksLeft, const TowerState& state) {
		if (blocksLeft == 0) {
			bool flat = TowerState::maxHeight(state.heights) == 0;
			return flat ? 1 : 0;
		}
		Modular<long long, modulo> paths = 0;
		for (const TowerState& next : state.next()) {
			paths += Problem324::solveRecursively<modulo>(blocksLeft - 1, next);
		}
		return paths;
	}
	export template<long long modulo>
	Modular<long long, modulo> solveRecursively(const cpp_int& height) {
		return Problem324::solveRecursively<modulo>(height * (SIDE_LENGTH * SIDE_LENGTH) / 2, TowerState{});
	}


	export void run() {
		auto answer = Problem324::solve<100'000'007>(MathUtils::pow<cpp_int, int>(10, 500));
		std::cout << "Answer: " << answer << "\n";
	}
}