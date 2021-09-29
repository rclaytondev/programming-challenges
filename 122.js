const numMultiplications = (exponent) => {
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
		if(combination.includes(exponent)) { return combination.length - 1; }
	}
};
testing.addUnit("numMultiplications()", {
	"returns the correct result for 15": () => {
		const result = numMultiplications(15);
		expect(result).toEqual(5);
	}
});

const solve = () => {
	let answer = 0;
	for(let i = 1; i < 200; i ++) {
		answer += numMultiplications(i);
	}
	console.log(`the answer is ${answer}`);
	return answer;
};

// const testCases = Array(30).fill().map((v, i) => i);
// const timePolynomial = utils.time.extrapolate(
// 	numMultiplications,
// 	""
// );
