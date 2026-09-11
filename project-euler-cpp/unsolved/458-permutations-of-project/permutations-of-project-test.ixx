module;

#include <boost/test/unit_test.hpp>
#include <boost/numeric/ublas/matrix.hpp>

export module Problem458Test;

import Problem458;
import Modular;
import MathUtils;

using boost::numeric::ublas::matrix;

BOOST_AUTO_TEST_SUITE(Problem458_solve)

BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_4) {
	long long actual = Problem458::solve<1'000'000'000'000>(4, 4);
	long long expected = (4 * 4 * 4 * 4) - (4 * 3 * 2 * 1);
	BOOST_CHECK_EQUAL(actual, expected);
}
BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_3_with_alphabet_size_2) {
	long long actual = Problem458::solve<1'000'000'000'000>(3, 2);
	long long expected = 2; // 111 and 222
	BOOST_CHECK_EQUAL(actual, expected);
}
BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_4_with_alphabet_size_3) {
	long long actual = Problem458::solve<1'000'000'000'000>(4, 3);
	long long expected = (3 * 3 * 3 * 3) - 2 * (3 * 2 * 1 * 3) + (3 * 2 * 1);
	BOOST_CHECK_EQUAL(actual, expected);
}
BOOST_AUTO_TEST_CASE(it_works_for_an_input_of_5_with_alphabet_size_4) {
	long long actual = Problem458::solve<1'000'000'000'000>(5, 4);

	long long total = 4 * 4 * 4 * 4 * 4;
	long long invalidLeft = 4 * 3 * 2 * 1 * 4;
	long long invalidRight = 4 * 3 * 2 * 1 * 4;
	long long invalidBoth = 4 * 3 * 2 * 1 * 1;
	long long expected = total - invalidLeft - invalidRight + invalidBoth;

	BOOST_CHECK_EQUAL(actual, expected);
}

BOOST_AUTO_TEST_SUITE_END()


BOOST_AUTO_TEST_SUITE(Problem458_initialize)

BOOST_AUTO_TEST_CASE(it_correctly_computes_the_adjacency_matrix_of_the_state_graph) {
	std::vector<std::vector<long long>> values = {
		{ 1, 1, 1 },
		{ 3, 1, 1 },
		{ 0, 2, 1 },
	};
	auto expected{ Problem458::createMatrix<long long, 100>(3, 3, values) };
	auto actual{ Problem458::initialize<100>(4) };
	BOOST_CHECK(actual == expected);
}

BOOST_AUTO_TEST_SUITE_END()