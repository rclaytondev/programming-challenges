module;

#include <boost/test/unit_test.hpp>

export module Problem78Test;

import Problem78;

BOOST_AUTO_TEST_SUITE(Problem78)

BOOST_AUTO_TEST_CASE(partition_test_on_input_of_1) {
	int result = Problem78::partitions(1, 100000);
	BOOST_CHECK_EQUAL(result, 1);
}
BOOST_AUTO_TEST_CASE(partition_test_on_input_of_2) {
	int result = Problem78::partitions(2, 100000);
	BOOST_CHECK_EQUAL(result, 2);
}
BOOST_AUTO_TEST_CASE(partition_test_on_input_of_3) {
	int result = Problem78::partitions(3, 100000);
	BOOST_CHECK_EQUAL(result, 3);
}
BOOST_AUTO_TEST_CASE(partition_test_on_input_of_4) {
	int result = Problem78::partitions(4, 100000);
	BOOST_CHECK_EQUAL(result, 5);
}
BOOST_AUTO_TEST_CASE(partition_test_on_input_of_5) {
	int result = Problem78::partitions(5, 100000);
	BOOST_CHECK_EQUAL(result, 7);
}

BOOST_AUTO_TEST_SUITE_END()
