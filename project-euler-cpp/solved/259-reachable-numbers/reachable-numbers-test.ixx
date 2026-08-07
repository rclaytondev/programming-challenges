module;

#include <boost/test/unit_test.hpp>

export module Problem259Test;

import std;
import Problem259;
import Rational;

BOOST_AUTO_TEST_SUITE(concatDigits)
BOOST_AUTO_TEST_CASE(outputs_the_number_obtained_by_concatenating_the_digits_in_the_given_range) {
	int result = Problem259::concatDigits(3, 7);
	BOOST_CHECK_EQUAL(result, 34567);
}
BOOST_AUTO_TEST_SUITE_END()


BOOST_AUTO_TEST_SUITE(reachableRationals)
BOOST_AUTO_TEST_CASE(solves_the_problem_for_the_given_range_of_digits) {
	std::unordered_set<Rational, RationalHasher> reachables = Problem259::reachableRationals(3, 4);
	std::unordered_set<Rational, RationalHasher> expected{
		Rational { 34 },
		Rational { 3 + 4 },
		Rational { 3 - 4 },
		Rational { 3 * 4 },
		Rational { 3, 4 },
	};
	BOOST_CHECK(reachables == expected);
}
BOOST_AUTO_TEST_SUITE_END()