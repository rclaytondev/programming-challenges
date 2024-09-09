import { describe, it } from "mocha";
import { VectorSet } from "./VectorSet.mjs";
import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { assert } from "chai";
import { Table } from "../../utils-ts/modules/Table.mjs";

describe("VectorSet", () => {
	it("can add and delete vectors and query whether a vector is in the set", () => {
		const set = new VectorSet();
		assert.isFalse(set.has(new Vector(1, 2)));
		set.add(new Vector(1, 2));
		assert.isTrue(set.has(new Vector(1, 2)));

		assert.isFalse(set.has(new Vector(1, 3)));
		set.add(new Vector(1, 3));
		assert.isTrue(set.has(new Vector(1, 3)));
		
		assert.isTrue(set.has(new Vector(1, 2)));
		set.delete(new Vector(1, 2));
		assert.isFalse(set.has(new Vector(1, 2)));

		set.delete(new Vector(1, 2));
		set.delete(new Vector(1, 2));
		set.delete(new Vector(1, 2));
		assert.isFalse(set.has(new Vector(1, 2)));
	});
	it("can iterate over the vectors in the set", () => {
		const set = new VectorSet();
		set.add(new Vector(1, 2));
		set.add(new Vector(1, 3));
		set.add(new Vector(2, 2));
		assert.sameDeepMembers([...set], [new Vector(1, 2), new Vector(1, 3), new Vector(2, 2)]);
	});
});

describe("VectorSet.slice", () => {
	it("can efficiently find all the vectors that are within a given rectangle (including all 4 edges)", () => {
		const input = new Table([
			[..."   n    "],
			[..."  yy  y "],
			[..." ny   yn"],
			[..."        "],
			[..."  yy  y "],
			[..."  n     "]
		]);
		const vectorSet = VectorSet.fromIterable([...input.positionsOf("y"), ...input.positionsOf("n")]);
		const expected = VectorSet.fromIterable([...input.positionsOf("y")]);
		const actual = vectorSet.slice(2, 6, 1, 4);
		assert.sameDeepMembers([...actual], [...expected]);
	});
});
