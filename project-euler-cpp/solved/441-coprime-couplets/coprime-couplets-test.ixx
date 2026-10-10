module;

#include <boost/test/unit_test.hpp>
#include <boost/multiprecision/cpp_int.hpp>

export module Problem441Test;

import Problem441;

using boost::multiprecision::cpp_rational;

BOOST_AUTO_TEST_SUITE(Problem441_firstWithRemainder)

BOOST_AUTO_TEST_CASE(it_returns_the_first_value_greater_than_or_equal_to_the_minimum_that_has_the_given_remainder) {
	BOOST_CHECK_EQUAL(207, Problem441::firstWithRemainder(7, 10, 205));
	BOOST_CHECK_EQUAL(207, Problem441::firstWithRemainder(7, 10, 206));
	BOOST_CHECK_EQUAL(207, Problem441::firstWithRemainder(7, 10, 207));
	BOOST_CHECK_EQUAL(217, Problem441::firstWithRemainder(7, 10, 208));
	BOOST_CHECK_EQUAL(217, Problem441::firstWithRemainder(7, 10, 209));
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem441_lastWithRemainder)

BOOST_AUTO_TEST_CASE(it_returns_the_first_value_less_than_or_equal_to_the_maximum_that_has_the_given_remainder) {
	BOOST_CHECK_EQUAL(197, Problem441::lastWithRemainder(7, 10, 205));
	BOOST_CHECK_EQUAL(197, Problem441::lastWithRemainder(7, 10, 206));
	BOOST_CHECK_EQUAL(207, Problem441::lastWithRemainder(7, 10, 207));
	BOOST_CHECK_EQUAL(207, Problem441::lastWithRemainder(7, 10, 208));
	BOOST_CHECK_EQUAL(207, Problem441::lastWithRemainder(7, 10, 209));
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(Problem441_solve)

BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_2) {
	double actual = Problem441::solve(2);
	double expected = 0.5;
	BOOST_TEST(actual == expected, boost::test_tools::tolerance(0.0001));
}
BOOST_AUTO_TEST_CASE(it_agrees_with_the_old_algorithm_for_an_input_of_3) {
	double actual = Problem441::solve(3);
	double expected = 1.5;
	BOOST_TEST(actual == expected, boost::test_tools::tolerance(0.0001));
}
BOOST_AUTO_TEST_CASE(it_agrees_with_the_old_algorithm_for_an_input_of_4) {
	double actual = Problem441::solve(4);
	double expected = 7.0 / 3.0;
	BOOST_TEST(actual == expected, boost::test_tools::tolerance(0.0001));
}
BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_10) {
	double actual = Problem441::solve(10);
	double expected = 3485.0 / 504.0;
	BOOST_TEST(actual == expected, boost::test_tools::tolerance(0.0001));
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(PeriodicAdder_sum)

class TestPeriodicAdder : public PeriodicAdder {
public:
	TestPeriodicAdder(int remainder, int modulo) : PeriodicAdder(remainder, modulo) { }
	double getTerm(int n) const override { return 1.0 / n; }
};

BOOST_AUTO_TEST_CASE(it_computes_the_sum_of_the_given_function_across_all_numbers_that_have_the_given_remainder) {
	TestPeriodicAdder adder{ 1, 2 };
	double sum1 = adder.sumUpTo(7);
	double sum2 = adder.sumUpTo(8);
	double expected = 1.0 + (1.0 / 3.0) + (1.0 / 5.0) + (1.0 / 7.0);
	BOOST_CHECK_EQUAL(sum1, expected);
	BOOST_CHECK_EQUAL(sum2, expected);
}
BOOST_AUTO_TEST_CASE(it_works_with_a_modulo_of_1) {
	TestPeriodicAdder adder{ 0, 1 };
	double sum = adder.sumUpTo(4);
	double expected = 1.0 + (1.0 / 2.0) + (1.0 / 3.0) + (1.0 / 4.0);
	BOOST_CHECK_EQUAL(sum, expected);
}
BOOST_AUTO_TEST_CASE(it_works_when_evaluated_on_a_big_input_and_then_a_small_input) {
	TestPeriodicAdder adder{ 0, 1 };
	double sum1 = adder.sumUpTo(4);
	double sum2 = adder.sumUpTo(2);
	double expected1 = 1.0 + (1.0 / 2.0) + (1.0 / 3.0) + (1.0 / 4.0);
	double expected2 = 1.0 + (1.0 / 2.0);
	BOOST_CHECK_EQUAL(sum1, expected1);
	BOOST_CHECK_EQUAL(sum2, expected2);
}

BOOST_AUTO_TEST_SUITE_END()