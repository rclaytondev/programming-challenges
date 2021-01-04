const functionR = (x, y) => [x + 1, 2 * y];
const functionS = (x, y) => [2 * x, y + 1];

class Pair {
	constructor(values, parent, length) {
		this.values = values;
		this.parent = parent;
		this.length = length;
	}

	children() {
		const [x, y] = this.values;
		const children = [
			new Pair(functionR(x, y), this, this.length + 1),
			new Pair(functionS(x, y), this, this.length + 1)
		];
		return children;
	}

	isSolved() {
		const [x, y] = this.values;
		return x === y;
	}
};

const solve = (initialValue) => {
	/* returns the final value of the shortest sequence with odd length. */
	let lastGeneration = [new Pair(initialValue, null, 1)], nextGeneration = [];
	let timeout = 0;
	while(true) {
		for(let i = 0; i < lastGeneration.length; i ++) {
			const pair = lastGeneration[i];
			const children = pair.children();
			const solvedChild = children.find(c => c.isSolved());
			if(solvedChild && solvedChild.length % 2 === 1) {
				return solvedChild.values[0];
			}
			nextGeneration.push(...children);
		}
		lastGeneration = nextGeneration;

		timeout ++;
		if(timeout > 0) { debugger; }
	}
};
console.log(solve([45, 90]));
