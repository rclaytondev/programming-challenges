const NUMBER = 600851475143;

const isPrime = (number) => {
	if(number === 1) { return false; }

	const max = Math.ceil(Math.sqrt(number));
	for(let i = 2; i <= max; i ++) {
		if(number % i === 0) {
			return false;
		}
	}
	return true;
};
const primeFactors = (number) => {
	const max = Math.sqrt(number);
	const factors = [];
	for(let i = 0; i < max; i ++) {
		if(number % i === 0 && isPrime(i)) {
			factors.push(i);
		}
	}
	return factors;
};
console.log(primeFactors(NUMBER).lastItem());
