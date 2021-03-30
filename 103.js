const problem103 = {
	invalidNumbers: (specialSumArray) => {
		if(specialSumArray.length !== 0) {
			let upperBound = Infinity;
			let numbersToSkip = [];
			for(const multipliers of new Set([-1, 0, 1]).cartesianPower(specialSumArray.length)) {
				const numToSkip = specialSumArray.map((v, i) => v * multipliers[i]).sum();
				if(numToSkip > specialSumArray.max() ?? 0) {
					if(multipliers.count(-1) < multipliers.count(1) + 1) {
						upperBound = numToSkip;
					}
					else {
						numbersToSkip.push(numToSkip);
					}
				}
			}
			return { numbersToSkip, upperBound };
		}
		else {
			return {
				numbersToSkip: [],
				upperBound: Infinity
			};
		}
	},
	specialSet: (size, specialSumArray = [], upperBound = Infinity, numbersToSkip = []) => {
		/*
		Returns a special set (in array form, in ascending order) with the given size, starting with the contents of specialSumArray.
		All numbers will be lower than `upperBound`, and will not include anything in `numbersToSkip`.
		`specialSumArray`, `upperBound`, and `numbersToSkip` are mostly just used internally.
		*/
		debugger;
		if(specialSumArray.length === size) {
			if(specialSumArray.max() < upperBound && !specialSumArray.some(v => numbersToSkip.includes(v))) {
				return specialSumArray;
			}
			else {
				return null;
			}
		}
		let lowestSetArray = null;
		let lowestSum = Infinity;
		for(
			let nextNumber = (specialSumArray.max() ?? 0) + 1;
			nextNumber < upperBound && nextNumber < lowestSum;
			nextNumber ++
		) {
			const newSpecialSumArray = [...specialSumArray, nextNumber];
			const {
				numbersToSkip: newNumbersToSkip,
				upperBound: newUpperBound
			} = problem103.invalidNumbers(newSpecialSumArray);

			const result = problem103.specialSet(
				size,
				newSpecialSumArray,
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
