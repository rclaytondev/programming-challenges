const numbersWithAtLeastNDivisors = (minDivisors) => new Sequence(
	function*() {
		for(let i = 0; i < Infinity; i ++) {
			if(numDivisors(i) >= minDivisors) { yield i; }
		}
	},
	{ isMonotonic: true }
);
const numDivisors = (n) => {
	let divisors = 0;
	for(let i = 1; i * i <= n; i ++) {
		if(n % i === 0) {
			divisors += (i * i === n) ? 1 : 2;
		}
	}
	return divisors;
};
const numbersWithNDivisors = (divisors) => new Sequence(
	function*() {
		for(let i = 0; i < Infinity; i ++) {
			if(numDivisors(i) === divisors) {
				yield i;
			}
		}
	}
);
const leastWithAtLeastNDivisors = (divisors) => {
	for(let i = 0; i < Infinity; i ++) {
		if(numDivisors(i) >= divisors) { return i; }
	}
};
