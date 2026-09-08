//export module Problem166;
//
//import std;
//
//namespace Problem166 {
//	const int MAX = 9;
//	const std::array<int, 9> VALUES = { 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 };
//
//	long long solve4x4(int sum) {
//		
//		for (const auto& colSumTops : std::views::cartesian_product()) {
//
//		}
//	}
//	long long solve4x4() {
//		long long result = 0;
//		for (int sum = 0; sum <= Problem166::MAX * 4; sum++) {
//			result += Problem166::solve4x4(sum);
//		}
//		return result;
//	}
//}