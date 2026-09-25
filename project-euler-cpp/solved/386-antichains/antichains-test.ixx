module;

#include <boost/test/unit_test.hpp>

export module Problem386Test;

import std;
import Problem386;
import RectPrism;

BOOST_AUTO_TEST_SUITE(Problem386_longestAntichain)

BOOST_AUTO_TEST_CASE(it_returns_1_for_the_divisors_of_a_prime_number) {
	const std::set<int> divisors{ 1, 5 };
	const int longest = Problem386::longestAntichain(divisors);
	BOOST_CHECK_EQUAL(longest, 1);
}
BOOST_AUTO_TEST_CASE(it_returns_2_for_the_divisors_of_a_semiprime) {
	const std::set<int> divisors{ 1, 3, 5, 15 };
	const int longest = Problem386::longestAntichain(divisors);
	BOOST_CHECK_EQUAL(longest, 2);
}
BOOST_AUTO_TEST_CASE(it_returns_1_for_the_divisors_of_a_power_of_a_prime) {
	const std::set<int> divisors{ 1, 2, 4, 8, 16, 32, 64, 128 };
	const int longest = Problem386::longestAntichain(divisors);
	BOOST_CHECK_EQUAL(longest, 1);
}
BOOST_AUTO_TEST_CASE(it_returns_3_for_the_divisors_of_a_product_of_3_primes) {
	const std::set<int> divisors{ 1, 2, 3, 5, 6, 10, 15, 30 };
	const int longest = Problem386::longestAntichain(divisors);
	BOOST_CHECK_EQUAL(longest, 3);
}
BOOST_AUTO_TEST_CASE(it_returns_9_for_a_set_of_9_distinct_primes) {
	const std::set<int> values{ 2, 3, 5, 7, 11, 13, 17, 19, 23 };
	const int longest = Problem386::longestAntichain(values);
	BOOST_CHECK_EQUAL(longest, 9);
}
BOOST_AUTO_TEST_CASE(it_returns_10_for_a_set_of_10_distinct_primes) {
	const std::set<int> values{ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29 };
	const int longest = Problem386::longestAntichain(values);
	BOOST_CHECK_EQUAL(longest, 10);
}
BOOST_AUTO_TEST_CASE(it_returns_11_for_a_set_of_11_distinct_primes) {
	const std::set<int> values{ 2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31 };
	const int longest = Problem386::longestAntichain(values);
	BOOST_CHECK_EQUAL(longest, 11);
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem386_solve)

BOOST_AUTO_TEST_CASE(it_returns_the_same_as_the_unoptimized_version_for_an_input_of_50) {
	const long long actual = Problem386::solve(50);
	BOOST_CHECK_EQUAL(actual, 79);
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem386_isUnimodal)

BOOST_AUTO_TEST_CASE(it_returns_true_when_the_numbers_are_increasing_then_decreasing) {
	BOOST_CHECK(Problem386::isUnimodal({ }));
	BOOST_CHECK(Problem386::isUnimodal({ 1 }));
	BOOST_CHECK(Problem386::isUnimodal({ 1, 2 }));
	BOOST_CHECK(Problem386::isUnimodal({ 1, 3, 2 }));
	BOOST_CHECK(Problem386::isUnimodal({ 1, 3, 4, 4, 2 }));
	BOOST_CHECK(Problem386::isUnimodal({ 4, 2, 2, 2, 1 }));
	BOOST_CHECK(Problem386::isUnimodal({ 3, 3, 3, 3 }));
}
BOOST_AUTO_TEST_CASE(it_returns_false_when_the_numbers_are_not_increasing_then_decreasing) {
	BOOST_CHECK(!Problem386::isUnimodal({ 2, 1, 2 }));
	BOOST_CHECK(!Problem386::isUnimodal({ 2, 3, 4, 1, 3 }));
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem386_injectiveChainMap)

using Point = std::vector<int>;

void validateDomain(const std::map<Point, Point>& chainMap, const std::set<Point>& smallDiag, const std::set<Point>& bigDiag) {
	for (const auto& [input, output] : chainMap) {
		BOOST_CHECK(smallDiag.contains(input));
		BOOST_CHECK(bigDiag.contains(output));
	}
}
void validateInjectivity(const std::map<Point, Point>& chainMap) {
	std::set<Point> outputs;
	for (const auto& [input, output] : chainMap) {
		outputs.insert(output);
	}
	BOOST_CHECK_EQUAL(outputs.size(), chainMap.size());
}
void validateComparability(const std::map<Point, Point>& chainMap) {
	for (const auto& [input, output] : chainMap) {
		BOOST_CHECK_EQUAL(input.size(), output.size());
		for (int i = 0; i < input.size(); i++) {
			BOOST_CHECK(input[i] <= output[i]);
		}
	}
}

BOOST_AUTO_TEST_CASE(it_returns_a_map_corresponding_to_a_total_injective_function_between_the_two_diagonals_such_that_each_input_is_comparable_to_its_output) {
	std::set<Point> smallDiag{
		{ 0, 0, 1 },
		{ 0, 1, 0 },
		{ 1, 0, 0 },
	};
	std::set<Point> bigDiag{
		{ 0, 1, 1 },
		{ 1, 1, 0 },
		{ 1, 0, 1 },
	};
	auto chains = Problem386::injectiveChainMap(smallDiag, bigDiag);
	BOOST_CHECK(chains.has_value());
	if (chains.has_value()) {
		validateDomain(*chains, smallDiag, bigDiag);
		validateInjectivity(*chains);
		validateComparability(*chains);
	}
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem386_longestDiagonalAntichain)

BOOST_AUTO_TEST_CASE(it_returns_the_length_of_the_longest_diagonal_antichain_when_it_can_prove_it_is_the_longest_out_of_all_antichains) {
	RectPrism poset{ { 2, 2, 2 } };
	std::optional<int> longest = Problem386::longestDiagonalAntichain(poset);
	BOOST_CHECK(longest.has_value());
	if (longest.has_value()) {
		BOOST_CHECK_EQUAL(*longest, 3);
	}
}

BOOST_AUTO_TEST_SUITE_END()