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
	specialSet: (size, specialSumArray = []) => {
		if(size === specialSumArray.length) {
			return specialSumArray;
		}
		const { numbersToSkip, upperBound } = problem103.invalidNumbers(specialSumArray);
		let lowestSumArray = null;
		let lowestSum = Infinity;
		/*
		size == 5
		specialSumArray == [4]
		No solutions will be found (see proof in 103.md)
		The upper bound is infinity (since there's only 1 item in specialSumArray)
		It will loop forever.
		*/
		for(
			let nextNumber = specialSumArray.length ? specialSumArray.max() + 1 : Math.max(1, size - 1);
			nextNumber < Math.min(upperBound, lowestSum);
			nextNumber ++
		) {
			if(numbersToSkip.includes(nextNumber)) { continue; }
			const result = problem103.specialSet(size, [...specialSumArray, nextNumber]);
			if(result != null && result.sum() < lowestSum) {
				lowestSumArray = result;
				lowestSum = result.sum();
			}
		}
		return lowestSumArray;
	},
};

testing.addUnit("problem103.specialSet()", problem103.specialSet, [
	[1, [1]],
	[2, [1, 2]],
	[3, [2, 3, 4]],
	[4, [3, 5, 6, 7]],
	[5, [6, 9, 11, 12, 13]],
	[6, [11, 18, 19, 20, 22, 25]]
]);
// testing.testUnit("problem103.specialSet()");
testing.runTestByName("problem103.specialSet() - test case 4");
