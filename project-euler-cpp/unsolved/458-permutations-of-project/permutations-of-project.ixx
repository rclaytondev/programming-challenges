module;

#include <boost/numeric/ublas/matrix.hpp>

export module Problem458;

import std;
import Modular;
import MathUtils;

using boost::numeric::ublas::matrix;
using boost::numeric::ublas::prod;

namespace Problem458 {
	export template<long long modulo>
	matrix<Modular<long long, modulo>> initialize(int alphabetSize) {
		matrix<Modular<long long, modulo>> result(alphabetSize - 1, alphabetSize - 1);
		for (int k = 0; k < alphabetSize - 1; k++) {
			for (int j = 0; j <= k; j++) {
				result(j, k) = 1;
			}
			if (k != alphabetSize - 2) {
				result(k + 1, k) = alphabetSize - (k + 1);
			}
		}
		return result;
	}

	export template<typename N, N modulo>
	matrix<Modular<N, modulo>> createMatrix(int width, int height, std::vector<std::vector<N>> values) {
		matrix<Modular<N, modulo>> mat (width, height);
		for (int i = 0; i < values.size(); i++) {
			for (int j = 0; j < values[i].size(); j++) {
				mat(i, j) = Modular<N, modulo>{ values[i][j] };
			}
		}
		return mat;
	}

	export template<long long modulo>
	long long solve(long long length, int alphabetSize) {
		auto mat { Problem458::initialize<modulo>(alphabetSize) };
		std::cout << mat << "\n";
		return 0;
	}

	export void run() {
		long long answer = Problem458::solve<1'000'000'000'000>(10, 7);
		std::cout << "Answer: " << answer << "\n";
	}
}