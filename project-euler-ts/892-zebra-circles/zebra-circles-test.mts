import { assert } from "chai";
import { describe } from "mocha";
import { ArcEdge, LineEdge, PartialCutting, Region, allCuttings, cuttingsWithColoringDifference } from "./zebra-circles.mjs";

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
	return;
	it("returns one of the correct cuttings for 4 points", () => {
		const cuttings = [...allCuttings(4)];
		const actual = cuttings.find(c => c.edges.some(e => e.vertex1 === 1 && e.vertex2 === 2));
		assert.deepEqual(actual?.numPoints, 4);
		assert.deepEqual(actual!.edges, [new LineEdge(1, 2), new LineEdge(3, 4)]);
		assert.sameDeepMembers(actual!.regions, [
			new Region([
				new ArcEdge(1, 2),
				new LineEdge(2, 1)
			]),
			new Region([
				new LineEdge(1, 2),
				new ArcEdge(2, 3),
				new LineEdge(3, 4),
				new ArcEdge(4, 1),
			]),
			new Region([
				new ArcEdge(3, 4),
				new LineEdge(4, 3)
			])
		]);
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
describe("PartialCutting.connect", () => {
	return;
	it("correctly returns the cutting obtained by connecting the two given vertices", () => {
		const cutting = new PartialCutting(
			4,
			[new LineEdge(1, 2)],
			[
				new Region([
					new ArcEdge(1, 2),
					new LineEdge(2, 1)
				]),
				new Region([
					new LineEdge(1, 2),
					new ArcEdge(2, 1)
				])
			]
		);
		const result = cutting.connect(3, 4, cutting.regions[1]);
		const expected = new PartialCutting(
			4,
			[new LineEdge(1, 2), new LineEdge(3, 4)],
			[
				new Region([
					new ArcEdge(1, 2),
					new LineEdge(2, 1)
				]),
				new Region([
					new LineEdge(1, 2),
					new ArcEdge(2, 3),
					new LineEdge(3, 4),
					new ArcEdge(4, 1),
				]),
				new Region([
					new ArcEdge(3, 4),
					new LineEdge(4, 3)
				])
			]
		);
		assert.equal(result.numPoints, 4);
		assert.deepEqual(result.edges, [new LineEdge(1, 2), new LineEdge(3, 4)]);
		assert.sameDeepMembers(result.regions, [
			new Region([
				new ArcEdge(1, 2),
				new LineEdge(2, 1)
			]),
			new Region([
				new LineEdge(1, 2),
				new ArcEdge(2, 3),
				new LineEdge(3, 4),
				new ArcEdge(4, 1),
			]),
			new Region([
				new ArcEdge(3, 4),
				new LineEdge(4, 3)
			])
		]);
	});
});
// describe("PartialCutting.equals", () => {
// 	const createCutting = () => new PartialCutting(
// 		4,
// 		[new LineEdge(1, 2), new LineEdge(3, 4)],
// 		[
// 			new Region([
// 				new ArcEdge(1, 2),
// 				new LineEdge(2, 1)
// 			]),
// 			new Region([
// 				new LineEdge(1, 2),
// 				new ArcEdge(2, 3),
// 				new LineEdge(3, 4),
// 				new ArcEdge(4, 1),
// 			]),
// 			new Region([
// 				new LineEdge(4, 3),
// 				new ArcEdge(3, 4)
// 			])
// 		]
// 	);
// 	it("returns true when the cutting is deeply equal, but not a reference", () => {
// 		const cutting1 = createCutting();
// 		const cutting2 = createCutting();
// 		assert.isTrue(cutting1.equals(cutting2));
// 	});
// 	it("returns true when the cutting is the same, but has edges in a different order", () => {
// 		const cutting1 = createCutting();
// 		const cutting2 = createCutting();
// 		cutting2.edges = [cutting2.edges[1], cutting2.edges[0]];
// 		assert.isTrue(cutting1.equals(cutting2));
// 	});
// 	it("returns true when the cutting is the same, but some line edges have vertices listed in a different order", () => {
// 		const cutting1 = createCutting();
// 		const cutting2 = createCutting();
// 		const edge = cutting2.edges[0];
// 		[edge.vertex1, edge.vertex2] = [edge.vertex2, edge.vertex1];
// 		assert.isTrue(cutting1.equals(cutting2));
// 	});
// 	it("returns true when the cutting is the same, but has regions in a different order", () => {
// 		const cutting1 = createCutting();
// 		const cutting2 = createCutting();
// 		cutting2.regions = [cutting2.regions[1], cutting2.regions[0], cutting2.regions[2]];
// 		assert.isTrue(cutting1.equals(cutting2));
// 	});
// 	it("returns true when the cutting is the same, but some of the region's edges have been cyclically permuted", () => {
// 		const cutting1 = createCutting();
// 		const cutting2 = createCutting();
// 		const region = cutting2.regions[1];
// 		region.edges = [region.edges[2], region.edges[3], region.edges[0], region.edges[1]];
// 		assert.isTrue(cutting1.equals(cutting2));
// 	});
// 	it("returns false when the cuttings are completely different", () => {
// 		const cutting1 = createCutting();
// 		const cutting2 = new PartialCutting(
// 			4,
// 			[new LineEdge(1, 4), new LineEdge(2, 3)],
// 			[
// 				new Region([
// 					new ArcEdge(1, 2),
// 					new LineEdge(2, 3),
// 					new ArcEdge(3, 4),
// 					new LineEdge(4, 1)
// 				]),
// 			]
// 		)
// 	});
// });
describe("coloringDifferenceSum", () => {
	// it("returns the correct answer for the input of 100 from Project Euler", () => {
	// 	const sum = coloringDifferenceSum(100);
	// 	assert.equal(sum % MODULO, 1172122931);
	// });
});
describe("cuttingsWithColoringDifference", () => {
	const testCases: [number, number, number][] = [
		[1, 0, 1],
		[2, 1, 2],
		[3, 0, 3],
		[3, 2, 2],
		[4, 1, 12],
		[4, 3, 2],
		[5, 0, 15],
		[5, 2, 10],
		[5, 4, 2]
	];
	for(const [n, difference, expected] of testCases) {
		it(`correctly calculates the number of cuttings with ${2 * n} points and a coloring difference of ${difference}`, () => {
			const actual = cuttingsWithColoringDifference(2 * n, difference);
			assert.equal(actual, expected);
		});
	}
});
