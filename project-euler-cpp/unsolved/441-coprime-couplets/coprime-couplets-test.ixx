module;

#include <boost/test/unit_test.hpp>
#include <boost/multiprecision/cpp_int.hpp>

export module Problem441Test;

import Problem441;

using boost::multiprecision::cpp_rational;

BOOST_AUTO_TEST_SUITE(Problem441_solve)

BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_2) {
	cpp_rational actual = Problem441::solve(2);
	cpp_rational expected(1, 2);
	BOOST_CHECK_EQUAL(actual, expected);
}
BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_10) {
	cpp_rational actual = Problem441::solve(10);
	cpp_rational expected(3485, 504);
	BOOST_CHECK_EQUAL(actual, expected);
}

BOOST_AUTO_TEST_SUITE_END()