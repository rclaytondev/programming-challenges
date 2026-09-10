module;

#include <boost/test/unit_test.hpp>

export module ModularTest;

import Modular;

BOOST_AUTO_TEST_SUITE(Modular_operations)

BOOST_AUTO_TEST_CASE(addition_with_ints_works) {
	Modular<int, 10> num { 7 };
	Modular result{ num + 5 };
	BOOST_CHECK_EQUAL(result.value, 2);
}

BOOST_AUTO_TEST_SUITE_END()