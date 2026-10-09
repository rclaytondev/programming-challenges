module;

#include <boost/test/unit_test.hpp>
#include <boost/multiprecision/cpp_int.hpp>

export module Problem441Test;

import Problem441;

using boost::multiprecision::cpp_rational;

BOOST_AUTO_TEST_SUITE(Problem441_firstWithRemainder)

BOOST_AUTO_TEST_CASE(it_returns_the_first_value_greater_than_or_equal_to_the_minimum_that_has_the_given_remainder) {
	BOOST_CHECK_EQUAL(207, Problem441::firstWithRemainder(7, 10, 205));
	BOOST_CHECK_EQUAL(207, Problem441::firstWithRemainder(7, 10, 206));
	BOOST_CHECK_EQUAL(207, Problem441::firstWithRemainder(7, 10, 207));
	BOOST_CHECK_EQUAL(217, Problem441::firstWithRemainder(7, 10, 208));
	BOOST_CHECK_EQUAL(217, Problem441::firstWithRemainder(7, 10, 209));
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem441_solve)

BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_2) {
	double actual = Problem441::solve(2);
	double expected = 0.5;
	BOOST_TEST(actual == expected, boost::test_tools::tolerance(0.0001));
}
BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_10) {
	double actual = Problem441::solve(10);
	double expected = 3485.0 / 504.0;
	BOOST_TEST(actual == expected, boost::test_tools::tolerance(0.0001));
}

BOOST_AUTO_TEST_SUITE_END()