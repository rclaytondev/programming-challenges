const digitsBelow = ((number, digit) => {
	const numDigits = `${number}`.length;
	let result = 0;
	for(let digitIndex = 0; digitIndex < numDigits; digitIndex ++) {
		const digitsToLeft = Math.floor(number / (10 ** (digitIndex + 1)));
		const digitAtIndex = Math.floor(number / (10 ** digitIndex)) % 10;
		const digitsToRight = number % (10 ** digitIndex);
		if(digitAtIndex > digit) {
			result += (digitsToLeft + 1) * (10 ** digitIndex);
		}
		else if(digitAtIndex === digit) {
			result += digitsToLeft * (10 ** digitIndex) + (digitsToRight + 1);
		}
		else {
			result += digitsToLeft * (10 ** digitIndex);
		}
	}
	return result;
}).memoize();
testing.addUnit("digitsBelow()", {
	"correctly returns the number of 1 digits below 1": () => {
		expect(digitsBelow(1, 1)).toEqual(1);
	},
	"correctly returns the number of 1 digits below 12": () => {
		expect(digitsBelow(12, 1)).toEqual(5);
	},
	"correctly returns the number of 1 digits below 199981": () => {
		expect(digitsBelow(199981, 1)).toEqual(199981);
	},
	"correctly returns the number of 1 digits below 1000": () => {
		expect(digitsBelow(1000, 1)).toEqual(301);
	},
	"correctly returns the number of 4 digits below 204": () => {
		expect(digitsBelow(204, 4)).toEqual(41);
	},
	"correctly returns the number of 8 digits below 183": () => {
		expect(digitsBelow(183, 8)).toEqual(32);
	},
	"correctly returns the number of 7 digits below 246": () => {
		expect(digitsBelow(246, 7)).toEqual(44);
	},
	"correctly returns the number of 7 digits below 247": () => {
		expect(digitsBelow(247, 7)).toEqual(45)
	},
	"correctly returns the number of 7 digits below 248": () => {
		expect(digitsBelow(248, 7)).toEqual(45);
	}
});

const isSolution = (num, digit) => digitsBelow(num, digit) === num;
const naiveFindSolutions = (digit, min, max) => {
	const solutions = new Set();
	for(let i = min; i <= max; i ++) {
		if(isSolution(i, digit)) { solutions.add(i); }
	}
	return solutions;
};
const findSolutions = (digit, min, max) => {
	/* returns solutions in the range (inclusive). */
	if(max === Infinity) {
		let solutions = findSolutions(digit, 1, 1e10);
		// for(let i = 1e10; i < Infinity; i += )
	}
	if(min > max) { return []; }
	if(min === max) { return isSolution(min, digit) ? [min] : []; }
	const initialDigits = digitsBelow(min, digit);
	if(initialDigits < min) {
		const newMin = binarySearch(
			min, max,
			(num) => digitsBelow(num, digit) - min
		);
		if(min === newMin) {
			/* do a linear search to find the next solution (multiple if they are consecutive), then resume the faster binary-search algorithm */
			let solutions = new Set();
			let i;
			for(i = min; i <= max; i ++) {
				if(isSolution(i)) { solutions.add(i); }
				else { break; }
			}
			return new Set([...solutions, ...findSolutions(digit, i + 1, max)]);
		}
		else {
			// console.log(`eliminated ${newMin - min} numbers`);
			return findSolutions(digit, newMin, max);
		}
	}
	else if(initialDigits > min) {
		return findSolutions(digit, initialDigits, max);
	}
	else {
		return new Set([min, ...findSolutions(digit, min + 1, max)]);
	}
};
testing.addUnit("findSolutions()", {
	"correctly finds solutions for 1 in the range 190,000-200,000": () => {
		const solutions = findSolutions(1, 190000, 200000);
		expect(solutions).toEqual(new Set([
			199981, 199982, 199983, 199984, 199985, 199986, 199987, 199988, 199989, 199990, 200000
		]));
	}
});


const binarySearch = (min, max, callback, whichOne = "first") => {
	/* min and max are both inclusive.

	whichOne can be either "first", "last", or "any". It determines which is returned if there are multiple values or zero values.

	If there are multiple values (e.g. searching for 3 in [1, 2, 3, 3]):
	- `whichOne == first` will return the first one (index 2 in the example above)
	- `whichOne == last` will return the last one (index 3 in the example above)

	If there are no values (e.g. searching for 3 in [1, 2, 4, 5]):
	- `whichOne == first` will return the one before (index 1 in the example above)
	- `whichOne == last` will return the one after (index 2 in the example above)
	*/
	while(max - min > 1) {
		const mid = Math.floor((min + max) / 2);
		const result = callback(mid);
		if(result < 0) {
			/* guess was too low */
			min = mid;
		}
		else if(result > 0) {
			/* guess was too high */
			max = mid;
		}
		else {
			if(whichOne === "first") { max = mid; }
			else if(whichOne === "last") { min = mid; }
			else { min = max = mid; break; }
		}
	}
	if(max === min + 1) {
		if(callback(min) === 0 && callback(max) !== 0) { return min; }
		if(callback(min) !== 0 && callback(max) === 0) { return max; }
		return whichOne === "first" ? min : max;
	}
	/* min === max */
	return min;
};
testing.addUnit("binarySearch()", {
	"works in the general case": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 3);
		const result = binarySearch(0, 8, callback);
		expect(result).toEqual(5);
	},
	"can return the first value when there are multiple values": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 2);
		const result = binarySearch(0, 8, callback, "first");
		expect(result).toEqual(2);
	},
	"can return the last value when there are multiple values": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 2);
		const result = binarySearch(0, 8, callback, "last");
		expect(result).toEqual(4);
	},
	"can return the value before when there are no values for which the callback returns zero": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 6);
		const result = binarySearch(0, 8, callback, "first");
		expect(result).toEqual(7);
	},
	"can return the value after when there are no values for which the callback returns zero": () => {
		const array = [1, 1, 2, 2, 2, 3, 4, 5, 10];
		const callback = (n => array[n] - 6);
		const result = binarySearch(0, 8, callback, "last");
		expect(result).toEqual(8);
	},
});
testing.testAll();

const testNaiveMethod = () => {
	const timeBefore = Date.now();
	const result = naiveFindSolutions(1, 190000, 200000);
	const timeAfter = Date.now();
	const time = timeAfter - timeBefore;
	const seconds = time / 1000;
	console.log(`the function took ${seconds} seconds.`);
};


const solve = () => {
	const UPPER_BOUND = 1e11;
	let answer = 0;
	for(let digit = 1; digit <= 9; digit ++) {
		const solutions = findSolutions(digit, 0, UPPER_BOUND);
		console.log(`finished finding solutions for ${digit}`);
		answer += [...solutions].sum();
	}
	console.log(`the answer is ${answer}`);
	return answer;
};
