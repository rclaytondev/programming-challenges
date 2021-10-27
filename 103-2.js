const isSpecialSet = (set) => {
	for(const s1 of set.subsets()) {
		if([...s1].sum() === 0) { continue; }
		for(const s2 of set.difference(s1).subsets()) {
			if([...s2].sum() === 0) { continue; }
			const sum1 = [...s1].sum();
			const sum2 = [...s2].sum();
			if(sum1 === sum2) { return false; }
			if(s1.size !== s2.size && (sum1 > sum2) !== (s1.size > s2.size)) {
				return false;
			}
		}
	}
	return true;
};
const partitions = (number => {
	if(number < 1) { return []; }
	if(number === 1) { return [[1]]; }
	const ways = [];
	for(const array of Tree.iterate([], function*(array) {
		const sum = array.sum();
		for(let i = array[array.length - 1] ?? 1; i + sum <= number && i <= number; i ++) {
			yield [...array, i];
		}
	})) {
		if(array.sum() === number) { ways.push(array); }
	}
	return ways;
}).memoize(true);
const solve = (setSize = 7) => {
	for(let sum = 1; sum < Infinity; sum ++) {
		for(const partition of partitions(sum)) {
			const set = new Set(partition);
			if(partition.length === set.size && set.size === setSize && isSpecialSet(new Set(partition))) {
				return partition;
			}
		}
	}
};


testing.addUnit("isSpecialSet()", isSpecialSet, [
	[new Set([1]), true],
	[new Set([1, 2]), true],
	[new Set([2, 3, 4]), true],
	[new Set([3, 5, 6, 7]), true],
	[new Set([6, 9, 11, 12, 13]), true],


	[new Set([1, 2, 3]), false],
	[new Set([3, 4, 5, 6]), false],
	[new Set([4, 5, 9]), false]
]);
testing.addUnit("partitions()", partitions, [
	[1, [[1]]],
	[2, [[1, 1], [2]]],
	[3, [[1, 1, 1], [1, 2], [3]]]
]);
