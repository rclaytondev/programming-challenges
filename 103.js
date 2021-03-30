const problem103 = {
	specialSet: (size, setArray = [], upperBound = Infinity, numbersToSkip = new Set([])) => {
		/*
		Returns a special set (in array form, in ascending order) with the given size, starting with the contents of setArray.
		All numbers will be lower than `upperBound`, and will not include anything in `numbersToSkip`.
		`setArray`, `upperBound`, and `numbersToSkip` are mostly just used internally.
		*/
		if(setArray.length === size) {
			if(setArray.max() < upperBound && !setArray.some(v => numbersToSkip.has(v))) {
				return setArray;
			}
			else {
				return null;
			}
		}
		let lowestSetArray = null;
		let lowestSum = Infinity;
		for(
			let nextNumber = (setArray.max() ?? 0) + 1;
			nextNumber < upperBound && nextNumber < lowestSum;
			nextNumber ++
		) {
			const newNumbersToSkip = new Set(numbersToSkip);
			let newUpperBound = upperBound;
			const newSetArray = [...setArray, nextNumber];
			if(newSetArray.length !== 0) {
				for(const multipliers of new Set([-1, 0, 1]).cartesianPower(newSetArray.length)) {
					const numToSkip = newSetArray.map((v, i) => v * multipliers[i]).sum();
					if(numToSkip > newSetArray.max() ?? 0) {
						if(multipliers.count(-1) < multipliers.count(1) + 1) {
							newUpperBound = numToSkip;
						}
						else {
							newNumbersToSkip.push(numToSkip);
						}
					}
				}
			}

			const result = problem103.specialSet(
				size,
				[...setArray, nextNumber],
				newUpperBound,
				newNumbersToSkip
			);
			if(result != null) {
				const resultSum = [...result].sum();
				if(resultSum < lowestSum) {
					lowestSum = resultSum;
					lowestSetArray = result;
				}
			}
		}
		return lowestSetArray;
	},
};

testing.addUnit("problem103.specialSet()", problem103.specialSet, [
	[1, [1]],
	[2, [1, 2]],
	// [3, [2, 3, 4]],
	// [4, [3, 5, 6, 7]],
	// [5, [6, 9, 11, 12, 13]],
	// [6, [11, 18, 19, 20, 22, 25]]
]);
testing.testUnit("problem103.specialSet()");
// testing.runTestByName("problem103.specialSet() - test case 3");
