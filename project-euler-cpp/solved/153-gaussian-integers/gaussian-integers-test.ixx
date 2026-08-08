module;

#include <boost/test/unit_test.hpp>

export module Problem153Test;

import Problem153;

BOOST_AUTO_TEST_SUITE(Problem153)

BOOST_AUTO_TEST_CASE(works_for_input_of_5) {
	int result = Problem153::solve(5);
	BOOST_CHECK_EQUAL(result, 35);
}

BOOST_AUTO_TEST_SUITE_END()
