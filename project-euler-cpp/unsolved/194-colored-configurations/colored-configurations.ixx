module;

#include <boost/graph/adjacency_list.hpp>
#include <boost/math/tools/polynomial.hpp>

export module Problem194;

import std;
import Graph;
import Modular;

using boost::math::tools::polynomial;

export template<typename N>
class Solver {
	N choicesA;
	N choicesB;
	std::map<std::pair<int, int>, N> cache;

public:
	Solver(N choicesA, N choicesB) : choicesA(choicesA), choicesB(choicesB) { }

	N combinations(int numA, int numB) {
		if (numA < 0 || numB < 0) { return 0; }
		if (numA == 0 && numB == 0) { return 1; }

		auto args = std::make_pair(numA, numB);
		if (this->cache.contains(args)) {
			return this->cache[args];
		}

		N combinationsA = this->choicesA * this->combinations(numA - 1, numB);
		N combinationsB = this->choicesB * this->combinations(numA, numB - 1);
		N result = combinationsA + combinationsB;
		this->cache[args] = result;
		return result;
	}
};

namespace Problem194 {
	export template<typename N>
	polynomial<int> chromaticPoly(const Graph<int>& graph) {
		auto edge = graph.findEdge();
		if (edge.has_value()) {
			Graph gDeleted = graph;
			gDeleted.disconnect(edge->first, edge->second);
			auto deleted = Problem194::chromaticPoly<N>(gDeleted);

			Graph gContracted = graph;
			gContracted.contract(edge->first, edge->second);
			auto contracted = Problem194::chromaticPoly<N>(gContracted);

			return deleted - contracted;
		}
		int size = graph.numVertices();
		std::vector<N> coefs(size, 0);
		coefs.push_back(1);
		return polynomial<N>{ coefs };
	}

	Graph<int> graphA() {
		std::vector<int> vertices{ 1, 2, 3, 4, 5, 6, 7 };
		Graph<int> graph{ vertices.begin(), vertices.end() };

		/* Top triangle */
		graph.connect(1, 2);
		graph.connect(1, 3);
		graph.connect(2, 3);

		/* Middle vertical edges */
		graph.connect(3, 4);
		graph.connect(4, 5);

		/* Side edges */
		graph.connect(1, 6);
		graph.connect(2, 7);

		/* Bottom triangle */
		graph.connect(5, 6);
		graph.connect(5, 7);
		graph.connect(6, 7);
		return graph;
	}
	Graph<int> graphB() {
		Graph<int> graph = Problem194::graphA();
		graph.disconnect(6, 7);
		return graph;
	}

	export template<typename N>
	N solve(int numA, int numB, N colors) {
		polynomial<N> polyA = Problem194::chromaticPoly<N>(Problem194::graphA());
		N coloringsA = polyA(colors);

		polynomial<N> polyB = Problem194::chromaticPoly<N>(Problem194::graphB());
		N coloringsB = polyB(colors);

		Solver<int> solver{
			coloringsA / (colors * (colors - 1)),
			coloringsB / (colors * (colors - 1))
		};
		return colors * (colors - 1) * solver.combinations(numA, numB);
	}
}