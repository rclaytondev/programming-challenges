import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { PriorityQueue } from "../../utils-ts/modules/PriorityQueue.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const isPowerOf = (base: number, num: number) => {
	if(base === 1) { return num === 1; }
	for(let exponent = 1; base ** exponent <= num; exponent ++) {
		if(base ** exponent === num) { return true; }
	}
	return false;
};

const isPowerOfDigitSum = (num: number) => isPowerOf(MathUtils.sum(MathUtils.digits(num)), num);

const nextPrime = (num: number) => {
	for(let i = num + 1; true; i ++) {
		if(MathUtils.isPrime(i)) {
			return i;
		}
	}	
};

export const powers = function*(): Generator<number, never> {
	let largestExponent = 2;
	let lastYielded = 0;
	const powers = new PriorityQueue<{ base: number, exponent: number, value: number }>();
	powers.insert({ base: 2, exponent: 2, value: 4 }, 4);
	while(true) {
		const { base, exponent, value } = powers.pop();
		if(value !== lastYielded) {
			yield value;
			lastYielded = value;
		}
		powers.insert({ base: base + 1, exponent: exponent, value: (base + 1) ** exponent }, (base + 1) ** exponent);
		if(exponent === largestExponent) {
			largestExponent ++;
			powers.insert({ base: 2, exponent: exponent + 1, value: 2 ** (exponent + 1) }, 2 ** (exponent + 1));
		}
	}
}

export const solutionSequence = new Sequence(function*() {
	for(const power of powers()) {
		if(power >= 10 && isPowerOfDigitSum(power)) {
			console.log(power);
			yield power;
		}
	}
	throw new Error("Unreachable.");
});

// console.time();
// console.log(solutionSequence.getTerm(25));
// console.timeEnd();
// debugger;
