module;

#include <boost/test/unit_test.hpp>

export module RectPrismTest;

import RectPrism;

BOOST_AUTO_TEST_SUITE(RectPrism_points)

BOOST_AUTO_TEST_CASE(it_yields_all_the_tuples_in_the_rectangular_prism) {
	RectPrism prism{ { 2, 2, 3 } };
	auto points = std::ranges::to<std::set<std::vector<int>>>(prism.points());
	std::set<std::vector<int>> expected{
		{ 0, 0, 0 },
		{ 0, 0, 1 },
		{ 0, 0, 2 },
		{ 0, 1, 0 },
		{ 0, 1, 1 },
		{ 0, 1, 2 },
		{ 1, 0, 0 },
		{ 1, 0, 1 },
		{ 1, 0, 2 },
		{ 1, 1, 0 },
		{ 1, 1, 1 },
		{ 1, 1, 2 },
	};
	BOOST_CHECK(points == expected);
}

BOOST_AUTO_TEST_SUITE_END()

BOOST_AUTO_TEST_SUITE(RectPrism_diagonals)

BOOST_AUTO_TEST_CASE(it_returns_a_vector_such_that_the_ith_entry_is_the_set_of_all_points_with_a_sum_of_i) {
	RectPrism prism{ { 2, 2, 3 } };
	std::vector<std::set<std::vector<int>>> diagonals = prism.diagonals();
	std::vector<std::set<std::vector<int>>> expected{
		{ { 0, 0, 0 } },
		{ { 0, 0, 1 }, { 0, 1, 0 }, { 1, 0, 0 } },
		{ { 0, 1, 1 }, { 1, 0, 1 }, { 1, 1, 0 }, { 0, 0, 2 }},
		{ { 1, 1, 1 }, { 0, 1, 2 }, { 1, 0, 2 } },
		{ { 1, 1, 2 } }
	};
	BOOST_CHECK(diagonals == expected);
}

BOOST_AUTO_TEST_SUITE_END()
