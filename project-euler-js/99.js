let largestIndex = 0;
for(let i = 0; i < EXPONENTIALS.length; i ++) {
	const largestPair = EXPONENTIALS[largestIndex];
	const exponentialPair = EXPONENTIALS[i];
	const [a, b] = largestPair;
	const [c, d] = exponentialPair;
	if(d * Math.log(c) > b * Math.log(a)) {
		largestIndex = i;
	}
}
console.log(`the answer is ${largestIndex + 1}`);
