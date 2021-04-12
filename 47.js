const problem47 = {
	distinctPrimeFactors: (number) => {
		return new Set(Math.factorize(number));
	},
	solve: () => {
		let iterations = 0;
		for(let a = 210; a < Infinity; a ++, iterations ++) {
			const b = a + 1, c = a + 2, d = a + 3;
			if(problem47.distinctPrimeFactors(d).size !== 4) {
				a = d;
				continue;
			}
			if(problem47.distinctPrimeFactors(c).size !== 4) {
				a = c;
				continue;
			}
			if(problem47.distinctPrimeFactors(b).size !== 4) {
				a = b;
				continue;
			}
			if(problem47.distinctPrimeFactors(a).size !== 4) {
				continue;
			}
			console.log(`the answer is ${a}`);
			return a;
		}
	}
};

testing.addUnit("problem47.distinctPrimeFactors()", problem47.distinctPrimeFactors, [
	[10, new Set([2, 5])],
	[20, new Set([2, 5])],
	[30, new Set([2, 3, 5])],
	[19, new Set([19])]
]);
const solve = () => {
	console.time("solving the problem");
	console.log(problem47.solve());
	console.timeEnd("solving the problem");
};

solve();
