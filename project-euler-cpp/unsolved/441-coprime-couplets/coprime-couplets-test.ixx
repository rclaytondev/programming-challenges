module;

#include <boost/test/unit_test.hpp>
#include <boost/multiprecision/cpp_int.hpp>

export module Problem441Test;

import Problem441;

using boost::multiprecision::cpp_rational;

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