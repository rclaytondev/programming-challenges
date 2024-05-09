import { assert } from "chai";
import { describe } from "mocha";

export const isPrime = (n: number) => {
	if(n <= 1 || n !== Math.floor(n)) {
		return false;
	}
	for(let k = 2; k <= Math.sqrt(n); k ++) {
		if(n % k === 0) { return false; }
	}
	return true;
};
export const generalizedModulo = (num: number, modulo: number) => {
	if(modulo <= 0) {
		throw new Error("Cannot take the modulo by a negative number or 0.");
	}
	if(num >= 0) { return num % modulo; }
	return num + modulo * Math.ceil((-num / modulo));
};
export const bezoutCoefficients = (num1: number, num2: number): [number, number] => {
	if(num1 < 0 && num2 < 0) {
		const [coef1, coef2] = bezoutCoefficients(-num1, -num2);
		return [-coef1, -coef2];
	}
	else if(num1 < 0) {
		const [coef1, coef2] = bezoutCoefficients(-num1, num2);
		return [-coef1, coef2];
	}
	else if(num2 < 0) {
		const [coef1, coef2] = bezoutCoefficients(num1, -num2);
		return [coef1, -coef2];
	}
	if(num1 === 0 || num2 === 0) {
		throw new Error("Cannot calculate Bezout coefficients when either of the inputs are zero.");
	}
	if(num1 !== Math.floor(num1) || num2 !== Math.floor(num2)) {
		throw new Error("Calculating Bezout coefficients when either of the inputs are non-integers is not currently supported.");
	}
	if(num1 % num2 === 1) {
		return [1, -Math.floor(num1 / num2)];
	}
	else if(num2 % num1 === 1) {
		return [-Math.floor(num2 / num1), 1];
	}
	if(num1 < num2) {
		const [coef1, coef2] = bezoutCoefficients(num1, num2 % num1);
		return [coef1 - Math.floor(num2 / num1) * coef2, coef2];
	}
	else {
		const [coef1, coef2] = bezoutCoefficients(num1 % num2, num2);
		return [coef1, coef2 - Math.floor(num1 / num2) * coef1];
	}
};

describe("isPrime", () => {
	it("returns false when the number is 0", () => {
		assert.isFalse(isPrime(0));
	});
	it("returns false when the number is negative", () => {
		assert.isFalse(isPrime(-2));
	});
	it("returns false when the number is not an integer", () => {
		assert.isFalse(isPrime(1.2));
	});
	it("works for numbers 1-10", () => {
		assert.isFalse(isPrime(1));
		assert.isTrue(isPrime(2));
		assert.isTrue(isPrime(3));
		assert.isFalse(isPrime(4));
		assert.isTrue(isPrime(5));
		assert.isFalse(isPrime(6));
		assert.isTrue(isPrime(7));
		assert.isFalse(isPrime(8));
		assert.isFalse(isPrime(9));
		assert.isFalse(isPrime(10));
	});
});
describe("generalizedModulo", () => {
	it("returns the same result as the % operator when the input is nonnegative", () => {
		assert.equal(generalizedModulo(10, 5), 0);
		assert.equal(generalizedModulo(11, 5), 1);
		assert.equal(generalizedModulo(12, 5), 2);
	});
	it("returns the result in the range [0, modulo) even if the input is negative", () => {
		assert.equal(generalizedModulo(-1, 3), 2);
		
		assert.equal(generalizedModulo(-10, 3), 2);
		assert.equal(generalizedModulo(-11, 3), 1);
		assert.equal(generalizedModulo(-12, 3), 0);
	});
});
describe("bezoutCoefficients", () => {
	const testCases = [
		[5, 7],
		[2, 3],
		[4, 3],
		[10, 7],
		[5, 1],

		[5, -7],
		[-2, 3],
		[-4, -3],
	];
	for(const [num1, num2] of testCases) {
		it(`returns the coefficients (s, t) such that ${num1}s + ${num2}t = 1, when given input (${num1}, ${num2})`, () => {
			const [coef1, coef2] = bezoutCoefficients(num1, num2);
			assert.equal(coef1 % 1, 0);
			assert.equal(coef2 % 1, 0);
			assert.equal(coef1 * num1 + coef2 * num2, 1);
		});
	}
});
