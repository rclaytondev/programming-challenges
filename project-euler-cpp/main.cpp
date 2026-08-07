import Problem259;

import std;

#ifndef RUN_BOOST_TESTS

int main() {
	auto startTime = std::chrono::high_resolution_clock::now();

	Problem259::run();

	auto endTime = std::chrono::high_resolution_clock::now();
	std::chrono::duration<double, std::milli> milliseconds = endTime - startTime;
	std::chrono::duration<double, std::ratio<1, 1>> seconds = endTime - startTime;
	std::cout << "Finished main() in " << seconds.count() << " seconds (" << milliseconds.count() << " ms)\n";
	return 0;
}

#endif