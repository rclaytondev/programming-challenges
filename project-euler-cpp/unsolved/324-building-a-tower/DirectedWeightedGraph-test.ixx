module;

#include <boost/test/unit_test.hpp>

export module DirectedWeightedGraphTest;

import DirectedWeightedGraph;

import std;

BOOST_AUTO_TEST_SUITE(DirectedWeightedGraph_basic_operations)

BOOST_AUTO_TEST_CASE(it_can_add_and_query_vertices_and_can_add_query_and_remove_edges) {
	DirectedWeightedGraph<char, int> graph;
	graph.add('A');
	graph.add('B');
	graph.add('C');
	BOOST_CHECK_EQUAL(graph.size(), 3);
	graph.add('C');
	BOOST_CHECK_EQUAL(graph.size(), 3);
	BOOST_CHECK(graph.contains('A'));
	BOOST_CHECK(!graph.contains('D'));

	graph.connect('A', 'B', 5);
	BOOST_CHECK(graph.edgeWeight('A', 'B') == std::make_optional(5));
	BOOST_CHECK(!graph.edgeWeight('B', 'A').has_value());
	graph.disconnect('A', 'B');
	BOOST_CHECK(!graph.edgeWeight('A', 'B').has_value());
}

BOOST_AUTO_TEST_SUITE_END()