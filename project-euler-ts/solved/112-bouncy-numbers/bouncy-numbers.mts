import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";
import { CountLogger } from "../../project-specific-utilities/CountLogger.mjs";

export class Problem112 {
	static consecutivePairs<T>(array: T[]) {
		const pairs = [];
		for(let i = 0; i < array.length - 1; i ++) {
			pairs.push([array[i], array[i+1]]);
		}
		return pairs;
	}
	static isIncreasing(num: number) {
		return Problem112.consecutivePairs(MathUtils.digits(num)).every(([a, b]) => a <= b);
	}
	static isDecreasing(num: number) {
		return Problem112.consecutivePairs(MathUtils.digits(num)).every(([a, b]) => a >= b);
	}
	static isBouncy(num: number) {
		return !Problem112.isIncreasing(num) && !Problem112.isDecreasing(num);
	}

	static solve(bouncyProportion: number = 0.99) {
		const logger = new CountLogger(n => 1000 * n);
		let numBouncy = 0;
		for(let i = 1; true; i ++) {
			logger.count();
			if(Problem112.isBouncy(i)) {
				numBouncy ++;
			}
			if(numBouncy / i === bouncyProportion) {
				return i;
			}
		}
	}
}

// console.time();
// console.log(Problem112.solve(0.99));
// console.timeEnd();
// debugger;
