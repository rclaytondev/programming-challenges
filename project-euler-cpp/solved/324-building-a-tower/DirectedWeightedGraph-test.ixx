module;

#include <boost/test/unit_test.hpp>
#include <boost/numeric/ublas/matrix.hpp>
#include <boost/numeric/ublas/assignment.hpp>

export module DirectedWeightedGraphTest;

import DirectedWeightedGraph;
import MathUtils;

import std;

using boost::numeric::ublas::matrix;

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

BOOST_AUTO_TEST_SUITE(DirectedWeightedGraph_adjacencyMatrix)

BOOST_AUTO_TEST_CASE(it_returns_the_adjacency_matrix_of_the_graph_with_rows_and_columns_in_order_of_the_order_used_for_the_out_edges_map) {
	DirectedWeightedGraph<char, int> graph;
	graph.add('A');
	graph.add('B');
	graph.add('C');
	graph.connect('A', 'B', 3);
	graph.connect('A', 'C', 2);
	graph.connect('C', 'A', 5);

	matrix<int> mat = graph.adjacencyMatrix();
	matrix<int> expected(3, 3);
	expected <<= 0, 3, 2,
				 0, 0, 0,
				 5, 0, 0;
	BOOST_CHECK(mat == expected);
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(DirectedWeightedGraph_paths)

BOOST_AUTO_TEST_CASE(it_returns_the_number_of_paths_between_the_two_vertices_using_the_weights_as_the_number_of_edges) {
	DirectedWeightedGraph<char, int> graph;
	graph.add('A');
	graph.add('B');
	graph.add('C');
	graph.connect('A', 'B', 5);
	graph.connect('B', 'C', 6);
	int paths = graph.paths<int, int>('A', 'C', 2);
	BOOST_CHECK_EQUAL(paths, 30);
}
BOOST_AUTO_TEST_CASE(it_works_when_there_are_vertices_that_are_not_reachable_from_the_start_vertex) {
	DirectedWeightedGraph<char, int> graph;
	graph.add('A');
	graph.add('B');
	graph.add('C');
	graph.add('D');
	graph.add('E');
	graph.connect('A', 'B', 5);
	graph.connect('B', 'C', 6);
	graph.connect('D', 'A', 17);
	int paths = graph.paths<int, int>('A', 'C', 2);
	BOOST_CHECK_EQUAL(paths, 30);
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(DirectedWeightedGraph_reachableFrom)

BOOST_AUTO_TEST_CASE(it_returns_all_the_vertices_that_are_reachable_from_the_given_vertex_by_following_edges_forward) {
	DirectedWeightedGraph<char, int> graph;
	graph.add('A');
	graph.add('B');
	graph.add('C');
	graph.connect('A', 'B', 5);
	graph.connect('B', 'C', 6);

	std::set<char> reachableFromA = graph.reachableFrom('A');
	std::set<char> expectedFromA = { 'A', 'B', 'C' };
	std::set<char> reachableFromB = graph.reachableFrom('B');
	std::set<char> expectedFromB = { 'B', 'C' };
	BOOST_TEST(reachableFromA == expectedFromA);
	BOOST_TEST(reachableFromB == expectedFromB);
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(DirectedWeightedGraph_subgraph)

BOOST_AUTO_TEST_CASE(it_returns_the_subgraph_consisting_of_all_the_given_vertices_and_edges_between_them) {
	DirectedWeightedGraph<char, int> graph;
	graph.add('A');
	graph.add('B');
	graph.add('C');
	graph.connect('A', 'B', 5);
	graph.connect('B', 'C', 6);

	std::set<char> vertices{ 'A', 'B' };
	DirectedWeightedGraph subgraph = graph.subgraph(vertices.begin(), vertices.end());

	BOOST_CHECK(subgraph.contains('A'));
	BOOST_CHECK(subgraph.contains('B'));
	BOOST_CHECK(!subgraph.contains('C'));
	BOOST_CHECK(subgraph.edgeWeight('A', 'B') == std::make_optional(5));
}

BOOST_AUTO_TEST_SUITE_END()