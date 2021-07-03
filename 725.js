const isDSNumber = (number) => {
	const digits = number.digits();
	return digits.some((digit, index) => {
		const sumOfOthers = digits.filter((v, i) => i !== index).sum();
		return digit === sumOfOthers;
	});
};
const dsNumbers = (maxDigits) => {
	let numbers = new Set();
	for(let i = 1; `${i}`.length <= maxDigits; i ++) {
		if(isDSNumber(i)) { numbers.add(i); }
	}
	return numbers;
};

const type1Numbers = function*(maxDigits) {
	for(let digitIndex = 0; digitIndex < maxDigits; digitIndex ++) {
		for(const digit of DIGITS) {
			/* find numbers with this digit at this index being the sum of the others */
			for(const partition of partitions(digit).filter(p => p.length < maxDigits)) {
				const initialDigits = new Array(maxDigits).fill(0);
				initialDigits[digitIndex] = digit;
				for(const digits of Tree.iterate(initialDigits, function*(partialDigits) {
					const digitsPlaced = partialDigits.filter(v => v !== 0).length - 1;
					const nextDigit = partition[digitsPlaced];
					const startIndex = partialDigits.lastIndexOf(nextDigit) + 1;
					for(let i = startIndex; i < partialDigits.length; i ++) {
						if(partialDigits[i] === 0) {
							const newPartialDigits = [...partialDigits];
							newPartialDigits[i] = nextDigit;
							yield newPartialDigits;
						}
					}
				})) {
					if(digits.sum() === 2 * digit) {
						yield digits.map((n, i) => n * 10 ** (digits.length - i - 1)).sum();
					}
				}
			}
		}
	}
};

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9];
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
const type1Sum = (maxDigits, modulo = Infinity) => {
	let result = 0;
	for(const number of type1Numbers(maxDigits)) {
		result += number;
	}
	return result;
};
const type2Sum = (maxDigits, modulo = Infinity) => {
	let sum = 0;
	for(let digitIndex = 0; digitIndex < maxDigits; digitIndex ++) {
		for(const digit of DIGITS) {
			sum += (maxDigits - 1) * (digit) * (10 ** digitIndex);
		}
	}
	return sum;
};
const dsNumSum = (maxDigits, modulo = Infinity) => {
	return (type1Sum(maxDigits, modulo) + type2Sum(maxDigits, modulo)) % modulo;
};
testing.addUnit("type1Sum()", {
	"returns the correct sum of type-1 numbers with 3 digits or less": () => {
		const result = type1Sum(3);
		expect(result).toEqual(53280);
	},
	"returns the correct sum of type-1 numbers with 4 digits or less": () => {
		const result = type1Sum(4);
		expect(result).toEqual(2999700);
	},
	"returns the correct sum of type-1 numbers with 7 digits or less": () => {
		const result = type1Sum(7);
		expect(result).toEqual(85199991480);
	},
});
testing.addUnit("type2Sum()", {
	"returns the correct sum of type-2 numbers with 2 digits or less": () => {
		const expected = 11 + 22 + 33 + 44 + 55 + 66 + 77 + 88 + 99; // 495
		expect(type2Sum(2)).toEqual(expected);
	},
	"returns the correct sum of type-2 numbers with 3 digits or less": () => {
		const expected = (
			11 + 22 + 33 + 44 + 55 + 66 + 77 + 88 + 99 +
			101 + 202 + 303 + 404 + 505 + 606 + 707 + 808 + 909 +
			110 + 220 + 330 + 440 + 550 + 660 + 770 + 880 + 990
		); // 9990
		expect(type2Sum(3)).toEqual(expected);
	},
	"returns the correct sum of type-2 numbers with 4 digits or less": () => {
		const expected = (
			11 + 22 + 33 + 44 + 55 + 66 + 77 + 88 + 99 +
			101 + 202 + 303 + 404 + 505 + 606 + 707 + 808 + 909 +
			110 + 220 + 330 + 440 + 550 + 660 + 770 + 880 + 990 +
			1100 + 2200 + 3300 + 4400 + 5500 + 6600 + 7700 + 8800 + 9900 +
			1010 + 2020 + 3030 + 4040 + 5050 + 6060 + 7070 + 8080 + 9090 +
			1001 + 2002 + 3003 + 4004 + 5005 + 6006 + 7007 + 8008 + 9009
		);
		expect(type2Sum(4)).toEqual(expected);
	}
});
testing.addUnit("dsNumSum()", {
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

const solve = () => {
	const answer = dsNumSum(2020, 1e16);
	console.log(`the answer is ${answer}`);
	return answer;
};
testing.testAll();
