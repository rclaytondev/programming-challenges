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

const isLeftTruncatable = number => {
	for(let i = 0; i < `${number}`.length; i ++) {
		const num = Number.parseInt(`${number}`.substring(i, `${number}`.length));
		if(!isPrime(num)) {
			return false;
		}
	}
	return true;
};
const isRightTruncatable = number => {
	for(let i = 0; i < `${number}`.length; i ++) {
		const num = Number.parseInt(`${number}`.substring(0, i + 1));
		if(!isPrime(num)) {
			return false;
		}
	}
	return true;
};
const isTruncatable = number => isLeftTruncatable(number) && isRightTruncatable(number);


console.log(isPrime(11));

const DIGITS = [1, 2, 3, 5, 7, 9];

const leftTruncatable = [2, 3, 5, 7];
for(let i = 0; i < leftTruncatable.length; i ++) {
	const num = leftTruncatable[i];
	DIGITS.forEach(oddDigit => {
		const possibleNewPrime = Number.parseInt(`${oddDigit}${num}`);
		if(isPrime(possibleNewPrime)) {
			leftTruncatable.push(possibleNewPrime);
		}
	});
}


const rightTruncatable = [2, 3, 5, 7];
for(let i = 0; i < rightTruncatable.length; i ++) {
	const num = rightTruncatable[i];
	DIGITS.forEach(oddDigit => {
		const possibleNewPrime = Number.parseInt(`${num}${oddDigit}`);
		if(isPrime(possibleNewPrime)) {
			rightTruncatable.push(possibleNewPrime);
		}
	});
}


let truncatable = (
	new Set(leftTruncatable)
	.intersection(new Set(rightTruncatable))
	.difference(new Set([1, 2, 3, 5, 7]))
);
console.log([...truncatable].sum());
