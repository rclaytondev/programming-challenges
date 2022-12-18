const prng = new Sequence(function*() {
	let value = 290797;
	while(true) {
		yield value;
		value = (value ** 2) % 50515093;
	}
});
const pointsGenerator = new Sequence(function*() {
	for(let i = 0; i < Infinity; i ++) {
		yield new Vector(prng.nthTerm(2 * i), prng.nthTerm(2 * i + 1));
	}
});

const solveSquared = (upperBound = 2000000) => {
	const points = pointsGenerator.slice(0, upperBound);
	return minDistSquared(points);
};
const baseCase = (points) => {
	let smallestDistanceSq = Infinity;
	for(const [i, point1] of points.entries()) {
		for(const point2 of points.slice(i + 1)) {
			const distanceSq = (point1.x - point2.x) ** 2 + (point1.y - point2.y) ** 2;
			if(distanceSq < smallestDistanceSq) {
				smallestDistanceSq = distanceSq;
			}
		}
	}
	return smallestDistanceSq;
};
const minDistSquared = (points, sortAxis = "x") => {
	const BASE_CASE_NUM_POINTS = 10;
	if(points.length <= BASE_CASE_NUM_POINTS) {
		// console.log(`calling the base case`);
		return baseCase(points);
	}
	const sorted = points.sort((a, b) => a[sortAxis] - b[sortAxis]);
	const half1 = points.slice(0, Math.floor(points.length / 2));
	const half2 = points.slice(Math.floor(points.length / 2), points.length);
	const minDistSq1 = minDistSquared(half1, sortAxis === "x" ? "y" : "x");
	const minDistSq2 = minDistSquared(half2, sortAxis === "x" ? "y" : "x");
	const minDistSq = Math.min(minDistSq1, minDistSq2);
	const middle = points[Math.floor(points.length / 2)][sortAxis];
	const middlePoints = sorted.filter((point) => point[sortAxis] >= middle - Math.sqrt(minDistSq) && point[sortAxis] <= middle + Math.sqrt(minDistSq));
	const middleMinDistSq = minDistSquared(middlePoints, sortAxis === "x" ? "y" : "x");
	return Math.min(minDistSq1, minDistSq2, middleMinDistSq);
};
testing.addUnit(solveSquared, [
	[14, 298603741129]
])
