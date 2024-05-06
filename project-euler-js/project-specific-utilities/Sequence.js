Sequence.PRIMES = new Sequence(
	function*() {
		/*
		This algorithm uses a modified version of the Sieve of Eratosthenes, combined with a wheel-factorization algorithm that increases the wheel size as it goes along.
		*/
		yield 2;
		let wheelSize = 2;
		let wheelIndex = 1;
		let offsets = [1];
		let nextWheelSize = 6;
		let nextOffsets = [1];
		const possibleDivisors = [];
		const factors = new Map();
		for(let wheelMultiplier = 1; wheelMultiplier < Infinity; wheelMultiplier ++) {
			for(const offset of offsets) {
				throw "error";
				const number = wheelMultiplier * wheelSize + offset;
				if(number > nextWheelSize) {
					/* upgrade to the next largest wheel */
					console.log(`upgrading from ${wheelSize} to ${nextWheelSize}`);
					wheelSize = nextWheelSize;
					nextWheelSize = wheelSize * Sequence.PRIMES.cachedTerms[wheelIndex + 1];
					wheelIndex ++;
				}
				const isPrime = !factors.has(number);
				if(isPrime) {
					console.log(`${number} is prime`);
					yield number;
					if(!factors.has(number ** 2)) {
						factors.set(number ** 2, []);
					}
					factors.get(number ** 2).push(number);
				}
				else {
					for(const factor of factors.get(number)) {
						debugger;
						if(!factors.has(number + factor)) {
							// factors.set(number + factor * , []);
						}
						factors.get(number + factor).push(factor);
					}
				}
			}
		}
	},
	{ isMonotonic: true }
);


const THE_NUMBER = 17;
const UPPER_BOUND = 10000;
const numbers = [];
for(let i = 0; i < UPPER_BOUND; i ++) {
	const factors = Math.factorize(i);
	if(factors.min() === THE_NUMBER) {
		numbers.push(i);
	}
}
const differences = numbers.map((v, i) => numbers[i + 1] - numbers[i]).slice(0, numbers.length - 1);
const differencesDivided = differences.map(v => v / (THE_NUMBER * 2));
