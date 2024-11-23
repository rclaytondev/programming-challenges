import { describe } from "mocha";
import { Group } from "../Group.mjs";
import { assert } from "chai";
import { Coset } from "../Coset.mjs";
import { Collection } from "../Collection.mjs";

describe("Group.quotient", () => {
	it("can correctly construct the quotient group", () => {
		const integers = new Group<number>(
			(a, b) => a + b,
			0,
			a => -a,
			new Collection(n => n % 1 === 0)
		);
		const evenIntegers = new Group<number>(
			(a, b) => a + b,
			0,
			a => -a,
			new Collection(n => n % 2 === 0)
		);
		const quotient = integers.quotient(evenIntegers);
		assert.isTrue(quotient.elements.areEqual(
			quotient.operate(new Coset(1, evenIntegers), new Coset(1, evenIntegers)),
			new Coset(0, evenIntegers)
		));
		assert.isFalse(quotient.elements.areEqual(
			quotient.operate(new Coset(1, evenIntegers), new Coset(1, evenIntegers)),
			new Coset(1, evenIntegers)
		));
		assert.isTrue(quotient.elements.includes(new Coset(5, evenIntegers)));
		assert.isFalse(quotient.elements.includes(new Coset(5, integers)));
		assert.isFalse(quotient.elements.includes(new Coset(1.2, evenIntegers)));
	});
});
