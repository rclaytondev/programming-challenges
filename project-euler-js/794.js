class PartialSolution {
	constructor(numPoints = 17, finalPositions = [], intervals = []) {
		this.numPoints = numPoints;
		this.finalPositions = finalPositions;
		this.intervals = intervals;
	}


	children() {
		let children = [];
		const updateInterval = (finalPosition, newPosition, interval = new RationalRange(new Rational(0, 1), new Rational(1, 1))) => {
			const numBelow = [...this.finalPositions, newPosition].count(n => n < finalPosition);
			const newInterval = new RationalRange(
				new Rational(numBelow, this.finalPositions.length + 1),
				new Rational(numBelow + 1, this.finalPositions.length + 1)
			);
			return interval.intersects(newInterval) ? interval.intersection(newInterval) : null;
		};
		for(let newPoint = 1; newPoint <= this.numPoints; newPoint ++) {
			if(!this.finalPositions.includes(newPoint)) {
				const newChild = new PartialSolution(
					this.numPoints,
					[...this.finalPositions, newPoint],
					[
						...this.intervals.map((interval, index) => updateInterval(this.finalPositions[index], newPoint, interval)),
						updateInterval(
							newPoint, newPoint,
							new RationalRange(
								new Rational(newPoint - 1, this.numPoints),
								new Rational(newPoint, this.numPoints)
							)
						)
					]
				);
				if(newChild.intervals.every(i => i !== null)) {
					children.push(newChild);
				}
			}
		}
		return children;
	}
}

const solve = (numPoints = 17) => {
	let minimum = null;
	for(const solution of Tree.iterate(new PartialSolution(numPoints), s => s.children())) {
		if(solution.finalPositions.length === numPoints) {
			const sum = solution.intervals.map(i => i.min).reduce((a, c) => a.add(c));
			if(minimum == null || sum.compareTo(minimum) < 0) {
				minimum = sum;
			}
		}
	}
	return minimum.simplify();
};
testing.addUnit("solve()", solve, [
	[1, new Rational(0, 1)], // 1 point --> pick 0 and you're done
	[2, new Rational(1, 2)], // 2 points --> pick 0 and then 1/2
	[3, new Rational(1, 1)], // 3 points --> pick 0, then 2/3, then 1/3
	[4, new Rational(3, 2)], // this test case comes from Project Euler
	[5, new Rational(2, 1)],
	[6, new Rational(5, 2)],
	[7, new Rational(3, 1)],
	[8, new Rational(7, 2)]
]);
testing.addUnit("PartialSolution.children()", {
	"returns the correct first step for 2 points": () => {
		const solution = new PartialSolution(2, []);
		const children = solution.children();
		expect(children).toEqual([
			new PartialSolution(2, [1], [new RationalRange(new Rational(0, 1), new Rational(1, 2))]),
			new PartialSolution(2, [2], [new RationalRange(new Rational(1, 2), new Rational(1, 1))])
		]);
	},
	"returns the correct second step for 2 points": () => {
		const solution = new PartialSolution(
			2,
			[1],
			[new RationalRange(new Rational(0, 1), new Rational(1, 1))]
		);
		const children = solution.children();
		expect(children).toEqual([
			new PartialSolution(
				2,
				[1, 2],
				[
					new RationalRange(new Rational(0, 1), new Rational(1, 2)),
					new RationalRange(new Rational(1, 2), new Rational(1, 1))
				]
			)
		]);
	}
});
