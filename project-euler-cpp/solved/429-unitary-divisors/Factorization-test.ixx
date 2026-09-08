module;

#include <boost/test/unit_test.hpp>

export module FactorizationTest;

import Factorization;

BOOST_AUTO_TEST_SUITE(factorial)
BOOST_AUTO_TEST_CASE(can_compute_4_factorial) {
	Factorization<int> factorization{ Factorization<int>::factorial(4) };

	bool valid = factorization.isValid();
	BOOST_CHECK(valid);

	int num = factorization.toNumber();
	BOOST_CHECK_EQUAL(num, 24);
}
BOOST_AUTO_TEST_CASE(can_compute_5_factorial) {
	Factorization<int> factorization{ Factorization<int>::factorial(5) };

	bool valid = factorization.isValid();
	BOOST_CHECK(valid);

	int num = factorization.toNumber();
	BOOST_CHECK_EQUAL(num, 120);
}
BOOST_AUTO_TEST_SUITE_END(primes)
