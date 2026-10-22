module;

#include <boost/numeric/ublas/matrix.hpp>
#include <boost/numeric/ublas/assignment.hpp>
#include <boost/test/unit_test.hpp>
#include <boost/multiprecision/cpp_int.hpp>

export module Problem324Test;


import std;
import RectPrism;
import Modular;
import MathUtils;

using boost::numeric::ublas::matrix;

import Problem324;

BOOST_AUTO_TEST_SUITE(Problem324_solve)

//BOOST_AUTO_TEST_CASE(it_works_for_2) {
//	auto result = Problem324::solve<1'000'000'007>(2);
//	BOOST_CHECK_EQUAL(result, 229LL);
//}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem324_solveRecursively)

BOOST_AUTO_TEST_CASE(it_works_for_a_rectangle_with_height_2) {
	auto result = Problem324::solveRecursively<1'000'000'007>(2);
	BOOST_CHECK_EQUAL(result, 229LL);
}
BOOST_AUTO_TEST_CASE(it_works_for_a_state_with_8_remaining_squares_on_the_last_layer) {
	TowerState state{ { {
		{ 2, 1, 1 },
		{ 1, 1, 1 },
		{ 1, 1, 1 }
	} } };
	auto result = Problem324::solveRecursively<1'000'000'007>(4, state);
	BOOST_CHECK_EQUAL(result, 4LL);
}

BOOST_AUTO_TEST_SUITE_END()

using TowerStateGrid = std::array<std::array<int, 3>, 3>;

BOOST_AUTO_TEST_SUITE(TowerState_rotate90CW)

BOOST_AUTO_TEST_CASE(it_rotates_90_degrees_clockwise) {
	TowerStateGrid state{ {
		{ 1, 2, 3 },
		{ 0, 1, 0 },
		{ 2, 2, 1 }
	} };
	TowerStateGrid rotated = TowerState::rotate90CW(state);
	TowerStateGrid expected{ {
		{ 2, 0, 1 },
		{ 2, 1, 2 },
		{ 1, 0, 3 }
	} };
	BOOST_CHECK(rotated == expected);
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(TowerState_rotate90CCW)

BOOST_AUTO_TEST_CASE(it_rotates_90_degrees_counterclockwise) {
	TowerStateGrid state{ {
		{ 1, 2, 3 },
		{ 0, 1, 0 },
		{ 2, 2, 1 }
	} };
	TowerStateGrid rotated = TowerState::rotate90CCW(state);
	TowerStateGrid expected{ {
		{ 3, 0, 1 },
		{ 2, 1, 2 },
		{ 1, 0, 2 }
	} };
	BOOST_CHECK(rotated == expected);
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem324_adjacencyMatrix)

BOOST_AUTO_TEST_CASE(it_generates_a_matrix_with_a_1_if_the_states_are_connected_and_a_0_otherwise) {
	TowerState start{ { {
		{ 0, 0, 0 },
		{ 0, 0, 0 },
		{ 0, 0, 0 },
	} } };
	TowerState child = start.next()[0];
	TowerState grandchild1 = child.next()[0];
	TowerState grandchild2 = child.next()[1];

	auto result = Problem324::adjacencyMatrix<1'000'000'007>({ start, child, grandchild1, grandchild2 });
	matrix<Modular<long long, 1'000'000'007>> expected(4, 4);
	expected <<= 0LL, 0LL, 0LL, 0LL,
				 1LL, 0LL, 0LL, 0LL,
				 0LL, 1LL, 0LL, 0LL,
				 0LL, 1LL, 0LL, 0LL;
	BOOST_CHECK_EQUAL(result, expected);
}

BOOST_AUTO_TEST_SUITE_END()