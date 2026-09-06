module;

#include <boost/test/unit_test.hpp>

export module Problem1004Test;

import Problem1004;


BOOST_AUTO_TEST_SUITE(Problem1004)

BOOST_AUTO_TEST_CASE(naive_algorithm_can_find_balanced_integers_up_to_100) {
	std::vector<int> actual{ Problem1004::allBalanced(2) };
	std::vector<int> expected{
		1, 2, 3, 4, 5, 6, 7, 8, 9
	};
	BOOST_CHECK_EQUAL_COLLECTIONS(actual.begin(), actual.end(), expected.begin(), expected.end());
}
BOOST_AUTO_TEST_CASE(naive_algorithm_can_find_the_number_of_balanced_integers_up_to_10000) {
	std::vector<int> actual{ Problem1004::allBalanced(4) };
	BOOST_CHECK_EQUAL(actual.size(), 2274);
}

BOOST_AUTO_TEST_SUITE_END()