import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Sequence } from "../../utils-ts/modules/math/Sequence.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const isPowerOf = (base: number, num: number) => {
	if(base === 1) { return num === 1; }
	for(let exponent = 1; base ** exponent <= num; exponent ++) {
		if(base ** exponent === num) { return true; }
	}
	return false;
};

const isPowerOfDigitSum = (num: number) => isPowerOf(MathUtils.sum(MathUtils.digits(num)), num);

export const powers = function*(): Generator<number, never> {
	let largestBase = 2;
	let lastYielded = 0;
	const powers = [{ base: 2, exponent: 2, value: 4 }];
	while(true) {
		const minIndex = Utils.minIndex(powers, v => v.value);
		const { base, exponent, value } = powers[minIndex];
		powers.splice(minIndex, 1);
		if(value !== lastYielded) {
			yield value;
			lastYielded = value;
		}
		powers.push({ base: base, exponent: exponent + 1, value: value * base });
		if(base === largestBase) {
			powers.push({ base: largestBase + 1, exponent: 2, value: (largestBase + 1) ** 2 });
			largestBase ++;
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

console.time();
console.log(solutionSequence.getTerm(18));
console.timeEnd();
debugger;
