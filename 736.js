const functionR = (x, y) => [x + 1, 2 * y];
const functionS = (x, y) => [2 * x, y + 1];

class Pair {
	constructor(values) {
		this.values = values;
	}

	children() {
		const [x, y] = this.values;
		const children = [
			new Pair(functionR(x, y)),
			new Pair(functionS(x, y))
		];
		return children;
	}

	isSolved() {
		const [x, y] = this.values;
		return x === y;
	}

	equals(pair) {
		return this.values.sort().equals(pair.values.sort());
	}
	clone() {
		return new Pair(
			[...this.values]
		);
	}

	toString() {
		const sorted = this.values.sort();
		return `(${sorted[0]}, ${sorted[1]})`;
	}
};

testing.addUnit("Pair.equals()", {
	"test case 1": () => {
		const p1 = new Pair([1, 2]);
		const p2 = new Pair([1, 2]);
		expect(p1).toEqual(p2);
	},
	"test case 2": () => {
		const p1 = new Pair([1, 2]);
		const p2 = new Pair([2, 1]);
		expect(p1).toEqual(p2);
	},
	"test case 3": () => {
		const p1 = new Pair([1, 3]);
		const p2 = new Pair([1, 2]);
		expect(p1).toNotEqual(p2);
	}
});

const arrayIsUnique = (array) => {
	const strings = array.map(pair => pair.toString());
	const set = new Set(strings);
	return [...set].length === strings.length;
};
testing.addUnit("arrayIsUnique()", {
	"test case 1": () => {
		const array = [
			new Pair([1, 2]),
			new Pair([1, 2])
		];
		expect(arrayIsUnique(array)).toBeFalse();
	},
	"test case 2": () => {
		const array = [
			new Pair([1, 2]),
			new Pair([2, 1])
		];
		expect(arrayIsUnique(array)).toBeFalse();
	},
	"test case 3": () => {
		const array = [
			new Pair([1, 2]),
			new Pair([1, 3])
		];
		expect(arrayIsUnique(array)).toBeTrue();
	}
});

const solve = (initialValue) => {
	/* returns the final value of the shortest sequence with odd length. */
	let lastGeneration = [new Pair(initialValue)], nextGeneration = [];
	let timeout = 0;
	let numGenerations = 0;
	while(true) {
		timeout ++;
		// debugger;
		if(timeout > 25) { return; }
		console.log(lastGeneration.length);

		for(let i = 0; i < lastGeneration.length; i ++) {
			const pair = lastGeneration[i];
			const children = pair.children();
			const solvedChild = children.find(c => c.isSolved());
			if(solvedChild && numGenerations % 2 === 1) {
				console.log(solvedChild.values[0]);
				return solvedChild.values[0];
			}
			// const uniqueChildren = children.filter(child => !nextGeneration.some(pair => pair.equals(child)));
			const uniqueChildren = children;
			// console.log(`number of unique children: ${uniqueChildren.length}`);
			nextGeneration.push(...uniqueChildren);
			// console.log(`after adding children: ${nextGeneration.length}`);
		}
		lastGeneration = nextGeneration.clone();
		nextGeneration = [];

		// if(!arrayIsUnique(nextGeneration)) {
		// 	console.log(`not unique!`);
		// }
		// else {
		// 	console.log(`is unique!`);
		// }


		numGenerations ++;
	}
};
// console.log(solve([45, 90]));
// console.log(solve([]));


const solve2 = (initialValue) => {
	/*
	This is just a testing function; I want to see if there is a way to change the difference between them by 1.
	*/
	let lastGeneration = [new Pair(initialValue)], nextGeneration = [];
	let timeout = 0;
	let numGenerations = 0;
};

const testSpeed = () => {
	const start = Date.now();
	solve([45, 90]);
	const end = Date.now();
	console.log(`${end - start} milliseconds`);
};
testSpeed();

testing.testAll();
