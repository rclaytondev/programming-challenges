const hasPandigitalEnds = (num: bigint) => {
	const numString = `${num}`;
	const first9 = numString.slice(0, 9);
	const last9 = numString.slice(numString.length - 9);
	return (
		!first9.includes("0") && new Set(first9).size === 9 &&
		!last9.includes("0") && new Set(last9).size === 9
	);
};

const solve = () => {
	let previousFib = 1n;
	let currentFib = 1n;
	let index = 2;
	while(true) {
		if(index % 10000 === 0) {
			console.log(index);
		}
		[previousFib, currentFib] = [currentFib, previousFib + currentFib];
		index ++;
		if(hasPandigitalEnds(currentFib)) {
			return index;
		}
	}
};

console.time();
console.log(solve());
console.timeEnd();
debugger;
