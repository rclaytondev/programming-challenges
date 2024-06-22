import { getArraySum } from "../utils-ts/Array.mjs";
import { Sequence } from "../utils-ts/Sequence.mjs";
import { Tree } from "../utils-ts/Tree.mjs";

const TRIANGULARS = [...new Sequence(n => n * (n + 1) / 2).termsBetween(1000, 10000)];
const SQUARES = [...new Sequence(n => n ** 2).termsBetween(1000, 10000)];
const PENTAGONALS = [...new Sequence(n => n * (3 * n - 1) / 2).termsBetween(1000, 10000)];
const HEXAGONALS = [...new Sequence(n => n * (2 * n - 1)).termsBetween(1000, 10000)];
const HEPTAGONALS = [...new Sequence(n => n * (5 * n - 3) / 2).termsBetween(1000, 10000)];
const OCTAGONALS = [...new Sequence(n => n * (3 * n - 2)).termsBetween(1000, 10000)];

const POLYGONAL_TYPES = [TRIANGULARS,  SQUARES, PENTAGONALS, HEXAGONALS, HEPTAGONALS, OCTAGONALS];
// const ALL_POLYGONALS = POLYGONAL_TYPES.flat().sort();
// const DUPLICATES = ALL_POLYGONALS.filter((num, index) => num === ALL_POLYGONALS[index + 1]);
// for(const polygonalType of POLYGONAL_TYPES) {
// 	for(let i = polygonalType.length - 1; i >= 0; i --) {
// 		if(DUPLICATES.includes(polygonalType[i])) {
// 			console.log(`removed ${polygonalType[i]}`);
// 			polygonalType.splice(i, 1);
// 		}
// 	}
// }

const solve = () => {
	type PartialResult = { numbers: number[], polygonalsUsed: number[][] };
	const EMPTY_RESULT: PartialResult = { numbers: [], polygonalsUsed: [] };
	const results = [...Tree.leaves(EMPTY_RESULT, function*(partialResult: PartialResult) {
		const lastNumber = partialResult.numbers[partialResult.numbers.length - 1];
		for(const polygonalType of POLYGONAL_TYPES.filter(p => !partialResult.polygonalsUsed.includes(p))) {
			for(const polygonalNumber of polygonalType) {
				if(
					(partialResult.numbers.length === 0 || `${polygonalNumber}`.slice(0, 2) === `${lastNumber}`.slice(2, 4)) &&
					(partialResult.numbers.length !== POLYGONAL_TYPES.length - 1 || `${polygonalNumber}`.slice(2, 4) === `${partialResult.numbers[0]}`.slice(0, 2))
				) {
					console.log(`[${[...partialResult.numbers, polygonalNumber].join(", ")}]`);
					yield {
						numbers: [...partialResult.numbers, polygonalNumber],
						polygonalsUsed: [...partialResult.polygonalsUsed, polygonalType]
					};
				}
			}
		}
	})].filter(partialResult => partialResult.numbers.length === POLYGONAL_TYPES.length);
	console.log(`the tuples are ${results.map(r => `[${r.numbers.join(", ")}]`)}`);
	return getArraySum(results[0].numbers);
};
