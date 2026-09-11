module;

#include <boost/test/unit_test.hpp>

export module ModularTest;

import Modular;

BOOST_AUTO_TEST_SUITE(Modular_operations)

BOOST_AUTO_TEST_CASE(addition_with_ints_works) {
	Modular<int, 10> num = 7;
	Modular result{ num + 5 };
	BOOST_CHECK_EQUAL(result.value, 2);
}
BOOST_AUTO_TEST_CASE(addition_with_other_Modular_works) {
	Modular<int, 10> num1 = 7;
	Modular<int, 10> num2 = 5;
	Modular result = num1 + num2;
	BOOST_CHECK_EQUAL(result.value, 2);
}
BOOST_AUTO_TEST_CASE(multiplication_with_ints_works) {
	Modular<int, 10> num = 7;
	Modular result{ num * 4 };
	BOOST_CHECK_EQUAL(result.value, 8);
}
BOOST_AUTO_TEST_CASE(multiplication_other_Modular_works) {
	Modular<int, 10> num1 = 7;
	Modular<int, 10> num2 = 4;
	Modular result = num1 * num2;
	BOOST_CHECK_EQUAL(result.value, 8);
}

BOOST_AUTO_TEST_SUITE_END()