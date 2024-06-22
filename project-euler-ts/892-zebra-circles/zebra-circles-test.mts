import { assert } from "chai";
import { describe } from "mocha";
import { ArcEdge, LineEdge, Region, allCuttings } from "./zebra-circles.mjs";

describe("allCuttings", () => {
	it("returns the correct number of cuttings for 2 points", () => {
		const cuttings = [...allCuttings(2)];
		assert.lengthOf(cuttings, 1);
	});
	it("returns the correct number of cuttings for 4 points", () => {
		const cuttings = [...allCuttings(4)];
		assert.lengthOf(cuttings, 2);
	});
	it("returns the correct number of cuttings for 6 points", () => {
		const cuttings = [...allCuttings(6)];
		assert.lengthOf(cuttings, 5);
	});
});
describe("Region.cut", () => {
	it("cuts the region along the given line segment, returning the resulting two smaller regions", () => {
		const region = new Region([
			new LineEdge(1, 5),
			new ArcEdge(5, 8),
			new LineEdge(8, 12),
			new ArcEdge(12, 1),
		]);
		const subregions = region.cut(new LineEdge(6, 15));
		const subregion1 = subregions.find(s => s.edges.some(e => e.hasVertex(8)));
		const subregion2 = subregions.find(s => s !== subregion1);
		assert.deepEqual(subregion1, new Region([
			new ArcEdge(6, 8),
			new LineEdge(8, 12),
			new ArcEdge(12, 15),
			new LineEdge(15, 6)
		]));
		assert.deepEqual(subregion2, new Region([
			new ArcEdge(15, 1),
			new LineEdge(1, 5),
			new ArcEdge(5, 6),
			new LineEdge(6, 15)
		]));
	});
});
describe("coloringDifferenceSum", () => {
	// it("returns the correct answer for the input of 100 from Project Euler", () => {
	// 	const sum = coloringDifferenceSum(100);
	// 	assert.equal(sum % MODULO, 1172122931);
	// });
});
