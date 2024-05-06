const solve = (upperBound = 200) => {
	const answers = new Map();
	for(const combination of Tree.iterate([1], (combination) => {
		const children = [];
		for(const v1 of combination) {
			for(const v2 of combination) {
				const newChild = [...combination, v1 + v2];
				if(!children.some(c => c.equals(newChild)) && !combination.includes(v1 + v2)) {
					children.push([...combination, v1 + v2]);
				}
			}
		}
		return children;
	}, false, "bfs")) {
		if(!answers.has(combination[combination.length - 1])) {
			answers.set(combination[combination.length - 1], combination.length - 1);
			let isComplete = true;
			for(let i = 1; i <= upperBound; i ++) {
				if(!answers.has(i)) { isComplete = false; break; }
			}
			if(isComplete) {
				return [...answers.values()].sum();
			}
		}
	}
};
testing.addUnit("solve()", solve, [
	[2, 1],
	[3, 3],
	[4, 5]
]);
