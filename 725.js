const MOD_EXP = 16;
const MODULO = 10 ** MOD_EXP;
const combinations = (n, r) => {
	/* Returns (n!) / (r! * (n-r)!). */
	let result = 1;
	for(let i = n - r + 1; i <= n; i ++) { result *= i; }
	for(let i = 1; i <= r; i ++) { result /= i; }
	return result;
};
const partitions = (number => {
	if(number <= 1) { return []; }
	const ways = [];
	for(const array of Tree.iterate([], function*(array) {
		const sum = array.sum();
		for(let i = array[array.length - 1] ?? 1; i + sum <= number && i < number; i ++) {
			yield [...array, i];
		}
	})) {
		if(array.sum() === number) { ways.push(array); }
	}
	return ways;
}).memoize(true);
const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
const PARTITIONS_1_TO_9 = [1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => partitions(n)).flat(1);
const removeFirst = (array, value) => {
	let result = [];
	let removed = false;
	for(const v of array) {
		if(v !== value || removed) { result.push(v); }
		else { removed = true; }
	}
	return result;
};

const type1Sum = (maxDigits) => {
	let result = 0;
	for(let digitIndex = 0; digitIndex < Math.min(maxDigits, MOD_EXP + 1); digitIndex ++) {
		for(let digit = 1; digit <= 9; digit ++) {
			const digitValue = digit * (10 ** digitIndex);
			for(const partition of partitions(digit).filter(p => p.length < maxDigits)) {
				const numOccurences = combinations(maxDigits - 1, partition.length) * partition.permutations().size; // number of types this digit appears in this position as the highest digit in the number
				result += digitValue * numOccurences;
				result %= MODULO;
			}
			for(const partition of PARTITIONS_1_TO_9.filter(p => p.includes(digit) && p.length < maxDigits)) {
				const otherNumbers = [...removeFirst(partition, digit), partition.sum()];
				const numOccurences = combinations(maxDigits - 1, otherNumbers.length) * otherNumbers.permutations().size;
				result += digitValue * numOccurences;
				result %= MODULO;
			}
		}
	}
	return result;
};
const type2Sum = (maxDigits) => {
	let sum = 0;
	for(let digitIndex = 0; digitIndex < Math.min(maxDigits, MOD_EXP + 1); digitIndex ++) {
		for(const digit of DIGITS) {
			sum += (maxDigits - 1) * (digit) * (10 ** digitIndex);
			sum %= MODULO;
		}
	}
	return sum;
};
const dsNumSum = (maxDigits) => {
	return (type1Sum(maxDigits) + type2Sum(maxDigits)) % MODULO;
};

testing.addUnit("combinations()", {
	"returns the correct result for the input [10, 5]": () => {
		expect(combinations(10, 5)).toEqual(252);
	},
	"returns the correct result for the input [22, 7]": () => {
		expect(combinations(22, 7)).toEqual(170544);
	},
	"doesn't return Infinity for inputs that require large intermediate values": () => {
		// regression test
		expect(combinations(200, 2)).toEqual(19900);
	}
});
testing.addUnit("dsNumSum()", {
	"returns the correct sum of DS-numbers with 2 digits or less": () => {
		expect(dsNumSum(2)).toEqual(495);
	},
	"returns the correct sum of DS-numbers with 3 digits or less": () => {
		expect(dsNumSum(3)).toEqual(63270);
	},
	"returns the correct sum of DS-numbers with 4 digits or less": () => {
		expect(dsNumSum(4)).toEqual(3149685);
	},
	"returns the correct sum of DS-numbers with 7 digits or less": () => {
		expect(dsNumSum(7)).toEqual(85499991450);
	}
});
testing.testAll();
