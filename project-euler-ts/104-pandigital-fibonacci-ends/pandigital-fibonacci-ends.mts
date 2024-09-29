const hasPandigitalEnds = (num: bigint) => {
	const last9 = `${num % 1000_000_000n}`;
	if(last9.includes("0") || new Set(last9).size !== 9) {
		return false;
	}
	const first9 = `${num}`.slice(0, 9);
	return !first9.includes("0") && new Set(first9).size === 9;
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
