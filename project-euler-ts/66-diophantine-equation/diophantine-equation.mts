const minSolution = (D: number) => {
	for(let y = 1; true; y ++) {
		const x = Math.sqrt(1 + D * y ** 2);
		if(x % 1 === 0) {
			console.log(`for D=${D}, the minimal solution has x=${x}`);
			return x;
		}
	}
};

export const solve = () => {
	let highestD = 0;
	let highestMinSolution = -Infinity;
	for(let D = 1; D <= 1000; D ++) {
		if(Math.sqrt(D) % 1 === 0) { continue; }
		const solution =  minSolution(D);
		// console.log(`For D=${D}, the minimal solution has x=${solution}`);
		if(solution > highestMinSolution) {
			highestMinSolution = solution;
			highestD = D;
		}
	}
	return highestD;
};
console.time();
console.log(solve());
console.timeEnd();
debugger;
