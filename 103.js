const problem103 = {
	specialSet: (size, firstItem) => {
		debugger;
		const setArray = [firstItem];
		let upperBound = Infinity;
		const numbersToSkip = new Set([]);
		while(setArray.length < size) {
			let addedNumber = false;
			newNumberLoop: for(let i = setArray.lastItem() + 1; i < upperBound; i ++) {
				if(!([...numbersToSkip].includes(i))) {
					addedNumber = true;
					setArray.push(i);
					for(const multipliers of new Set([-1, 0, 1]).cartesianPower(setArray.length)) {
						const numberToSkip = setArray.sum((v, i) => v * multipliers[i]);
						if(numberToSkip > setArray.lastItem()) {
							numbersToSkip.add(numberToSkip);
							if(!multipliers.includes(-1)) {
								upperBound = Math.min(upperBound, numberToSkip);
							}
						}
					}
					break newNumberLoop;
				}
			}
			if(!addedNumber) {
				return null;
			}
		}
		return setArray;
	},
	minimalSpecialSet: (size) => {
		for(let i = 1; i < Infinity; i ++) {
			const set = problem103.specialSet(size, i);
			if(set != null) {
				return set;
			}
		}
	}
};

testing.addUnit("problem103.specialSet()", problem103.specialSet, [
	[1, 1, [1]],
	[2, 1, [1, 2]],
	[3, 2, [2, 3, 4]],
	[4, 3, [3, 5, 6, 7]],
	[5, 6, [6, 9, 11, 12, 13]],
	[6, 11, [11, 18, 19, 20, 22, 25]]
]);
testing.addUnit("problem103.minimalSpecialSet()", problem103.minimalSpecialSet, [
	[1, [1]],
	[2, [1, 2]],
	[3, [2, 3, 4]],
	[4, [3, 5, 6, 7]],
	[5, [6, 9, 11, 12, 13]],
	[6, [11, 18, 19, 20, 22, 25]]
]);
testing.runTestByName("problem103.specialSet() - test case 4");
