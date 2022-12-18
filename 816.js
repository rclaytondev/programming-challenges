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
testing.addUnit("solveSquared()", solveSquared, [
	[14, 298603741129]
])
