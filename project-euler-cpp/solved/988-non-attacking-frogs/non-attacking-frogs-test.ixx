module;

#include <boost/test/unit_test.hpp>

export module Problem988Test;

import std;
import Problem988;

BOOST_AUTO_TEST_SUITE(Problem988_nonAttackedBy0)

BOOST_AUTO_TEST_CASE(it_returns_all_the_frog_positions_that_not_are_attacked_by_a_frog_at_position_0_including_0) {
	std::set<int> actual{ Problem988::nonAttackedBy0(3, 5) };
	std::set<int> expected = { 0, 1, 2, 4, 7 };
	BOOST_CHECK_EQUAL_COLLECTIONS(actual.begin(), actual.end(), expected.begin(), expected.end());
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem988_solve)

BOOST_AUTO_TEST_CASE(works_for_3_and_5) {
	int actual = Problem988::solve(3, 5);
	BOOST_CHECK_EQUAL(actual, 23);
}
BOOST_AUTO_TEST_CASE(works_for_5_and_13) {
	int actual = Problem988::solve(5, 13);
	BOOST_CHECK_EQUAL(actual, 16336);
}

BOOST_AUTO_TEST_SUITE_END()