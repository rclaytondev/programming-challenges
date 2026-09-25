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

BOOST_AUTO_TEST_SUITE(Factorization_factorizeAll)

BOOST_AUTO_TEST_CASE(it_returns_the_prime_factorizations_of_all_numbers_up_to_the_upper_bound_inclusive) {
	std::vector<Factorization<int>> all = Factorization<int>::factorizeAll(20);
	BOOST_CHECK_EQUAL(all.size(), 21);
	BOOST_CHECK(all[0] == 1);
	BOOST_CHECK(all[0].isValid());
	for (int i = 1; i < all.size(); i++) {
		BOOST_CHECK(all[i].isValid());
		BOOST_CHECK(all[i] == i);
	}
}

BOOST_AUTO_TEST_CASE(it_yields_Factorizations_of_all_positive_integers_when_called_without_an_upper_bound) {
	int i = 1;
	for (const Factorization<int>& fact : Factorization<int>::factorizeAll()) {
		BOOST_CHECK(fact.isValid());
		BOOST_CHECK_EQUAL(fact, i);
		i++;
		if (i > 20) { break; }
	}
	BOOST_CHECK_EQUAL(i, 21);
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Factorization_divisors)

BOOST_AUTO_TEST_CASE(it_returns_all_the_divisors_of_the_number) {
	Factorization<int> fact = 24;
	auto divisorsFact = fact.divisors() | std::ranges::to<std::vector<Factorization<int>>>();
	std::set<int> divisors(divisorsFact.begin(), divisorsFact.end());
	std::set<int> expected = { 1, 2, 3, 4, 6, 8, 12, 24 };
	BOOST_CHECK_EQUAL_COLLECTIONS(divisors.begin(), divisors.end(), expected.begin(), expected.end());
}

BOOST_AUTO_TEST_SUITE_END()