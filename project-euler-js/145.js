const canBeReversed = (number) => !`${number}`.endsWith("0");
testing.addUnit("canBeReversed()", canBeReversed, [
	[17, true],
	[340, false]
]);

const reverse = (number) => Number.parseInt(number.digits().reverse().join(""));
testing.addUnit("reverse", {
	"works for one-digit numbers": () => {
		expect(reverse(3)).toEqual(3);
	},
	"works for multi-digit numbers": () => {
		expect(reverse(321)).toEqual(123);
	}
});

const reversiblesBelow = (upperBound) => {
	let reversiblesFound = new Set();
	const checkForReversibility = (number) => {
		if(!reversiblesFound.has(number)) {
			const reversedSum = number + reverse(number);
			if(reversedSum.digits().every(d => d % 2 === 1)) {
				reversiblesFound.add(number);
			}
		}
	};
	for(let i = 0; i < upperBound; i += 10) {
		if(i.digits()[0] % 2 === 1) {
			checkForReversibility(i + 2);
			checkForReversibility(i + 4);
			checkForReversibility(i + 6);
			checkForReversibility(i + 8);
		}
		else {
			checkForReversibility(i + 1);
			checkForReversibility(i + 3);
			checkForReversibility(i + 5);
			checkForReversibility(i + 7);
			checkForReversibility(i + 9);
		}
	}
	return reversiblesFound.size;
};
testing.addUnit("reversiblesBelow()", reversiblesBelow, [
	[1000, 120]
]);

const solve = () => {
	return reversiblesBelow(1e9);
};

const reversiblesWithSum = (number) => {
	let reversibles = [];
	for(let i = 0; i < number; i ++) {
		if(i % 10 === 0) { continue; }
		if(i + reverse(i) === number) {
			reversibles.push(i);
		}
	}
	return reversibles;
};
testing.addUnit("reversiblesWithSum()", reversiblesWithSum, [
	[35, []],
	[55, [14, 23, 32, 41]],
	[99, [18, 27, 36, 45, 54, 63, 72, 81]],
	[605, [154, 253, 352, 451]],
	[905, []],
	[988, [197, 296, 395, 494, 593, 692, 791]],
	[989, [148, 247, 346, 445, 544, 643, 742, 841]],
	[1313, [409, 508, 607, 706, 805, 904]],
	[1515, [609, 708, 807, 906]],
	[1717, [809, 908]],
	[1111, [209, 308, 407, 506, 605, 704, 803, 902]]
]);

console.time("solving the problem");
// console.log(solve());
console.timeEnd("solving the problem");
