export module Problem1;

import std;

namespace Problem1 {
	export void run() {
		int sum = 0;
		for(int i = 1; i < 1000; i ++) {
			if(i % 3 == 0 || i % 5 == 0) {
				sum += i;
			}
		}
		std::cout << sum;
	}
}

