import { BigintMath } from "../../../utils-ts/modules/math/BigintMath.mjs";
import { CountLogger } from "../../project-specific-utilities/CountLogger.mjs";

export class Problem686 {
	static getSkip(targetStartingDigits: bigint, currentStartingDigits: bigint) {
		let lowerBound = currentStartingDigits;
		let upperBound = currentStartingDigits + 1n;
		let skips = 0;
		let valid = true;
		do {
			lowerBound *= 2n;
			upperBound *= 2n;
			const lowerDigits = BigintMath.fromDigits(BigintMath.digits(lowerBound).slice(0, `${targetStartingDigits}`.length));
			const upperDigits = BigintMath.fromDigits(BigintMath.digits(upperBound).slice(0, `${targetStartingDigits}`.length));
			valid = (
				(`${lowerBound}`.length === `${upperBound}`.length)
				&& !(lowerDigits <= targetStartingDigits && targetStartingDigits <= upperDigits)
			);
			skips ++;
		} while(valid);
		return skips;
	}
	static getSkips(targetStartingDigits: number, digitsUsed: number) {
		const skips: { [key: string]: number } = {};
		for(let i = 10 ** (digitsUsed - 1); i < 10 ** digitsUsed; i ++) {
			skips[i] = Problem686.getSkip(BigInt(targetStartingDigits), BigInt(i));
		}
		return skips;
	}

	static solve(startingDigits: bigint, index: bigint) {
		const DIGITS_TO_USE = 4;
		const numDigits = `${startingDigits}`.length;
		const startingDigitsStr = `${startingDigits}`;
		const logger = new CountLogger(n => n, Number(index));
		const skips = Problem686.getSkips(Number(startingDigits), DIGITS_TO_USE);
		let power = 1n;
		let exponent = 0n;
		let numFound = 0n;
		while(true) {
			const currentDigits = `${power}`.substring(0, numDigits);
			if(currentDigits === startingDigitsStr) {
				numFound ++;
				if(numFound >= index) {
					break;
				}
				logger.count();
				// console.log(exponent);
			}
			const currentApproximation = `${power}`.substring(0, DIGITS_TO_USE);
			const skip = (currentApproximation.length < DIGITS_TO_USE) ? 1 : skips[currentApproximation];
			// const skip = 1;
			power *= 2n ** BigInt(skip);
			exponent += BigInt(skip);
		}
		return exponent;
	}
}

// console.time();
// // console.log(Problem686.solve(123n, 678910n));
// console.log(Problem686.solve(123n, 400n));
// console.timeEnd();
// debugger;
