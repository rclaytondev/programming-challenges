const naiveSolution = (log2OfDivisors) => {
	const divisors = 2 ** log2OfDivisors;
	for(let i = 0; i < Infinity; i ++) {
		if(Math.divisors(i).length === divisors) {
			return i;
		}
	}
};
const leastWith2ToTheNDivisors = (log2OfDivisors) => {
	let exponents = [];
	for(let i = 0; i < log2OfDivisors; i ++) {
		let nextExponents = [];
		let nextNumber = Infinity;
		for(let i = 0; i < exponents.length + 1; i ++) {
			const exponent = exponents[i] ?? 0;
			const newExponent = 2 * exponent + 1;
			const newExponents = [...exponents];
			newExponents[i] = newExponent;
			const newNumber = newExponents.map((e, i) => Sequence.PRIMES.nthTerm(i) ** e).product();
			if(newNumber < nextNumber) {
				nextNumber = newNumber;
				nextExponents = newExponents;
			}
		}
		exponents = nextExponents;
	}
	return exponents.map((e, i) => Sequence.PRIMES.nthTerm(i) ** e).product();
};
testing.addUnit("leastWith2ToTheNDivisors()", {
	"returns the correct result for 2": () => {
		expect(leastWith2ToTheNDivisors(2)).toEqual(6);
	},
	"returns the correct result for 3": () => {
		expect(leastWith2ToTheNDivisors(3)).toEqual(24);
	},
	"returns the correct result for 4": () => {
		expect(leastWith2ToTheNDivisors(4)).toEqual(120);
	},
	"returns the correct result for 5": () => {
		expect(leastWith2ToTheNDivisors(5)).toEqual(840);
	},
	"returns the correct result for 6": () => {
		expect(leastWith2ToTheNDivisors(6)).toEqual(7560);
	},
	"returns the correct result for 7": () => {
		expect(leastWith2ToTheNDivisors(7)).toEqual(83160);
	},
});

const waysToExpressAsSum = function*(sum) {
	for(const list of Tree.iterate([], function*(incompleteList) {
		const partialSum = incompleteList.sum();
		for(let i = incompleteList.lastItem() ?? 1; i + partialSum <= sum; i ++) {
			yield [...incompleteList, i];
		}
	}, true)) {
		if(list.sum() === sum) { yield list; }
	}
}
testing.addUnit("waysToExpressAsSum", {
	"returns the correct result for 1": () => {
		expect(new Set(waysToExpressAsSum(1))).toEqual(new Set([[1]]));
	},
	"returns the correct result for 2": () => {
		expect(new Set(waysToExpressAsSum(2))).toEqual(new Set([
			[1, 1],
			[2]
		]));
	},
	"returns the correct result for 3": () => {
		expect(new Set(waysToExpressAsSum(3))).toEqual(new Set([
			[1, 1, 1],
			[1, 2],
			[3]
		]));
	},
	"returns the correct result for 4": () => {
		expect(new Set(waysToExpressAsSum(4))).toEqual(new Set([
			[1, 1, 1, 1],
			[1, 1, 2],
			[1, 3],
			[2, 2],
			[4]
		]));
	},
	"returns the correct result for 5": () => {
		expect(new Set(waysToExpressAsSum(5))).toEqual(new Set([
			[1, 1, 1, 1, 1],
			[1, 1, 1, 2],
			[1, 1, 3],
			[1, 2, 2],
			[1, 4],
			[2, 3],
			[5]
		]));
	},
});

const leastWithFactorization = (exponents) => {
	exponents = [...exponents].sort((a, b) => b - a); // descending order
	const primes = Sequence.PRIMES.slice(0, exponents.length);
	return primes.map((p, i) => p ** exponents[i]).product();
};
testing.addUnit("leastWithFactorization()", {
	"returns the correct answer for a single exponent": () => {
		expect(leastWithFactorization([5])).toEqual(32);
	},
	"returns the correct answer for multiple exponents": () => {
		expect(leastWithFactorization([2, 3])).toEqual(72);
	},
});

testing.testAll();
