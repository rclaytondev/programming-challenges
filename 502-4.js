const numCastles = (width, height, modulo = Infinity) => {
	width = BigInt(width);
	height = BigInt(height);
	if(modulo !== Infinity) { modulo = BigInt(modulo); }
	height --; // accounts for required full-width block on the bottom row
	let result = 0n;
	const cachedResults = new Map();
	cachedResults.set("0,0,right,even,false", 1n);
	for(let y = 0n; y <= height; y ++) {
		const stack = [{
			node: {
				x: width, y: y,
				parity: "odd",
				hasReachedTop: true,
				previousMove: "right"
			},
			predecessors: [],
			predecessorsCalculated: 0,
			sum: 0n
		}];
		do {
			const lastItem = stack[stack.length - 1];
			if(!lastItem.predecessors?.length) {
				lastItem.predecessors = getPredecessors(
					width, height,
					lastItem.node.x, lastItem.node.y,
					lastItem.node.previousMove, lastItem.node.parity, lastItem.node.hasReachedTop
				);
			}
			const nextPredecessor = lastItem.predecessors[lastItem.predecessorsCalculated];
			if(lastItem.predecessorsCalculated >= lastItem.predecessors.length) {
				cachedResults.set(`${lastItem.node.x},${lastItem.node.y},${lastItem.node.previousMove},${lastItem.node.parity},${lastItem.node.hasReachedTop}`, lastItem.sum)
				stack.pop();
				stack[stack.length - 1].sum += lastItem.sum;
				if(modulo !== Infinity) {
					stack[stack.length - 1].sum %= modulo;
				}
				stack[stack.length - 1].predecessorsCalculated ++;
				continue;
			}
			const stringified = `${nextPredecessor.x},${nextPredecessor.y},${nextPredecessor.previousMove},${nextPredecessor.parity},${nextPredecessor.hasReachedTop}`;
			if(cachedResults.has(stringified)) {
				const cachedResult = cachedResults.get(stringified);
				lastItem.sum += cachedResult;
				if(modulo !== Infinity) {
					lastItem.sum %= modulo;
				}
				lastItem.predecessorsCalculated ++;
			}
			else {
				const newStackItem = {
					node: nextPredecessor,
					predecessors: [],
					predecessorsCalculated: 0,
					sum: 0n
				};
				stack.push(newStackItem);
			}
		} while(stack[0].predecessorsCalculated < stack[0].predecessors.length);
		result += stack[0].sum;
		if(modulo !== Infinity) {
			result %= modulo;
		}
	}
	return result;
};
const getPredecessors = (rectWidth, rectHeight, x, y, previousMove, parity, hasReachedTop) => {
	let predecessors = [];
	if(previousMove === "right") {
		predecessors = [
			{ x: x - 1n, y, previousMove: "up", parity, hasReachedTop },
			{ x: x - 1n, y, previousMove: "right", parity, hasReachedTop },
			{ x: x - 1n, y, previousMove: "down", parity, hasReachedTop }
		];
	}
	else if(previousMove === "up") {
		const oppositeParity = (parity === "even") ? "odd" : "even";
		predecessors = [
			{ x, y: y - 1n, previousMove: "right", parity: oppositeParity, hasReachedTop },
			{ x, y: y - 1n, previousMove: "up", parity: oppositeParity, hasReachedTop },
		];
		if(y === rectHeight && hasReachedTop) {
			predecessors.push(
				{ x, y: y - 1n, previousMove: "right", parity: oppositeParity, hasReachedTop: false },
				{ x, y: y - 1n, previousMove: "up", parity: oppositeParity, hasReachedTop: false },
			);
		}
	}
	else if(previousMove === "down") {
		predecessors = [
			{ x, y: y + 1n, previousMove: "right", parity, hasReachedTop },
			{ x, y: y + 1n, previousMove: "down", parity, hasReachedTop }
		];
	}
	predecessors = predecessors.filter(p => !(
		(p.x < 0n || p.y < 0n || p.x > rectWidth || p.y > rectHeight) ||
		(p.y === rectHeight && !p.hasReachedTop) ||
		(p.x === 0n && p.previousMove === "right" && p.y !== 0n) ||
		(p.y === 0n && p.previousMove === "up") ||
		(p.y === rectHeight && p.previousMove === "down")
	));
	return predecessors;
};
const numPaths = ((rectWidth, rectHeight, x, y, previousMove, parity, hasReachedTop, modulo = Infinity) => {
	if(
		(x < 0n || y < 0n || x > rectWidth || y > rectHeight) ||
		(y === rectHeight && !hasReachedTop) ||
		(x === 0n && previousMove === "right" && y !== 0n) ||
		(y === 0n && previousMove === "up") ||
		(y === rectHeight && previousMove === "down")
	) { return 0n; }
	if(x === 0n && y === 0n) {
		return (previousMove === "right" && parity === "even" && !hasReachedTop) ? 1n : 0n;
	}
	const predecessors = getPredecessors(rectWidth, rectHeight, x, y, previousMove, parity, hasReachedTop);
	let result = 0n;
	for(const predecessor of predecessors) {
		result += numPaths(rectWidth, rectHeight, predecessor.x, predecessor.y, predecessor.previousMove, predecessor.parity, predecessor.hasReachedTop, modulo);
		if(modulo !== Infinity) { result %= modulo;	}
	}
	return result;
}).memoize(true);

testing.addUnit("getPredecessors()", {

});
testing.addUnit("numPaths()", {
	"returns the correct result for 100x100 / (0, 0) / right / even / false": () => {
		const result = numPaths(100n, 100n, 0n, 0n, "right", "even", false);
		expect(result).toEqual(1n);
	},
	"returns the correct result for 100x100 / (0, 1) / up / odd / false": () => {
		const result = numPaths(100n, 100n, 0n, 1n, "up", "odd", false);
		expect(result).toEqual(1n);
	},
	"returns the correct result for 100x100 / (0, 1) / up / even / false": () => {
		const result = numPaths(100n, 100n, 0n, 1n, "up", "even", false);
		expect(result).toEqual(0n);
	},
	"returns the correct result for 2x2 / (1, 0) / down / odd / true": () => {
		const result = numPaths(2n, 2n, 1n, 0n, "down", "odd", true);
		expect(result).toEqual(0n);
	},
	"returns the correct result for 2x2 / (2, 0) / right / odd / true": () => {
		const result = numPaths(2n, 2n, 2n, 0n, "right", "odd", true);
		expect(result).toEqual(0n);
	},
	"returns the correct result for 3x2 / (2, 1) / right / even / false": () => {
		const result = numPaths(3n, 2n, 2n, 1n, "right", "even", false);
		expect(result).toEqual(0n);
	},
	"returns the correct result for 3x2 / (2, 2) / up / odd / true": () => {
		const result = numPaths(3n, 2n, 2n, 2n, "up", "odd", true);
		expect(result).toEqual(2n);
	},
	"returns the correct result for 3x2 / (3, 2) / right / odd / true": () => {
		const result = numPaths(3n, 2n, 3n, 2n, "right", "odd", true);
		expect(result).toEqual(2n);
	}
});
testing.addUnit("numCastles()", {
	/* test cases from Project Euler */
	"returns the correct result for a 4x2 rectangle": () => {
		expect(numCastles(4, 2)).toEqual(10n);
	},
	"returns the correct result for a 13x10 rectangle": () => {
		expect(numCastles(13, 10)).toEqual(3729050610636n);
	},
	"returns the correct result for a 10x13 rectangle": () => {
		expect(numCastles(10, 13)).toEqual(37959702514n);
	},
	"returns the correct result for a 100x100 rectangle": () => {
		expect(numCastles(100, 100, 1000000007)).toEqual(841913936n);
	},
	/* other test cases */
	"returns the correct result for a 2x2 rectangle": () => {
		const result = numCastles(2n, 2n);
		expect(result).toEqual(3n);
	},
	"returns the correct result for a 2x3 rectangle": () => {
		const result = numCastles(2n, 3n);
		expect(result).toEqual(0n);
	},
	"returns the correct result for a 2x4 rectangle": () => {
		const result = numCastles(2n, 4n);
		expect(result).toEqual(7n);
	},
	"returns the correct result for a 3x3 rectangle": () => {
		const result = numCastles(3, 3);
		expect(result).toEqual(3);
	},
	"returns the correct result for a 5x2 rectangle": () => {
		const result = numCastles(5, 2);
		expect(result).toEqual(16);
	},
	"returns the correct result for a 4x3 rectangle": () => {
		const result = numCastles(4, 3);
		expect(result).toEqual(21);
	},
	"returns the correct result for a 5x3 rectangle": () => {
		const result = numCastles(5, 3);
		expect(result).toEqual(89);
	},
	"returns the correct result for a 4x4 rectangle": () => {
		const result = numCastles(4, 4);
		expect(result).toEqual(117);
	},
	"returns the correct result for a 7x4 rectangle": () => {
		const result = numCastles(7n, 4n);
		expect(result).toEqual(7063n);
	},
});
testing.testUnit("numPaths()");

const solve = () => {
	const MODULO = 1000000007;
	let result = 0n;
	result += numCastles(1e12, 100, MODULO);
	console.log(`finished input 1`);
	result += numCastles(10000, 10000, MODULO);
	console.log(`finished input 2`);
	result += numCastles(100, 1e12, MODULO);
	console.log(`finished input 3`);
	result %= MODULO;
	console.log(`the answer is ${result}`);
	return result;
};
