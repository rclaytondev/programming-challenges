module;

#include <boost/test/unit_test.hpp>
#include <boost/math/tools/polynomial.hpp>;
#include <boost/multiprecision/cpp_int.hpp>

export module Problem430Test;

using boost::multiprecision::cpp_rational;
using boost::math::tools::polynomial;

import Problem430;

BOOST_AUTO_TEST_SUITE(monomialSummation)
BOOST_AUTO_TEST_CASE(can_compute_sum_of_1s) {
	polynomial<cpp_rational> poly{ Problem430::monomialSummation<cpp_rational, Problem430::cppRationalFromInt<int>>(0) };
	polynomial<cpp_rational> expected{ cpp_rational{0}, cpp_rational{1} };
	BOOST_CHECK_EQUAL(poly, expected);
}
BOOST_AUTO_TEST_CASE(can_compute_sum_of_all_integers_from_1_to_n) {
	polynomial<cpp_rational> poly{ Problem430::monomialSummation<cpp_rational, Problem430::cppRationalFromInt<int>>(1) };
	polynomial<cpp_rational> expected{ { cpp_rational{0}, cpp_rational{1, 2}, cpp_rational{1, 2} } };
	BOOST_CHECK_EQUAL(poly, expected);
}
BOOST_AUTO_TEST_CASE(can_compute_sum_of_all_squares_from_1_to_n) {
	polynomial<cpp_rational> poly{ Problem430::monomialSummation<cpp_rational, Problem430::cppRationalFromInt<int>>(2) };
	polynomial<cpp_rational> expected{ { cpp_rational{0}, cpp_rational{1, 6}, cpp_rational{1, 2}, cpp_rational{1, 3} } };
	BOOST_CHECK_EQUAL(poly, expected);
}
BOOST_AUTO_TEST_SUITE_END()



BOOST_AUTO_TEST_SUITE(summation)
BOOST_AUTO_TEST_CASE(can_return_a_polynomial_such_that_evaluating_the_result_at_x_gives_the_sum_of_the_original_polynomial_at_inputs_up_to_x) {
	polynomial<cpp_rational> input{ cpp_rational{2}, cpp_rational{1, 3}, cpp_rational{0}, cpp_rational{-4} };
	polynomial<cpp_rational> result{ Problem430::summation<cpp_rational, Problem430::cppRationalFromInt<int>>(input) };
	BOOST_CHECK_EQUAL(
		result(0),
		cpp_rational{ 0 }
	);
	BOOST_CHECK_EQUAL(
		result(1),
		input(1)
	);
	BOOST_CHECK_EQUAL(
		result(2),
		input(1) + input(2)
	);
	BOOST_CHECK_EQUAL(
		result(3),
		input(1) + input(2) + input(3)
	);
}
BOOST_AUTO_TEST_SUITE_END()



const double TOLERANCE = 1e-10;
BOOST_AUTO_TEST_SUITE(expectedWhites)
BOOST_AUTO_TEST_CASE(works_for_3_disks_and_1_iteration) {
	const double result = Problem430::expectedWhites(3, 1).convert_to<double>();
	const double expected = 10.0 / 9.0;
	BOOST_CHECK_CLOSE(result, expected, TOLERANCE);
}
BOOST_AUTO_TEST_CASE(works_for_3_disks_and_2_iterations) {
	const double result = Problem430::expectedWhites(3, 2).convert_to<double>();
	const double expected = 5.0 / 3.0;
	BOOST_CHECK_CLOSE(result, expected, TOLERANCE);
}
BOOST_AUTO_TEST_SUITE_END()
