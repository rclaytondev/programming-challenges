export module Problem988;

import std;

class QueueSet {
private:
	std::priority_queue<int, std::vector<int>, std::greater<int>> queue;
	std::set<int> set;

public:
	QueueSet() : queue(std::priority_queue<int, std::vector<int>, std::greater<int>>{}), set(std::set<int>{}) { }
	QueueSet(std::initializer_list<int> list) : queue(std::from_range, list), set(list) { }

	const std::set<int> values() const {
		return this->set;
	}
	int top() const {
		return this->queue.top();
	}
	void insert(int value) {
		if (!this->set.contains(value)) {
			this->queue.push(value);
			this->set.insert(value);
		}
	}
	void pop() {
		int top = this->queue.top();
		this->queue.pop();
		this->set.erase(top);
	}
	int size() {
		return this->queue.size();
	}
};

namespace Problem988 {
	long long calls = 0;
}

class Solver {
public:
	std::set<int> all;
	std::map<int, std::set<int>> neighborsMap;
	std::map<std::set<int>, long long> cache;

	Solver(const std::set<int>& all, const std::set<int>& allowed) : all(all) {
		for (int i : allowed) {
			this->neighborsMap[i] = (allowed
				| std::views::filter([all, i](int j) { return !all.contains(std::abs(i - j)); })
				| std::ranges::to<std::set<int>>()
			);
		}
	}

	std::set<int> neighbors(int vertex, const std::set<int>& remaining) {
		return (remaining
			| std::views::filter([this, vertex](int n) {
				return n != vertex && !this->all.contains(std::abs(n - vertex));
			})
			| std::ranges::to<std::set<int>>()
		);
	}
	int degree(int vertex, const std::set<int>& remaining) {
		return this->neighbors(vertex, remaining).size();
	}
	int nextChoice(const std::set<int>& remaining) {
		std::vector<int> remainingList{ remaining.begin(), remaining.end() };
		std::map<int, int> degrees;
		for (int v : remaining) {
			degrees[v] = this->degree(v, remaining);
		}
		auto smallest = (*std::min_element(degrees.begin(), degrees.end(), [](auto& p1, auto& p2) {
			return p1.second < p2.second;
		})).first;
		std::set<int> neighbors( this->neighbors(smallest, remaining) );
		if (neighbors.size() == 0) {
			return smallest;
		}
		return *neighbors.begin();		
	}
	long long nonAttackingSets(const std::set<int>& remaining) {
		Problem988::calls++;
		auto it = this->cache.find(remaining);
		if (it != this->cache.end()) {
			return (*it).second;
		}
		if (remaining.size() == 0) { return 1; }
		const int next = this->nextChoice(remaining);
		long long with = this->nonAttackingSetsWith(next, remaining);
		long long without = this->nonAttackingSetsWithout(next, remaining);
		long long result = with + without;
		this->cache[remaining] = result;
		return result;
	}
	long long nonAttackingSetsWith(int next, const std::set<int>& remaining) {
		std::set<int> newRemaining = (remaining
			| std::views::filter([next, this](int n) { return n != next && this->all.contains(std::abs(n - next)); })
			| std::ranges::to<std::set<int>>()
		);
		return this->nonAttackingSets(newRemaining);
	}
	long long nonAttackingSetsWithout(int next, const std::set<int>& remaining) {
		std::set<int> newRemaining = remaining;
		newRemaining.erase(next);
		return this->nonAttackingSets(newRemaining);
	}
};

namespace Problem988 {
	export std::generator<int> attackedBy0(int step1, int step2) {
		QueueSet unchecked{ 0 };
		while (true) {
			int current = unchecked.top();
			unchecked.pop();
			co_yield current;
			unchecked.insert(current + step1);
			unchecked.insert(current + step2);
		}
	}

	export std::set<int> nonAttackedBy0(int step1, int step2) {
		/* Returns all integers that are not a nonnegative integer linear combination of `step1` and `step2`, as well as 0. */
		std::set<int> modsSeen;
		std::set<int> nonAttacking{ 0 };
		int last = 0;
		for (const int attacked : Problem988::attackedBy0(step1, step2)) {
			for (int i = last + 1; i < attacked; i++) {
				nonAttacking.insert(i);
			}
			modsSeen.insert(attacked % step1);
			if (modsSeen.size() >= step1) {
				break;
			}
			last = attacked;
		}
		return nonAttacking;
	}


	long long nonAttackingSum(const std::set<int>& all, long long partialSum, const std::set<int>& remaining) {
		long long sum = 0;
		for (auto first = remaining.begin(); first != remaining.end(); first++) {
			std::set<int> newRemaining;
			for (auto other = std::next(first); other != remaining.end(); other++) {
				if (all.contains(*other - *first)) {
					newRemaining.insert(*other);
				}
			}
			sum += Problem988::nonAttackingSum(all, partialSum + *first, newRemaining);
		}
		return sum + partialSum;
	}

	export long long solve(int step1, int step2) {
		auto nonAttackedBy0{ Problem988::nonAttackedBy0(step1, step2) };
		nonAttackedBy0.erase(0);
		long long sum = 0;
		Solver solver{ nonAttackedBy0, nonAttackedBy0 };
		for (const int num : nonAttackedBy0) {
			long long subsets = solver.nonAttackingSetsWith(num, nonAttackedBy0);
			sum += num * subsets;
		}
		return sum;
	}

	export void run() {
		long long result = Problem988::solve(19, 53);
		std::cout << "Answer: " << result << "\n";
		std::cout << "Calls to nonAttackingSets: " << Problem988::calls << "\n";
	}
}