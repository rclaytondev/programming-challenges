const divisorSum = function(num) {
	let sum = 0;
	for(let i = 0; i < num; i ++) {
		if(num % i === 0) {
			sum += i;
		}
	}
	return sum;
}.memoize(true);


const isAmicable = (number) => {
	return divisorSum(divisorSum(number)) === number && divisorSum(number) !== number;
};


let amicableSum = 0;
for(let i = 1; i < 10000; i ++) {
	if(isAmicable(i)) {
		console.log(`${i} is an amicable number.`);
		amicableSum += i;
	}
}
console.log(amicableSum);
