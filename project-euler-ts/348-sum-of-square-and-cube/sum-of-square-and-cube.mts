import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const isPalindrome = (num: number) => {
	const str = num.toString();
	return str === str.split("").reverse().join("");
};

export const naivePalindromes = function*() {
	for(let i = 1; true; i ++) {
		if(isPalindrome(i)) {
			yield i;
		}
	}
};

export const palindromes = function*() {
	for(let digits = 1; true; digits ++) {
		const half = Math.ceil(digits / 2);
		for(let i = 10 ** (half-1); i < 10 ** half; i ++) {
			const reversed = MathUtils.fromDigits(MathUtils.digits(i).reverse().slice(digits % 2));
			yield Number.parseInt(`${i}${reversed}`);
		}
	}
};

export const sumsOfSquareAndCube = (num: number) => {
	const ways: [number, number][] = [];
	for(let i = 2; i ** 3 <= num - 4; i ++) {
		const difference = num - (i ** 3);
		if(Math.sqrt(difference) % 1 === 0 && !ways.some(([x]) => x === i ** 3)) {
			ways.push([difference, i ** 3]);
		}
	}
	return ways;
};

export const solve = (count: number = 5, ways: number = 4) => {
	const numsFound = [];
	for(const palindrome of palindromes()) {
		if(sumsOfSquareAndCube(palindrome).length === ways) {
			numsFound.push(palindrome);
			if(numsFound.length >= count) {
				break;
			}
		}
	}
	return MathUtils.sum(numsFound);
};

// console.time();
// console.log(solve());
// console.timeEnd();
// debugger;
