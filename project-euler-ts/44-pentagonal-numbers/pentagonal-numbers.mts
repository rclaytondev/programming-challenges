import { assert } from "chai";

const pentagonals = function*() {
	for(let n = 1; n < Infinity; n ++) {
		yield [n, n * (3 * n - 1) / 2];
	}
};
const isPentagonal = function(num: number) {
	return (1 + Math.sqrt(1 + 24 * num)) % 6 === 0;
};

const solve = () => {
	for(const [differenceIndex, difference] of pentagonals()) {
		innerLoop: for(const [lowerIndex, lowerPentagonal] of pentagonals()) {
			const nextPentagonal = (lowerIndex + 1) * (3 * (lowerIndex + 1) - 1) / 2;
			const upperPentagonal = lowerPentagonal + difference;
			if(isPentagonal(upperPentagonal) && isPentagonal(lowerPentagonal + upperPentagonal)) {
				return difference;
			}
			if(nextPentagonal > upperPentagonal) { break innerLoop; }
		}
	}
	throw new Error("Unexpected: reached end of infinite loop.");
};


describe("isPentagonal()", () => {
	it("works for the first 15 numbers", () => {
		const results = [
			[1, true],
			[2, false],
			[3, false],
			[4, false],
			[5, true],
			[6, false],
			[7, false],
			[8, false],
			[9, false],
			[10, false],
			[11, false],
			[12, true],
			[13, false],
			[14, false],
			[15, false],
		] as [number, boolean][];
		for(const [num, expected] of results) {
			assert.equal(isPentagonal(num), expected);
		}
	});
});
