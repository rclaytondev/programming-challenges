import { ArrayUtils } from "../../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { GenUtils } from "../../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";

export class PartialReversible {
	targetDigitCount: number;
	startDigits: number[];
	endDigits: number[];

	constructor(targetDigitCount: number, startDigits: number[], endDigits: number[]) {
		this.targetDigitCount = targetDigitCount;
		this.startDigits = startDigits;
		this.endDigits = endDigits;
	}

	nexts() {
		const result: (PartialReversible | number)[] = [];
		const digitCount = this.endDigits.length;
		if(digitCount * 2 === this.targetDigitCount) {
			const num = MathUtils.fromDigits([...this.startDigits, ...this.endDigits]);
			return Problem145.isReversible(num) ? [num] : [];
		}
		if(digitCount * 2 + 1 === this.targetDigitCount) {
			for(let next = 0; next < 10; next ++) {
				const digits = [...this.startDigits, next, ...this.endDigits];
				const num = MathUtils.fromDigits(digits);
				if(Problem145.isReversible(num)) {
					result.push(num);
				}
			}
		}
		else {
			for(let nextStart = 0; nextStart < 10; nextStart ++) {
				for(let nextEnd = 0; nextEnd < 10; nextEnd ++) {
					if(digitCount === 0 && (nextStart === 0 || nextEnd === 0)) {
						continue;
					}
					const startDigits = [...this.startDigits, nextStart];
					const endDigits = [nextEnd, ...this.endDigits];
					const nextReversedSum = (MathUtils.fromDigits(startDigits.toReversed()) + MathUtils.fromDigits(endDigits));
					if(MathUtils.digits(nextReversedSum % (10 ** (digitCount + 1))).every(d => d % 2 === 1)) {
						result.push(new PartialReversible(this.targetDigitCount, startDigits, endDigits));
					}
				}
			}
		}
		return result;
	}

	completions() {
		let count = 0;
		for(const next of this.nexts()) {
			if(typeof next === "number") {
				count ++;
			}
			else {
				count += next.completions();
			}
		}
		return count;
	}
	naiveCompletions() {
		const remainingDigits = this.targetDigitCount - this.startDigits.length - this.endDigits.length;
		const completions = [];
		for(const middleDigits of GenUtils.cartesianPower(ArrayUtils.range(0, 9), remainingDigits)) {
			if(middleDigits[0] === 0 && this.startDigits.length === 0) {
				continue;
			}
			const num = MathUtils.fromDigits([
				...this.startDigits,
				...middleDigits,
				...this.endDigits,
			]);
			if(Problem145.isReversible(num)) {
				completions.push(num);
			}
		}
		return completions;
	}

	toString() {
		const numBlanks = this.targetDigitCount - (this.startDigits.length + this.endDigits.length);
		return this.startDigits.join("") + "_".repeat(numBlanks) + this.endDigits.join("");
	}
}

export class Problem145 {
	static reverse(num: number) {
		return MathUtils.fromDigits(MathUtils.digits(num).toReversed());
	}
	static isReversible(num: number, reversed: number = Problem145.reverse(num)) {
		if(num % 10 === 0) {
			return false;
		}
		return MathUtils.digits(num + reversed).every(d => d % 2 === 1);
	}

	static solve(maxDigits: number) {
		let count = 0;
		for(let digits = 2; digits <= maxDigits; digits ++) {
			const partial = new PartialReversible(digits, [], []);
			count += partial.completions();
		}
		return count;
	}
}

// console.time();
// console.log(Problem145.solve(9));
// console.timeEnd();
// debugger;
