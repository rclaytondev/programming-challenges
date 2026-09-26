module;

#include <boost/test/unit_test.hpp>
#include <boost/math/tools/polynomial.hpp>

export module Problem194Test;

import Problem194;
import Graph;
import std;

using boost::math::tools::polynomial;

BOOST_AUTO_TEST_SUITE(Problem194_chromaticPoly)

BOOST_AUTO_TEST_CASE(it_works_for_a_graph_with_no_edges) {
	Graph<int> graph;
	graph.add(1);
	graph.add(2);
	graph.add(3);
	graph.add(4);
	polynomial<int> chromaticPoly = Problem194::chromaticPoly(graph);
	polynomial<int> expected{ 0, 0, 0, 0, 1 };
	BOOST_CHECK_EQUAL(chromaticPoly, expected);
}
BOOST_AUTO_TEST_CASE(it_works_for_a_complete_graph_on_2_vertices) {
	Graph<int> graph;
	graph.add(1);
	graph.add(2);
	graph.connect(1, 2);
	polynomial<int> chromaticPoly = Problem194::chromaticPoly(graph);
	polynomial<int> expected{ 0, -1, 1 };
	BOOST_CHECK_EQUAL(chromaticPoly, expected);
}
BOOST_AUTO_TEST_CASE(it_works_for_a_complete_graph_on_3_vertices) {
	Graph<int> graph;
	graph.add(1);
	graph.add(2);
	graph.add(3);
	graph.connect(1, 2);
	graph.connect(2, 3);
	graph.connect(3, 1);

	polynomial<int> chromaticPoly = Problem194::chromaticPoly(graph);
	polynomial<int> deleted{ 0, 1, -2, 1 }; // x(x-1)^2
	polynomial<int> contracted{ 0, -1, 1 }; // x(x-1)
	polynomial<int> expected = deleted - contracted;
	BOOST_CHECK_EQUAL(chromaticPoly, expected);
}

BOOST_AUTO_TEST_SUITE_END()