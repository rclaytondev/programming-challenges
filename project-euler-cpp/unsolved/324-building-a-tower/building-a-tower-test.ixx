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

BOOST_AUTO_TEST_CASE(it_works_for_2) {
	auto result = Problem324::solve<1'000'000'007>(2);
	BOOST_CHECK_EQUAL(result, 229LL);
}

BOOST_AUTO_TEST_SUITE_END()