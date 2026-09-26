module;

#include <boost/graph/adjacency_list.hpp>
#include <boost/math/tools/polynomial.hpp>

export module Problem194;

import std;
import Graph;

using boost::math::tools::polynomial;

namespace Problem194 {
	export polynomial<int> chromaticPoly(const Graph<int>& graph) {
		auto edge = graph.findEdge();
		if (edge.has_value()) {
			Graph gDeleted = graph;
			gDeleted.disconnect(edge->first, edge->second);
			auto deleted = Problem194::chromaticPoly(gDeleted);

			Graph gContracted = graph;
			gContracted.contract(edge->first, edge->second);
			auto contracted = Problem194::chromaticPoly(gContracted);

			return deleted - contracted;
		}
		int size = graph.numVertices();
		std::vector<int> coefs(size, 0);
		coefs.push_back(1);
		return polynomial<int>{ coefs };
	}
}