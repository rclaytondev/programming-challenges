module;

#include <boost/test/unit_test.hpp>
#include <boost/multiprecision/cpp_int.hpp>

export module Problem324Test;


import std;
import RectPrism;
import Modular;
import MathUtils;

import Problem324;

BOOST_AUTO_TEST_SUITE(Problem324_solve)

//BOOST_AUTO_TEST_CASE(it_works_for_2) {
//	auto result = Problem324::solve<1'000'000'007>(2);
//	BOOST_CHECK_EQUAL(result, 229LL);
//}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(TowerState_rotate90CW)

BOOST_AUTO_TEST_CASE(it_rotates_90_degrees_clockwise) {
	TowerState state{ { {
		{ 1, 2, 3 },
		{ 0, 1, 0 },
		{ 2, 2, 1 }
	} } };
	TowerState rotated = state.rotate90CW();
	TowerState expected{ { {
		{ 2, 0, 1 },
		{ 2, 1, 2 },
		{ 1, 0, 3 }
	} } };
	BOOST_CHECK(rotated == expected);
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(TowerState_rotate90CCW)

BOOST_AUTO_TEST_CASE(it_rotates_90_degrees_counterclockwise) {
	TowerState state{ { {
		{ 1, 2, 3 },
		{ 0, 1, 0 },
		{ 2, 2, 1 }
	} } };
	TowerState rotated = state.rotate90CCW();
	TowerState expected{ { {
		{ 3, 0, 1 },
		{ 2, 1, 2 },
		{ 1, 0, 2 }
	} } };
	BOOST_CHECK(rotated == expected);
}

BOOST_AUTO_TEST_SUITE_END()