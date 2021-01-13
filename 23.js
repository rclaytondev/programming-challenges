const divisorSum = function(num) {
	let sum = 0;
	for(let i = 0; i < num; i ++) {
		if(num % i === 0) {
			sum += i;
		}
	}
	return sum;
}.memoize(true);

const isAbundant = num => divisorSum(num) > num;
const canBeExpressedAsSum = (number, summands) => {
	for(let i = 0; i < summands.length; i ++) {
		for(let j = i; j < summands.length; j ++) {
			if(summands[i] + summands[j] === number) {
				// console.log(`${number} equals ${summands[i]} + ${summands[j]}`);
				return true;
			}
		}
	}
	return false;
};

let abundantNumbers = [];
let sum = 0;
for(let num = 1; num < 28123; num ++) {
	if(!canBeExpressedAsSum(num, abundantNumbers)) {
		// console.log(`${num} cannot be expressed as the sum of two abundant numbers.`);
		sum += num;
	}
	if(isAbundant(num)) {
		// console.log(`${num} is abundant!`);
		abundantNumbers.push(num);
	}
	// if(num % 5000 === 0) { break; }
}
console.log(sum);
