const minSolution = (D: number) => {
	for(let x = 2; x < Infinity; x ++) {
		if(Math.sqrt((x ** 2 - 1) / D) % 1 === 0) {
			return x;
		}
	}
	throw new Error("Reached end of infinite loop.");
};

export const solve = () => {
	let highestD = 0;
	let highestMinSolution = -Infinity;
	for(let D = 1; D <= 50; D ++) {
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
// console.log(solve());
