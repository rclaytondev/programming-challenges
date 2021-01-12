const collatz = n => (
	(n % 2 === 0) ? n / 2 :
	(n % 2 === 1) ? (3 * n) + 1 :
	null
);
const collatzLength = startValue => {
	let value = startValue;
	for(let iterations = 1; iterations < Infinity; iterations ++) {
		if(value === 1) {
			return iterations;
		}
		value = collatz(value);
	}
};
let longestLength = 0;
let longestStartValue = 0;
for(let i = 1; i < 1e6; i ++) {
	const length = collatzLength(i);
	if(length > longestLength) {
		console.log(`${i} is the new longest-sequence starting value, with a sequence length of ${length}.`);
		longestLength = length;
		longestStartValue = i;
	}
}
console.log(longestStartValue);
