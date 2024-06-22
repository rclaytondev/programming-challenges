const getDigits = (num: number) => [...num.toString()].map(s => Number.parseInt(s));
const TRIPLES = [...new Set([
	319,680,180,690,129,620,762,689,762,318,
	368,710,720,710,629,168,160,689,716,731,
	736,729,316,729,729,710,769,290,719,680,
	318,389,162,289,162,718,729,319,790,680,
	890,362,319,760,316,729,380,319,728,716
])].map(getDigits);

const allTuples = function*<T>(elements: T[], tupleSize: number): Generator<T[]> {
	if(tupleSize === 0) { yield []; }
	else {
		for(const firstElement of elements) {
			for(const tuple of allTuples(elements, tupleSize - 1)) {
				yield [firstElement, ...tuple];
			}
		}
	}
};

export const solve = () => {
	outerLoop: for(let codeLength = 3; codeLength < Infinity; codeLength ++) {
		codeLoop: for(const code of allTuples([0, 1, 2, 3, 4, 5, 6, 7, 8, 9], codeLength)) {
			for(const triple of TRIPLES) {
				const firstIndex = code.indexOf(triple[0]);
				const lastIndex = code.indexOf(triple[2]);
				if(firstIndex === -1 || lastIndex === -1) {
					continue codeLoop;
				}
				if(!(code.slice(firstIndex + 1, lastIndex).includes(triple[1]))) {
					continue codeLoop;
				}
			}
			console.log(`the code is ${code.join("")}`);
			break outerLoop;
		}
	}
};
