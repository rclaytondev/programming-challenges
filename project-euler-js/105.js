const isSpecial = (set) => {
	set = new Set(set);
	const subsets = set.subsets();
	for(const s1 of subsets) {
		for(const s2 of subsets) {
			if(!s1.equals(s2)) {
				const sum1 = [...s1].sum();
				const sum2 = [...s2].sum();
				if(sum1 === sum2) { return false; }
				if(s1.size > s2.size && sum1 < sum2) { return false; }
				if(s2.size > s1.size && sum2 < sum1) { return false; }
			}
		}
	}
	return true;
};
testing.addUnit("isSpecial()", isSpecial, [
	[[1, 2, 3], false], // 1 + 2 = 3
	[[5, 9, 24], false], // 5 + 9 < 24

	[[1, 2], true],
	[[2, 3, 4], true],
	[[3, 5, 6, 7], true],
	[[6, 9, 11, 12, 13], true],
	[[11, 18, 19, 20, 22, 25], true]
]);
testing.testAll();


const solve = () => {
	let result = 0;
	for(const set of SETS) {
		if(isSpecial(set)) {
			result += [...set].sum();
		}
	}
	console.log(`the answer is ${result}`);
	return result;
};
