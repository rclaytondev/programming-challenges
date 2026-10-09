module;

#include <boost/test/unit_test.hpp>

export module PeriodicSetTest;

import PeriodicSet;

BOOST_AUTO_TEST_SUITE(PeriodicSet_coprimeTo)

BOOST_AUTO_TEST_CASE(it_returns_the_set_of_all_integers_coprime_to_the_given_integer) {
	auto set = PeriodicSet<int>::coprimeTo(6);
	std::set<int> expected{ 1, 5 };
	BOOST_CHECK_EQUAL(set.period, 6);
	BOOST_CHECK_EQUAL_COLLECTIONS(set.offsets.begin(), set.offsets.end(), expected.begin(), expected.end());
}
BOOST_AUTO_TEST_CASE(it_works_for_an_integer_that_is_not_equal_to_its_radical) {
	auto set = PeriodicSet<int>::coprimeTo(20);
	std::set<int> expected{ 1, 3, 7, 9 };
	BOOST_CHECK_EQUAL(set.period, 10);
	BOOST_CHECK_EQUAL_COLLECTIONS(set.offsets.begin(), set.offsets.end(), expected.begin(), expected.end());
}

BOOST_AUTO_TEST_SUITE_END()