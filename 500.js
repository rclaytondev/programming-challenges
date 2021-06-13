const naiveSolution = (log2OfDivisors) => {
	const divisors = 2 ** log2OfDivisors;
	for(let i = 0; i < Infinity; i ++) {
		if(Math.divisors(i).length === divisors) {
			return i;
		}
	}
};
const leastWith2ToTheNDivisors = (log2OfDivisors, modulo = Infinity) => {
	log2OfDivisors = BigInt(log2OfDivisors);
	const exponents = [];
	const indices = [0];
	const multipliers = [2n];
	for(let i = 0; i < log2OfDivisors; i ++) {
		const index = indices[0];
		const exponent = exponents[index] ?? 0;
		exponents[index] = 2 * exponent + 1;
		multipliers.shift(), indices.shift();
		for(const possibleIndex of [index, index + 1]) {
			if(!possibleIndex || exponents[possibleIndex] < exponents[possibleIndex - 1] || possibleIndex === exponents.length) {
				const multiplier = BigInt(Sequence.PRIMES.nthTerm(possibleIndex)) ** BigInt((exponents[possibleIndex] ?? 0) + 1);
				for(let j = 0; j <= multipliers.length; j ++) {
					if((multipliers[j] ?? Infinity) > multiplier) {
						multipliers.splice(j, 0, multiplier);
						indices.splice(j, 0, possibleIndex);
						break;
					}
				}
			}
		}
	}
	let result = 1;
	exponents.forEach((exponent, index) => {
		result *= Sequence.PRIMES.nthTerm(index) ** exponent;
		result %= modulo;
	});
	return result;
};
testing.addUnit("leastWith2ToTheNDivisors()", {
	"returns the correct result for 2": () => {
		expect(leastWith2ToTheNDivisors(2)).toEqual(6n);
	},
	"returns the correct result for 3": () => {
		expect(leastWith2ToTheNDivisors(3)).toEqual(24n);
	},
	"returns the correct result for 4": () => {
		expect(leastWith2ToTheNDivisors(4)).toEqual(120n);
	},
	"returns the correct result for 5": () => {
		expect(leastWith2ToTheNDivisors(5)).toEqual(840n);
	},
	"returns the correct result for 6": () => {
		expect(leastWith2ToTheNDivisors(6)).toEqual(7560n);
	},
	"returns the correct result for 7": () => {
		expect(leastWith2ToTheNDivisors(7)).toEqual(83160n);
	},
});

const defactorize = (exponents) => exponents.map((e, i) => BigInt(Sequence.PRIMES.nthTerm(i)) ** BigInt(e)).product();

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
// const MODULO = 500500507;
// const time = utils.timeFunction(() => {
// 	console.log(`the answer is ${leastWith2ToTheNDivisors(500500, MODULO)}`);
// });


const num1 = Math.round(Math.random() * 100);
const num2 = Math.round(Math.random() * 100);
const num3 = Math.round(Math.random() * 100);
const modulo = Math.round(Math.random() * 100);
let product = 1;
const actualAnswer = (num1 * num2 * num3) % modulo;
const myAnswer = ((((num1 % modulo) * num2) % modulo) * num3) % modulo;
