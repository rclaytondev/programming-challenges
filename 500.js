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


// testing.testAll();
const MODULO = 500500507;
console.log(`the answer is ${leastWith2ToTheNDivisors(500500, MODULO)}`);


const num1 = Math.round(Math.random() * 100);
const num2 = Math.round(Math.random() * 100);
const num3 = Math.round(Math.random() * 100);
const modulo = Math.round(Math.random() * 100);
let product = 1;
const actualAnswer = (num1 * num2 * num3) % modulo;
const myAnswer = ((((num1 % modulo) * num2) % modulo) * num3) % modulo;
