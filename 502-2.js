/*
See https://projecteuler.net/problem=502 for the definition of a castle.
I define the 'foundation' of a castle to be the block that occupies the entirety of the lowest row.
I define a 'centralized' castle to be a castle that contains a block on the row above the foundation that occupies the gridsquare in the middle (or the 2 gridsquares in the middle, for even-width rectangles).
I define a 'decentralized' castle to be one that is not centralized.
*/

const divideCeil = (a, b) => (a / b) + ((a % b === 0n) ? 0n : 1n);
const EVEN_PARITY_COMBINATIONS_2 = [
	["odd", "even"],
	["even", "odd"]
];
const ODD_PARITY_COMBINATIONS_2 = [
	["even", "even"],
	["odd", "odd"]
];
const REACH_TOPS_2 = [
	[true, true],
	[true, false],
	[false, true]
];
const EVEN_PARITY_COMBINATIONS_3 = [
	["even", "even", "odd"],
	["even", "odd", "even"],
	["odd", "even", "even"],
	["odd", "odd", "odd"]
];
const ODD_PARITY_COMBINATIONS_3 = [
	["even", "even", "even"],
	["even", "odd", "odd"],
	["odd", "even", "odd"],
	["odd", "odd", "even"]
];
const REACH_TOPS_3 = new Set([true, false]).cartesianPower(3).filter(arr => arr.includes(true));
const USES_WIDTHS = [
	[false, false],
	[true, false],
	[false, true]
];

const LOG_WIDTH = 5n;
const LOG_HEIGHT = 3n;
const LOGGING_ENABLED = false;

const centralizedCastles = ((width, height, modulo = Infinity, parity = "even", usesFullHeight = true) => {
	if(width === LOG_WIDTH && height === LOG_HEIGHT && LOGGING_ENABLED) {
		console.log(`calculating the number ${width}x${height} ${parity}-parity ${usesFullHeight ? "full-height" : "non-full-height"} castles`);
	}
	let result = 0n;
	for(let leftBlock = 1n - (width % 2n); leftBlock <= width / 2n; leftBlock ++) {
		for(let rightBlock = 1n - (width % 2n); rightBlock <= width / 2n; rightBlock ++) {
			if(width === LOG_WIDTH && height === LOG_HEIGHT && LOGGING_ENABLED) {
				console.groupCollapsed(`left = ${leftBlock}, right = ${rightBlock} (${width / 2n - leftBlock - 1n}x${height} / ${leftBlock + rightBlock + (width % 2n)}x${height - 1n} / ${width / 2n - rightBlock - 1n}x${height})`);
			}
			let numIncreased = 0n;
			const parityCombinations = (parity === "even" ? EVEN_PARITY_COMBINATIONS_3 : ODD_PARITY_COMBINATIONS_3);
			for(const parities of parityCombinations) {
				if(width === LOG_WIDTH && height === LOG_HEIGHT && LOGGING_ENABLED) {
					console.log(parities);
				}
				const booleanArrays = usesFullHeight ? REACH_TOPS_3 : [ [false, false, false] ];
				for(const booleanArray of booleanArrays) {
					if(width === LOG_WIDTH && height === LOG_HEIGHT && LOGGING_ENABLED) {
						console.log(booleanArray);
					}
					let leftCastles = numCastles(
						width / 2n - leftBlock - 1n, height,
						modulo, parities[0], booleanArray[0]
					);
					let rightCastles = numCastles(
						width / 2n - rightBlock - 1n, height,
						modulo, parities[2], booleanArray[2]
					);
					if(leftCastles === 0n && parities[0] === "odd" && !booleanArray[0]) {
						leftCastles ++;
						if(width === LOG_WIDTH && height === LOG_HEIGHT && LOGGING_ENABLED) {
							console.log("incrementing leftCastles from 0 to 1");
						}
					}
					if(rightCastles === 0n && parities[2] === "odd" && !booleanArray[2]) {
						rightCastles ++;
						if(width === LOG_WIDTH && height === LOG_HEIGHT && LOGGING_ENABLED) {
							console.log("incrementing rightCastles from 0 to 1");
						}
					}
					const centerCastles = numCastles(
						leftBlock + rightBlock + (width % 2n), height - 1n,
						modulo, parities[1], booleanArray[1]
					);
					if(width === LOG_WIDTH && height === LOG_HEIGHT && LOGGING_ENABLED) {
						console.log(`${leftCastles} * ${centerCastles} * ${rightCastles} = ${leftCastles * rightCastles * centerCastles}`);
					}
					numIncreased += (leftCastles * rightCastles * centerCastles);
					result += (leftCastles * rightCastles * centerCastles);
				}
			}
			if(width === LOG_WIDTH && height === LOG_HEIGHT && LOGGING_ENABLED) {
				console.log(`total: added ${numIncreased} castles`);
				console.groupEnd();
			}
		}
	}
	return result;
}).memoize(true);
const oddWidthDecentralizedCastles = ((width, height, modulo = Infinity, parity = "even", usesFullHeight = true) => {
	if(width % 2n === 0n) {
		throw new Error(`The provided width must be odd.`);
	}
	let result = 0n;
	for(const parities of parity === "even" ? EVEN_PARITY_COMBINATIONS_2 : ODD_PARITY_COMBINATIONS_2) {
		for(const booleanArray of usesFullHeight ? REACH_TOPS_2 : [ [false, false] ]) {
			result += numCastles(
				width / 2n, height, modulo, parities[0], booleanArray[0]
			) * numCastles(
				width / 2n, height, modulo, parities[1], booleanArray[1]
			);
		}
	}
	return result;
}).memoize(true);
const evenWidthDecentralizedCastles = ((width, height, modulo = Infinity, parity = "even", usesFullHeight = true) => {
	if(width % 2n !== 0n) {
		throw new Error(`The provided width must be even.`);
	}
	let result = 0n;
	for(const parities of parity === "even" ? EVEN_PARITY_COMBINATIONS_2 : ODD_PARITY_COMBINATIONS_2) {
		for(const booleanArray of usesFullHeight ? REACH_TOPS_2 : [ [false, false] ]) {
			for(const usesWidths of USES_WIDTHS) {
				const [usesFullLeftSide, usesFullRightSide] = usesWidths;
				let leftCastles;
				if(usesFullLeftSide) {
					leftCastles = numCastles(width / 2n, height, modulo, parities[0], booleanArray[0]);
					leftCastles -= numCastles(width / 2n - 1n, height, modulo, parities[0], booleanArray[0]);
				}
				else {
					leftCastles = numCastles(width / 2n - 1n, height, modulo, parities[0], booleanArray[0]);
				}
				let rightCastles;
				if(usesFullRightSide) {
					rightCastles = numCastles(width / 2n, height, modulo, parities[1], booleanArray[1]);
					rightCastles -= numCastles(width / 2n - 1n, height, modulo, parities[1], booleanArray[1]);
				}
				else {
					rightCastles = numCastles(width / 2n - 1n, height, modulo, parities[1], booleanArray[1]);
				}
				result += leftCastles * rightCastles;
			}
		}
	}
	return result;
}).memoize(true);
const decentralizedCastles = ((width, height, modulo = Infinity, parity = "even", usesFullHeight = true) => {
	if(width === 2n) {
		if(usesFullHeight) {
			return (height % 2n === 0n) === (parity === "even") ? 2n : 0n;
		}
		else {
			if(parity === "even") { return divideCeil(height, 2n) * 2n - 2n; }
			else { return height === 1n ? 0n : (height / 2n) * 2n - 1n; }
		}
	}
	else {
		const args = [width, height, modulo, parity, usesFullHeight];
		if(width % 2n === 0n) {
			return evenWidthDecentralizedCastles(...args);
		}
		else {
			return oddWidthDecentralizedCastles(...args);
		}
	}
}).memoize(true);
const numCastles = ((width, height, modulo = Infinity, parity = "even", usesFullHeight = true) => {
	/* convert arguments to bigints */
	width = BigInt(width), height = BigInt(height);
	if(modulo !== Infinity) { modulo = BigInt(modulo); }
	/* handle base cases */
	if(width <= 0n || height <= 0n) { return 0n; }
	if(height === 1n) {
		return (parity === "odd" && usesFullHeight) ? 1n : 0n;
	}
	if(width === 1n) {
		if(usesFullHeight) { return (height % 2n === 0n) === (parity === "even") ? 1n : 0n; }
		else { return (parity === "even") ? divideCeil(height, 2n) - 1n : height / 2n; }
	}
	/* every castle is either centralized or it isn't */
	const arguments = [width, height, modulo, parity, usesFullHeight];
	return centralizedCastles(...arguments) + decentralizedCastles(...arguments);
}).memoize(true);

testing.addUnit("evenWidthDecentralizedCastles()", {
	"returns the correct result for a 4x2 rectangle": () => {
		const result = evenWidthDecentralizedCastles(4n, 2n);
		expect(result).toEqual(6n);
	},
	"returns the correct result for a 2x2 odd-parity non-full-height rectangle": () => {
		const result = evenWidthDecentralizedCastles(2n, 2n, Infinity, "odd", false);
		expect(result).toEqual(0n);
	},
	"returns the correct result for a 4x3 rectangle": () => {
		const result = evenWidthDecentralizedCastles(4n, 3n);
		expect(result).toEqual(14);
	}
});
testing.addUnit("oddWidthDecentralizedCastles()", {
	"returns the correct result for a 3x3 rectangle": () => {
		const result = oddWidthDecentralizedCastles(3n, 3n);
		expect(result).toEqual(2);
	},
	"returns the correct result for a 5x4 rectangle": () => {
		const result = oddWidthDecentralizedCastles(5n, 4n);
		expect(result).toEqual(84);
	},
	"returns the correct result for a 7x4 rectangle": () => {
		const result = oddWidthDecentralizedCastles(7n, 4n);
		expect(result).toEqual(1596n);
	},
	"returns the correct result for a 5x3 non-full-height rectangle": () => {
		const result = oddWidthDecentralizedCastles(5n, 3n, Infinity, "even", false);
		expect(result).toEqual(6n);
	},
	"throws an error when an even width is passed in": () => {
		expect(() => oddWidthDecentralizedCastles(4n, 2n)).toThrow();
	}
});
testing.addUnit("centralizedCastles()", {
	"returns the correct result for a 4x2 rectangle": () => {
		const result = centralizedCastles(4n, 2n);
		expect(result).toEqual(4n);
	},
	"returns the correct result for a 2x2 odd-parity non-full-height rectangle": () => {
		const result = centralizedCastles(2n, 2n, Infinity, "odd", false);
		expect(result).toEqual(0n);
	},
	"returns the correct result for a 4x3 rectangle": () => {
		const result = centralizedCastles(4n, 3n);
		expect(result).toEqual(7);
	},
	"returns the correct result for a 2x3 non-full-height rectangle": () => {
		const result = centralizedCastles(2n, 3n, Infinity, "even", false);
		expect(result).toEqual(1n);
	},
	"returns the correct result for a 5x3 non-full-height rectangle": () => {
		const result = centralizedCastles(5n, 3n, Infinity, "even", false);
		expect(result).toEqual(10n);
	},
	"returns the correct result for a 7x4 rectangle": () => {
		const result = centralizedCastles(7n, 4n);
		expect(result).toEqual(5467n);
	}
});
testing.addUnit("decentralizedCastles()", {
	"returns the correct result for a 4x2 rectangle": () => {
		const result = decentralizedCastles(4n, 2n);
		expect(result).toEqual(6n);
	},
	"returns the correct result for a 2x2 odd-parity non-full-height rectangle": () => {
		const result = decentralizedCastles(2n, 2n, Infinity, "odd", false);
		expect(result).toEqual(1n);
	},
	"returns the correct result for a 3x2 rectangle": () => {
		const result = decentralizedCastles(3n, 2n);
		expect(result).toEqual(2n);
	},
	"returns the correct result for a 4x3 rectangle": () => {
		const result = decentralizedCastles(4n, 3n);
		expect(result).toEqual(14n);
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
	"returns the correct result for a 10x2 non-full-height rectangle": () => {
		expect(numCastles(10, 2, Infinity, "even", false)).toEqual(0n);
	},
	"returns the correct result for a 2x2 non-full-height odd-parity rectangle": () => {
		const result = numCastles(2n, 2n, Infinity, "odd", false);
		expect(result).toEqual(1n);
	},
	"returns the correct result for a 5x2 rectangle": () => {
		const result = numCastles(5, 2);
		expect(result).toEqual(16);
	},
	"returns the correct result for a 3x3 rectangle": () => {
		const result = numCastles(3, 3);
		expect(result).toEqual(3);
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

	"returns the correct result for a 2x3 odd-parity rectangle": () => {
		const result = numCastles(2n, 3n, Infinity, "odd", true);
		expect(result).toEqual(5n);
	},
	"returns the correct result for a 2x3 rectangle": () => {
		const result = numCastles(2n, 3n);
		expect(result).toEqual(0n);
	},
	"returns the correct result for a 2x3 non-full-height rectangle": () => {
		const result = numCastles(2n, 3n, Infinity, "even", false);
		expect(result).toEqual(3n);
	},
	"returns the correct result for a 2x3 odd-parity non-full-height rectangle": () => {
		const result = numCastles(2n, 3n, Infinity, "odd", false);
		expect(result).toEqual(1n);
	},
	"returns the correct result for a 2x2 rectangle": () => {
		const result = numCastles(2n, 2n);
		expect(result).toEqual(3n);
	},
	"returns the correct result for a 2x2 non-full-height rectangle": () => {
		const result = numCastles(2n, 2n, Infinity, "even", false);
		expect(result).toEqual(0n);
	},
	"returns the correct result for a 2x2 odd-parity rectangle": () => {
		const result = numCastles(2n, 2n, Infinity, "odd", true);
		expect(result).toEqual(0n);
	},

	"returns the correct result for a 2x4 rectangle": () => {
		const result = numCastles(2n, 4n);
		expect(result).toEqual(7n);
	},
	"returns the correct result for a 5x3 non-full-height rectangle": () => {
		const result = numCastles(5n, 3n, Infinity, "even", false);
		expect(result).toEqual(16n);
	},
	"returns the correct result for a 7x4 rectangle": () => {
		const result = numCastles(7n, 4n);
		expect(result).toEqual(7063n);
	},
});


const evenCastlesWidth2 = (height) => {
	return divideCeil(height, 2n) * 2n - 2n;
};
testing.addUnit("evenCastlesWidth2()", evenCastlesWidth2, [
	[1n, 0n],
	[2n, 0n],
	[3n, 2n],
	[4n, 2n],
	[5n, 4n],
	[6n, 4n],
	[7n, 6n]
]);
const oddCastlesWidth2 = (height) => {
	return height === 1n ? 0n : (height / 2n) * 2n - 1n;
};
testing.addUnit("oddCastlesWidth2()", oddCastlesWidth2, [
	[1n, 0n],
	[2n, 1n],
	[3n, 1n],
	[4n, 3n],
	[5n, 3n],
	[6n, 5n],
	[7n, 5n]
]);

// testing.testAll();
testing.runTestByName("numCastles() - returns the correct result for a 100x100 rectangle");
