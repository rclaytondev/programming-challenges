module;

#include <boost/test/unit_test.hpp>

export module MathUtilsTest;

import MathUtils;

BOOST_AUTO_TEST_SUITE(primes)
BOOST_AUTO_TEST_CASE(can_compute_primes_up_to_30) {
	std::vector<int> actual{ MathUtils::primes(30) };
	std::vector<int> expected{ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 };
	BOOST_CHECK_EQUAL_COLLECTIONS(actual.begin(), actual.end(), expected.begin(), expected.end());
}
BOOST_AUTO_TEST_SUITE_END(primes)
