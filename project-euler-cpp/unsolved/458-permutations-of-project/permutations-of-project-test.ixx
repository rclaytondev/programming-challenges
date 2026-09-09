module;

#include <boost/test/unit_test.hpp>

export module Problem458Test;

import Problem458;

BOOST_AUTO_TEST_SUITE(PartialString_constructor)

BOOST_AUTO_TEST_CASE(it_deletes_all_after_first_duplicate_and_replaces_each_number_with_0_1_2_etc_in_order_of_first_occurrence) {
	PartialString str{ { 3, 1, 5, 0, 2, 4, 4, 1 }, { 2, 3, 0, 4, 3 }, 10, 10 };
	std::vector<int> before{ str.getBefore() };
	std::vector<int> after{ str.getAfter() };
	std::vector<int> expectedBefore{ 0, 1, 2, 3, 4, 5 };
	std::vector<int> expectedAfter{ 4, 0, 3, 5 };
	BOOST_CHECK_EQUAL_COLLECTIONS(before.begin(), before.end(), expectedBefore.begin(), expectedBefore.end());
	BOOST_CHECK_EQUAL_COLLECTIONS(after.begin(), after.end(), expectedAfter.begin(), expectedAfter.end());
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem458_solve)

BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_4) {
	long long actual = Problem458::solve(4, 4);
	long long expected = (4 * 4 * 4 * 4) - (4 * 3 * 2 * 1);
	BOOST_CHECK_EQUAL(actual, expected);
}

BOOST_AUTO_TEST_SUITE_END()