const supportBigInts = (func) => {
	/* Returns a new function that does the same calculations as `func`, but supports BigInts.
	The resulting function will call `func` with the inputs converted to BigInts.
	The result will be a BigInt if:
	- One of the inputs is a BigInt
	- The number is greater than Number.MAX_SAFE_INTEGER
	and will be a Number otherwise.
	*/
	return function(...args) {
		const bigintInput = args.some(arg => typeof arg === "bigint");
		const convertedArgs = args.map(arg => (typeof arg === "number" && arg != Infinity && !Number.isNaN(arg)) ? BigInt(arg) : arg);
		const result = func(...convertedArgs);
		if(bigintInput || result > Number.MAX_SAFE_INTEGER) {
			return BigInt(result);
		}
		else { return Number(result); }
	};
};
Math.multiplesInRange = supportBigInts(function(num, min, max) {
	/* returns how many multiples of `num` are between `min` and `max` (inclusive). */
	if(min % num != 0) {
		min = num * (min / num + 1n);
	}
	if(max % num !== 0) {
		max = num * (max / num);
	}
	return (max - min) / num + 1n;
});
Math.modulateIntoRange = function(value, min, max) {
	const divideCeil = (a, b) => (a / b) + ((a % b === 0n) ? 0n : 1n); // divides bigints and rounds up
	if(typeof value === "bigint" || typeof min === "bigint" || typeof max === "bigint") {
		value = BigInt(value);
		min = BigInt(min);
		max = BigInt(max);
	}
	if(value < min) {
		const numIterations = (
			typeof value === "bigint"
			? divideCeil(min - value, max - min)
			: Math.ceil((min - value) / (max - min))
		);
		return value + (max - min) * numIterations;
	}
	else if(value > max) {
		const numIterations = (
			typeof value === "bigint"
			? divideCeil(value - max, max - min)
			: Math.ceil((value - max) / (max - min))
		);
		return value - (max - min) * numIterations;
	}
	else { return value; }
};
Math.combination = supportBigInts((function(n, r, modulo = Infinity) {
	/*
	returns the value of nCr, modulo `modulo`, if a modulo is provided.
	*/
	let result = 1n;
	for(let i = 1n; i <= r; i ++) {
		result *= (n - r + i);
		result /= i;
		if(modulo != Infinity) { result %= modulo; }
	}
	return result;
}).memoize(true));
Math.modularProduct = function(modulo, numbers) {
	const bigintInput = (typeof modulo === "bigint" || numbers.some(v => typeof v === "bigint"));
	numbers = numbers.map(n => BigInt(n));
	if(modulo != Infinity) { modulo = BigInt(modulo); }
	let result = bigintInput ? 1n : 1;
	for(const number of numbers) {
		result *= number;
		if(modulo != Infinity) {
			result %= modulo;
		}
	}
	if(bigintInput || number > Number.MAX_SAFE_INTEGER) {
		return BigInt(result);
	}
	else { return Number(result); }
};
Math.modularExponentiate = supportBigInts(function(modulo, base, exponent) {
	if(exponent == 0) { return 1; }
	if(exponent == 1) { return (modulo == Infinity) ? base : (base % modulo); }
	const largestPowerOfTwo = BigInt(2 ** Math.floor(Math.log2(Number(exponent))));
	const remainder = exponent - largestPowerOfTwo;
	if(remainder == 0) {
		/* `exponent` is a power of two */
		let result = base;
		const numIterations = BigInt(Math.log2(Number(exponent)));
		for(let i = 0; i < numIterations; i ++) {
			result *= result;
			if(modulo != Infinity) {
				result %= modulo;
			}
		}
		return result;
	}
	else {
		return (
			Math.modularExponentiate(modulo, base, largestPowerOfTwo)
			* Math.modularExponentiate(modulo, base, remainder)
		) % modulo;
	}
});
testing.addUnit("supportBigInts()", {
	"returns a function that returns a number when the inputs are all numbers": () => {
		const add = (a, b) => a + b;
		const result = supportBigInts(add)(1, 2);
		expect(result).toStrictlyEqual(3);
	},
	"returns a function that returns a BigInt when any input is a BigInt": () => {
		const add = (a, b) => a + b;
		const result = supportBigInts(add)(1, 2n);
		expect(result).toStrictlyEqual(3n);
	},
	"returns a function that returns a BigInt when the result is greater than Number.MAX_SAFE_INTEGER": () => {
		const add = (a, b) => a + b;
		const result = supportBigInts(add)(Number.MAX_SAFE_INTEGER, 1);
		expect(result).toStrictlyEqual(BigInt(Number.MAX_SAFE_INTEGER) + 1n);
	},
});
testing.addUnit("Math.multiplesInRange()", {
	"returns the correct result when the min and the max are divisible by the number": () => {
		const result = Math.multiplesInRange(5, 15, 30);
		expect(result).toEqual(4); // 15, 20, 25, 30
	},
	"returns the correct result when the min and the max are not divisible by the number": () => {
		const result = Math.multiplesInRange(10, 7, 35);
		expect(result).toEqual(3); // 10, 20, 30
	}
});
testing.addUnit("Math.modulateIntoRange()", {
	"can modulate a number into a range when it is greater than the maximum": () => {
		const result = Math.modulateIntoRange(123, 10, 20);
		expect(result).toEqual(13);
	},
	"can modulate a number into a range when it is less than the minimum": () => {
		const result = Math.modulateIntoRange(123, 1000, 2000);
		expect(result).toEqual(1123);
	},
	"can modulate a BigInt into a range when it is greater than the maximum": () => {
		const result = Math.modulateIntoRange(123n, 10n, 20n);
		expect(result).toEqual(13n);
	},
	"can modulate a BigInt into a range when it is less than the minimum": () => {
		const result = Math.modulateIntoRange(123n, 1000n, 2000n);
		expect(result).toEqual(1123n);
	},
	"returns the result when the value is between the minimum and the maximum": () => {
		const result = Math.modulateIntoRange(123, 100, 200);
		expect(result).toEqual(123);
	},
	"works when the value is far below the minimum (performance test)": () => {
		const result = Math.modulateIntoRange(12, 1e15, 1e15 + 100);
		expect(result).toEqual(1e15 + 12);
	},
	"works when the value is far above the maximum (performance test)": () => {
		const result = Math.modulateIntoRange(1e15 + 12, 0, 100);
		expect(result).toEqual(12);
	}
});
testing.addUnit("Math.combination()", {
	"works in the basic case": () => {
		const result = Math.combination(10, 5);
		expect(result).toStrictlyEqual(252);
	},
	"returns a BigInt when one of the inputs is a BigInt": () => {
		const result = Math.combination(10n, 5);
		expect(result).toStrictlyEqual(252n);
	},
	"returns a BigInt when the result is greater than Number.MAX_SAFE_INTEGER": () => {
		const result = Math.combination(100, 20);
		expect(result).toEqual(535983370403809682970n);
	},
	"can return the result modulo a number": () => {
		const result = Math.combination(10, 5, 100);
		expect(result).toEqual(52);
	},
	// "works for really big inputs (performance test)": () => {
	// 	const result = Math.combination(2e7, 1e7, 1000);
	// 	expect(result).toEqual(40);
	// }
});
testing.addUnit("Math.modularExponentiate()", {
	"returns the correct result for (2^10) % 100": () => {
		const result = Math.modularExponentiate(100, 2, 10);
		expect(result).toEqual(24);
	},
	"returns the correct result for (3^8) % 1000": () => {
		const result = Math.modularExponentiate(1000, 3, 8);
		expect(result).toEqual(561);
	}
});
testing.testUnit("Math.modulateIntoRange()");
