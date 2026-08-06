module;

#include <boost/test/unit_test.hpp>

export module Problem125Test;

import Problem125;

BOOST_AUTO_TEST_SUITE(Problem125)

BOOST_AUTO_TEST_CASE(works_for_input_of_1000) {
	int actual = Problem125::solve(1000);
	BOOST_CHECK_EQUAL(actual, 4164);
}

BOOST_AUTO_TEST_SUITE_END()