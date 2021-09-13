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
Math.combination = (function(n, r) {
	/*
	returns the value of nCr.
	If n or r are BigInts, the result will be a BigInt.
	If the result is greater than Number.MAX_SAFE_INTEGER, the result will be a BigInt.
	Otherwise, the result will be a Number.
	*/
	const bigintInput = (typeof n === "bigint" || typeof r === "bigint");
	n = BigInt(n), r = BigInt(r);
	let result = 1n;
	for(let i = n - r + 1n; i <= n; i ++) { result *= i; }
	for(let i = 1n; i <= r; i ++) { result /= i; }
	if(!bigintInput && result <= Number.MAX_SAFE_INTEGER) {
		result = Number(result);
	}
	return result;
}).memoize();
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
	}
});
testing.testUnit("Math.modulateIntoRange()");
