import { assert } from "chai";
import { sqrtContinuedFractionPeriod } from "./odd-period-square-roots.mjs";

describe("sqrtContinuedFractionPeriod", () => {
	const cases: [number, number][] = [
		[2, 1],
		[3, 2],
		[5, 1],
		[6, 2],
		[7, 4],
		[8, 2],
		[10, 1],
		[11, 2],
		[12, 2],
		[13, 5],
	];
	for(const [input, expected] of cases) {
		it(`outputs ${expected} for an input of ${input}`, () => {
			const result = sqrtContinuedFractionPeriod(input);
			assert.equal(result, expected);
		});
	}
});
