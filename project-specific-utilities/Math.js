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
	const f1 = Factorization.factorial(Number(n));
	const f2 = Factorization.factorial(Number(r));
	const f3 = Factorization.factorial(Number(n - r));
	const result = f1.divide(f2.multiply(f3));
	return result.toNumber(modulo);
}).memoize(true));
Math.modularProduct = function(modulo, numbers) {
	const bigintInput = (typeof modulo === "bigint" || numbers.some(v => typeof v === "bigint"));
	numbers = numbers.map(n => BigInt(n));
	if(modulo != Infinity) { modulo = BigInt(modulo); }
	let result = 1n;
	for(const number of numbers) {
		result *= number;
		if(modulo != Infinity) {
			result %= modulo;
		}
	}
	if(bigintInput || result > Number.MAX_SAFE_INTEGER) {
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
		const result = (
			Math.modularExponentiate(modulo, base, largestPowerOfTwo)
			* Math.modularExponentiate(modulo, base, remainder)
		);
		return modulo === Infinity ? result : result % modulo;
	}
});
Math.defactorize = function(exponents) {
	if(Array.isArray(exponents)) {
		return exponents.map((e, i) => Sequence.PRIMES.nthTerm(i) ** e).product();
	}
	else if(typeof exponents === "object") {
		return Object.entries(exponents).map(([prime, exponent]) => Number.parseInt(prime) ** exponent).product();
	}
};
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
testing.addUnit("Math.defactorize()", {
	"can defactorize an array of exponents": () => {
		const result = Math.defactorize([1, 2, 3]);
		expect(result).toEqual(2250); // 2^1 * 3^2 * 5^3
	},
	"can defactorize an object containing prime/exponent pairs as keys": () => {
		const result = Math.defactorize({ "2": 1, "3": 2, "5": 3 });
		expect(result).toEqual(2250); // 2^1 * 3^2 * 5^3
	}
});

Math.integersBetween = function(min, max) {
	[min, max] = [Math.min(min, max), Math.max(min, max)];
	min = Math.ceil(min);
	max = Math.floor(max);
	const result = [];
	for(let i = min; i <= max; i ++) {
		result.push(i);
	}
	return result;
};
testing.addUnit("Math.integersBetween()", {
	"works when min and max are integers": () => {
		const result = Math.integersBetween(3, 5);
		expect(result).toEqual([3, 4, 5]);
	},
	"works when min and max are non-integers": () => {
		const result = Math.integersBetween(7.2, 9.1);
		expect(result).toEqual([8, 9]);
	},
	"works when min and max are in the wrong order": () => {
		const result = Math.integersBetween(7, 4);
		expect(result).toEqual([ 4, 5, 6, 7 ]);
	},
	"works when min and max are non-integers, negative, and in the wrong order": () => {
		const result = Math.integersBetween(-1.2, -2.7);
		expect(result).toEqual([-2]);
	}
});

utils.newtonsMethod = (func, derivative, initialGuess = 0, numIterations = 10, tolerance = 1e-10) => {
	let guess = initialGuess;
	for(let i = 0; i < numIterations; i ++) {
		const value = func(guess);
		if(Math.abs(value) < tolerance) {
			return guess;
		}
		const slope = derivative(guess);
		if(slope === 0) {
			guess ++;
		}
		else {
			guess = guess - value / slope;
		}
	}
	return null;
};
testing.addUnit("newtonsMethod()", {
	"can find an x-intercept of a function": () => {
		const line = (x) => -3 * x + 6;
		const derivative = (x) => -3;
		const xIntercept = utils.newtonsMethod(line, derivative);
		expect(xIntercept).toEqual(2);
	},
	"stops searching when the x-intercept is found": () => {
		let iterations = 0;
		const line = (x) => {
			iterations ++;
			return 2 * x + 10;
		};
		const derivative = (x) => 2;
		const xIntercept = utils.newtonsMethod(line, derivative);
		expect(xIntercept).toEqual(-5);
		expect(iterations).toEqual(2);
	},
	"only runs one iteration when the initial guess is an x-intercept": () => {
		let iterations = 0;
		const func = (x) => {
			iterations ++;
			return x ** 2 - 3 * x;
		};
		const derivative = (x) => 2 * x - 3;
		const xIntercept = utils.newtonsMethod(func, derivative);
		expect(xIntercept).toEqual(0);
		expect(iterations).toEqual(1);
	},
	"works when the derivative is zero at some point": () => {
		const func = (x) => -(x ** 3) + 8;
		const derivative = (x) => -3 * x ** 2;
		const xIntercept = utils.newtonsMethod(func, derivative);
		expect(xIntercept).toEqual(2);
	}
});
