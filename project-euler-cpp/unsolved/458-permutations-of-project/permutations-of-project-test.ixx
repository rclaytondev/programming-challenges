module;

#include <boost/test/unit_test.hpp>

export module Problem458Test;

import Problem458;

BOOST_AUTO_TEST_SUITE(Problem458_solve)

BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_4) {
	long long actual = Problem458::solve(4, 4);
	long long expected = (4 * 4 * 4 * 4) - (4 * 3 * 2 * 1);
	BOOST_CHECK_EQUAL(actual, expected);
}
BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_3_with_alphabet_size_2) {
	long long actual = Problem458::solve(3, 2);
	long long expected = 2; // 111 and 222
	BOOST_CHECK_EQUAL(actual, expected);
}
BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_4_with_alphabet_size_3) {
	long long actual = Problem458::solve(4, 3);
	long long expected = (3 * 3 * 3 * 3) - 2 * (3 * 2 * 1 * 3) + (3 * 2 * 1);
	BOOST_CHECK_EQUAL(actual, expected);
}
BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_5_with_alphabet_size_4) {
	long long actual = Problem458::solve(5, 4);

	long long total = 4 * 4 * 4 * 4 * 4;
	long long invalidLeft = 4 * 3 * 2 * 1 * 4;
	long long invalidRight = 4 * 3 * 2 * 1 * 4;
	long long invalidBoth = 4 * 3 * 2 * 1 * 1;
	long long expected = total - invalidLeft - invalidRight + invalidBoth;

	BOOST_CHECK_EQUAL(actual, expected);
}
BOOST_AUTO_TEST_CASE(it_gives_the_same_output_as_the_less_optimized_version_for_a_nontrivial_input) {
	long long actual = Problem458::solve(8, 3);
	long long expected = 3444;
	BOOST_CHECK_EQUAL(actual, expected);
}
//BOOST_AUTO_TEST_CASE(it_gives_the_same_output_as_the_less_optimized_version_for_a_large_input) {
//	long long actual = Problem458::solve(10, 7);
//	long long expected = 612426304;
//	BOOST_CHECK_EQUAL(actual, expected);
//}

BOOST_AUTO_TEST_SUITE_END()