const problem103 = {
	invalidNumbers: (specialSumArray) => {
		if(specialSumArray.length !== 0) {
			let upperBound = Infinity;
			let numbersToSkip = new Set([]);
			for(const multipliers of new Set([-1, 0, 1]).cartesianPower(specialSumArray.length)) {
				const numToSkip = specialSumArray.map((v, i) => v * multipliers[i]).sum();
				if(numToSkip > 0) {
					if(multipliers.count(-1) + 1 < multipliers.count(1)) {
						upperBound = Math.min(upperBound, numToSkip);
					}
					else {
						numbersToSkip.add(numToSkip);
					}
				}
			}
			numbersToSkip = [...numbersToSkip];
			return { numbersToSkip, upperBound };
		}
		else {
			return {
				numbersToSkip: [],
				upperBound: Infinity
			};
		}
	},
	isValidArray: (array, maximum, numbersToSkip) => {
		return (
			array.max() < maximum &&
			new Set(array).intersection(new Set(numbersToSkip)).size === 0
		);
	},
	specialSet: (size, specialSumArray = [], upperBound = Infinity, numbersToSkip = []) => {
		/*
		Returns a special set (in array form, in ascending order) with the given size, starting with the contents of specialSumArray.
		All numbers will be lower than `upperBound`, and will not include anything in `numbersToSkip`.
		`specialSumArray`, `upperBound`, and `numbersToSkip` are mostly just used internally.
		*/
		if(specialSumArray.length === size) {
			if(problem103.isValidArray(specialSumArray, upperBound, numbersToSkip)) {
				return specialSumArray;
			}
			return null;
		}
		let lowestSetArray = null;
		let lowestSum = Infinity;
		for(
			let nextNumber = specialSumArray.length ? specialSumArray.max() + 1 : Math.max(size - 1, 1);
			nextNumber < upperBound && nextNumber < lowestSum;
			nextNumber ++
		) {
			if(numbersToSkip.includes(nextNumber)) {
				continue;
			}

			const newSpecialSumArray = [...specialSumArray, nextNumber];
			const {
				numbersToSkip: newNumbersToSkip,
				upperBound: newUpperBound
			} = problem103.invalidNumbers(newSpecialSumArray);
			if(size - newSpecialSumArray.length > newUpperBound - newSpecialSumArray.max() - 1) {
				continue;
			}

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
	[3, [2, 3, 4]],
	[4, [3, 5, 6, 7]],
	// [5, [6, 9, 11, 12, 13]],
	// [6, [11, 18, 19, 20, 22, 25]]
]);
// testing.testUnit("problem103.specialSet()");
testing.runTestByName("problem103.specialSet() - test case 4");
