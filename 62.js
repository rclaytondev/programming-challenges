const solve = (numPermutedCubes = 5) => {
	for(let i = 1; i < Infinity; i ++) {
		const cube = i ** 3;
		const digits = cube.digits();
		let actualPermutedCubes = 0;
		for(const permutation of digits.permutations()) {
			const permutedCube = Number.fromDigits(permutation);
			if(permutation[0] !== 0 && Math.cbrt(permutedCube) % 1 === 0) {
				actualPermutedCubes ++;
			}
		}
		if(actualPermutedCubes === numPermutedCubes) {
			return cube;
		}
	}
};
