#include "project-euler-cpp/solved/1-multiples-of-3-and-5/multiples-of-3-and-5.h"

#include <iostream>

using namespace std;

namespace Problem1 {
	void run() {
		int sum = 0;
		for(int i = 1; i < 1000; i ++) {
			if(i % 3 == 0 || i % 5 == 0) {
				sum += i;
			}
		}
		cout << sum;
	}
}

