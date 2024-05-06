const combinations = (n, r) => {
	/* Returns (n!) / (r! * (n-r)!). */
	if(typeof n === "bigint" || typeof r === "bigint") {
		n = BigInt(n), r = BigInt(r);
	}
	let result = 1n;
	for(let i = n - r + 1n; i <= n; i ++) { result *= i; }
	for(let i = 1n; i <= r; i ++) { result /= i; }
	return result;
};
const waysToArrange = (blocks, width) => {
	/* Returns how many ways there are to arrange blocks of the given sizes in a row of the given width such that there exists a gap of at least 1 in between each block.
	Assumes the array `blocks` contains positive integers in ascending order. */
	if(width - blocks.sum() < blocks.length - 1) {
		return 0;
	}
	if(blocks.length === 1) {
		return width - blocks[0] + 1n;
	}
	else {
		return BigInt(blocks.permutations().size) * combinations(blocks.length + 1, width - (blocks.sum() + BigInt(blocks.length) - 1n))
	}
};
const partitions = function*(number) {
	if(number <= 0) { return []; }
	for(const array of Tree.iterate([], function*(array) {
		const sum = BigInt(array.sum());
		for(let i = array[array.length - 1] ?? 1n; i + sum <= number; i ++) {
			yield [...array, i];
		}
	}, true)) {
		if(array.sum() === number) { yield array; }
	}
};
testing.addUnit("waysToArrange()", [
	() => {
		expect(waysToArrange([1, 1], 2)).toEqual(0);
	},
	() => {
		expect(waysToArrange([1, 1], 3)).toEqual(1);
	},
	() => {
		expect(waysToArrange([2, 1], 4)).toEqual(2);
	},
	() => {
		expect(waysToArrange([1, 1, 2], 8)).toEqual(18);
	},
]);

const numCastles = ((width, height, modulo = Infinity, parity = "even", usesFullHeight = true) => {
	width = BigInt(width), height = BigInt(height);
	if(modulo !== Infinity) { modulo = BigInt(modulo); }
	if(height === 1n) {
		return (parity === "odd" && usesFullHeight) ? 1n : 0n;
	}

	let result = usesFullHeight ? 0n : 1n; // this represents the castle consisting of a single block along the bottom
	for(let usedSpaces = 1n; usedSpaces <= width; usedSpaces ++) {
		for(const partition of partitions(usedSpaces)) {
			/* the array `partition` is the widths of the blocks on the next row */
			const arrangements = BigInt(waysToArrange(partition, width));
			for(const parities of Tree.iterate([], (parities) => {
				if(parities.length >= partition.length) { return []; }
				if(parities.length === partition.length - 1) {
					if((parities.count("odd") % 2 === 0) === (parity === "even")) {
						return [ [...parities, "odd"] ];
					}
					else { return [ [...parities, "even"] ]; }
				}
				else {
					return [ [...parities, "even"], [...parities, "odd"] ];
				}
			}, true)) {
				/* `parities` is a list containing the parity of each sub-castle */
				for(const booleanArray of new Set([true, false]).cartesianPower(partition.length)) {
					debugger;
					if(!booleanArray.includes(true)) { continue; }
					result += arrangements * partition.product((n, i) => numCastles(
						n,
						height - 1n,
						Infinity,
						parities[i],
						booleanArray[i]
					));
				}
			}
		}
	}
	return result;
}).memoize(true);
const solve = () => {
	const MODULO = 1000000007;
	const result = (
		numCastles(1e12, 100, MODULO) +
		numCastles(10000, 10000, MODULO) +
		numCastles(100, 1e12, MODULO)
	) % MODULO;
	console.info(`the answer is ${result}`);
	return result;
};
testing.addUnit("numCastles()", {
	/* test cases from Project Euler */
	"returns the correct result for a 4x2 full-height even-parity rectangle": () => {
		expect(numCastles(4, 2)).toEqual(10);
	},
	"returns the correct result for a 13x10 full-height even-parity rectangle": () => {
		expect(numCastles(13, 10)).toEqual(3729050610636);
	},
	"returns the correct result for a 10x13 full-height even-parity rectangle": () => {
		expect(numCastles(10, 13)).toEqual(37959702514);
	},
	"returns the correct result for a 100x100 full-height even-parity rectangle": () => {
		expect(numCastles(100, 100, 1000000007)).toEqual(841913936);
	},
	/* other test cases */
	"returns the correct result for a 10x2 non-full-height even-parity rectangle": () => {
		expect(numCastles(100, 2, Infinity, "even", false)).toEqual(0);
	}
});

// testing.testAll();
// testing.runTestByName("numCastles() - returns the correct result for a 13x10 full-height even-parity rectangle");
