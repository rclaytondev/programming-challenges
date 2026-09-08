module;

#include <boost/test/unit_test.hpp>

export module Problem429Test;

import Problem429;

BOOST_AUTO_TEST_SUITE(Problem429_solve)
BOOST_AUTO_TEST_CASE(can_compute_the_sums_of_the_squares_of_the_unitary_divisors_of_4_factorial) {
	int actual = Problem429::solve(4);
	int expected = (1 * 1) + (3 * 3) + (8 * 8) + (24 * 24);
	BOOST_CHECK_EQUAL(actual, expected);
}
BOOST_AUTO_TEST_CASE(works_when_using_a_modulo) {
	int actual = Problem429::solve(6, 17);
	int expected = Problem429::solve(6) % 17;
	BOOST_CHECK_EQUAL(actual, expected);
}
BOOST_AUTO_TEST_SUITE_END()