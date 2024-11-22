import { describe } from "mocha";
import { Group } from "../../Group.mjs";
import { assert } from "chai";
import { Coset } from "../../Coset.mjs";

describe("Group.quotient", () => {
	it("can correctly construct the quotient group", () => {
		const integers = new Group(
			(a, b) => a + b,
			0,
			a => -a,
			n => n % 1 === 0
		);
		const evenIntegers = new Group(
			(a, b) => a + b,
			0,
			a => -a,
			n => n % 2 === 0
		);
		const quotient = integers.quotient(evenIntegers);
		assert.isTrue(quotient.areEqual(
			quotient.operate(new Coset(1, evenIntegers), new Coset(1, evenIntegers)),
			new Coset(0, evenIntegers)
		));
		assert.isFalse(quotient.areEqual(
			quotient.operate(new Coset(1, evenIntegers), new Coset(1, evenIntegers)),
			new Coset(1, evenIntegers)
		));
		assert.isTrue(quotient.includes(new Coset(5, evenIntegers)));
		assert.isFalse(quotient.includes(new Coset(5, integers)));
		assert.isFalse(quotient.includes(new Coset(1.2, evenIntegers)));
	});
});
