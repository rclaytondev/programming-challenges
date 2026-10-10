module;

#include <boost/test/unit_test.hpp>

export module SetUtilsTest;

import std;
import SetUtils;

BOOST_AUTO_TEST_SUITE(SetUtils_subsets)

BOOST_AUTO_TEST_CASE(it_returns_all_the_subsets_of_the_given_set) {
	std::set<int> nums{ 1, 2, 3 };
	std::set<std::set<int>> expected{
		{ },
		{ 1 },
		{ 2 },
		{ 3 },
		{ 1, 2 },
		{ 2, 3 },
		{ 1, 3 },
		{ 1, 2, 3 },
	};
	auto actual = std::ranges::to<std::set<std::set<int>>>(SetUtils::subsets(nums));
	BOOST_CHECK(actual == expected);
}

BOOST_AUTO_TEST_SUITE_END()