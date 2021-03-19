const nthPentagonalNum = (n) => n * (3 * n - 1) / 2;
const indexInPentagonals = (n) => (1/2 + Math.sqrt(1/4 + 6 * n)) / 3;
const isPentagonal = (number) => {
	const index = indexInPentagonals(number);
	return index === Math.round(index);
};

const solve = () => {
	debugger;
	let possiblePentagonals = [1];
	let pentagonalPairs = [];
	let indexOfLastAdded = 1;
	loop1: for(let i = 1; i < Infinity; i ++) {
		const pentagonalDifference = nthPentagonalNum(i);
		for(let j = indexOfLastAdded + 1; j < Infinity; j ++) {
			const pentagonal1 = nthPentagonalNum(j - 1);
			const pentagonal2 = nthPentagonalNum(j);
			const difference = pentagonal2 - pentagonal1;
			if(difference > pentagonalDifference) {
				break;
			}
			else {
				indexOfLastAdded = j;
				possiblePentagonals.forEach(pentagonal => {
					pentagonalPairs.push([pentagonal, pentagonal2]);
				});
				possiblePentagonals.push(pentagonal2);
			}
		}

		for(let j = 0; j < pentagonalPairs.length; j ++) {
			const pair = pentagonalPairs[j];
			const [p1, p2] = pair;
			const sum = p1 + p2;
			const difference = p2 - p1;
			if(difference < pentagonalDifference) {
				pentagonalPairs.splice(j, 1);
				j --;
				continue;
			}
			else if(difference === pentagonalDifference && isPentagonal(sum)) {
				console.log(`${p2} - ${p1} = ${difference}; ${p2} + ${p1} = ${sum}.`);
				return difference;
			}
		}
		if(i % 10 === 0) {
			console.log(`checked up to d=${pentagonalDifference}`);
		}
	}
};
