module;

#include <boost/numeric/ublas/matrix.hpp>

export module Problem458;

import std;
import Modular;

using boost::numeric::ublas::matrix;
using boost::numeric::ublas::prod;

namespace Problem458 {
	export template<long long modulo>
	matrix<Modular<long long, modulo>> initialize() {
		matrix<Modular<long long, modulo>> result;
		matrix<Modular<long long, modulo>> foo;
		return prod(result, foo);
	}

	export long long solve(long long length, int alphabetSize, long long modulo = -1) {
		auto m{ Problem458::initialize<100>() };
		return 0;
	}

	export void run() {
		long long answer = Problem458::solve(10, 7, 1'000'000'000);
		std::cout << "Answer: " << answer << "\n";
	}
}