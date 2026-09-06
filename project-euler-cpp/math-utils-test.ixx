module;

#include <boost/test/unit_test.hpp>

export module MathUtilsTest;

import MathUtils;

BOOST_AUTO_TEST_SUITE(MathUtils_primes)
BOOST_AUTO_TEST_CASE(can_compute_primes_up_to_30) {
	std::vector<int> actual{ MathUtils::primes(30) };
	std::vector<int> expected{ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 };
	BOOST_CHECK_EQUAL_COLLECTIONS(actual.begin(), actual.end(), expected.begin(), expected.end());
}
BOOST_AUTO_TEST_SUITE_END(primes)

BOOST_AUTO_TEST_SUITE(MathUtils_pow)
BOOST_AUTO_TEST_CASE(can_compute_zeroth_integer_powers_correctly) {
	int result = MathUtils::pow(3, 0);
	BOOST_CHECK_EQUAL(result, 1);
}
BOOST_AUTO_TEST_CASE(can_compute_first_integer_powers_correctly) {
	int result = MathUtils::pow(3, 1);
	BOOST_CHECK_EQUAL(result, 3);
}
BOOST_AUTO_TEST_CASE(can_compute_second_integer_powers_correctly) {
	int result = MathUtils::pow(3, 2);
	BOOST_CHECK_EQUAL(result, 9);
}
BOOST_AUTO_TEST_CASE(can_compute_third_integer_powers_correctly) {
	int result = MathUtils::pow(3, 3);
	BOOST_CHECK_EQUAL(result, 27);
}
BOOST_AUTO_TEST_CASE(can_compute_fourth_integer_powers_correctly) {
	int result = MathUtils::pow(3, 4);
	BOOST_CHECK_EQUAL(result, 81);
}
BOOST_AUTO_TEST_CASE(can_compute_fifth_integer_powers_correctly) {
	int result = MathUtils::pow(3, 5);
	BOOST_CHECK_EQUAL(result, 243);
}
BOOST_AUTO_TEST_SUITE_END(primes)
