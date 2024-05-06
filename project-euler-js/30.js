const findZeroes = (func, min, max, desiredAccuracy) => {
	/* uses binary search to find an x-intercept of the function. */
	if(max - min < desiredAccuracy) {
		return (min + max) / 2;
	}
	const endpoint1 = func(min);
	const midpoint = func((min + max) / 2);
	const endpoint2 = func(max);

	if(midpoint === 0) {
		return (min + max) / 2;
	}

	if((endpoint1 > 0 && midpoint < 0) || (endpoint1 < 0 && midpoint > 0)) {
		return findZeroes(func, min, (min + max) / 2, desiredAccuracy);
	}
	else if((midpoint < 0 && endpoint2 > 0) || (midpoint > 0 && endpoint2 < 0)) {
		return findZeroes(func, (min + max) / 2, max, desiredAccuracy);
	}
	else {
		throw new Error("To use binary search, the function output must be negative at one endpoint and positive at the other endpoint.");
	}
};

testing.addUnit("findZeroes()", {
	"test case 1": () => {
		const func = (x) => x ** 2 - 4 * x;
		const xIntercept = findZeroes(func, 1, 1000, 1e-15);
		expect(xIntercept).toApproximatelyEqual(4);
	},
	"test case 2": () => {
		const func = Math.log2;
		const xIntercept = findZeroes(func, 0, 1000, 1e-15);
		expect(xIntercept).toApproximatelyEqual(1);
	},
	"test case 3": () => {
		const func = (x) => (3 * x ** 2) - (2 * x ** 3);
		const xIntercept = findZeroes(func, 0.1, 1000, 1e-15);
		expect(xIntercept).toApproximatelyEqual(1.5);
	}
});
testing.testUnit("findZeroes()");

const upperBound = () => {
	/*
	Consider an n-digit number.
	The maximum fifth-power digit sum is (9^5) * n = 59049 * n.
	The minimum value of the number is 10^(n - 1).
	Since the value grows faster than the fifth-power digit sum (exponential vs linear), there must exist a number where every number higher than it has a lower fifth-power digit sum than value.
	That number will be the solution of the equation (9^5) * n = 10^(n - 1), which this function calculates.
	*/
	const func = (n) => (9 ** 5) * n - (10 ** (n - 1));
	return 10 ** (findZeroes(func, 1, 2 ** 20, 0.00001) - 1);
};

const equalsDigitPowerSum = (number) => {
	const digits = [...`${number}`].map(char => Number.parseInt(char));
	return digits.sum(digit => digit ** 5) === number;
};


const max = upperBound();
let sum = 0;
for(let i = 10; i < max; i ++) {
	if(equalsDigitPowerSum(i)) {
		// console.log(i);
		sum += i;
	}
}
console.log(sum);
