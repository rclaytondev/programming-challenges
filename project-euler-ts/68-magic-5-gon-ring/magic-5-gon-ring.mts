import { Utils } from "../../utils-ts/modules/Utils.mjs";

type ValuesType = [
	[number, number, number],
	[number, number, number],
	[number, number, number],
	[number, number, number],
	[number, number, number],
];

export class PartialSolution {
	values: ValuesType;

	constructor(values: ValuesType) {
		this.values = values;
	}
	static empty() {
		return new PartialSolution([
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
			[0, 0, 0],
		]);
	}

	copy() {
		return new PartialSolution(this.values.map(a => [...a]) as ValuesType);
	}
	nextIndex(index: number) {
		return (index + 1) % 5;
	}
	previousIndex(index: number) {
		return (index === 0) ? 4 : (index - 1);
	}
	setOuter(index: number, value: number) {
		this.values[index][2] = value;
	}
	setMiddle(index: number, value: number) {
		const previousIndex = this.previousIndex(index);
		this.values[previousIndex][0] = value;
		this.values[index][1] = value;
	}
	setInner(index: number, value: number) {
		const nextIndex = this.nextIndex(index);
		this.setMiddle(nextIndex, value);
	}
	set(index: number, which: "outer" | "middle" | "inner", value: number) {
		if(which === "outer") {
			this.setOuter(index, value);
		}
		else if(which === "middle") {
			this.setMiddle(index, value);
		}
		else {
			this.setInner(index, value);
		}
	}

	sum(index: number) {
		const values = this.values[index];
		if(values.includes(0)) { return 0; }
		return values;
	}
	isValid() {
		const sums = new Set(this.values.map((_, i) => this.sum(i)).filter(s => s !== 0));
		return sums.size <= 1;
	}
	isComplete() {
		return !this.values.flat(1).includes(0);
	}

	firstUnusedSpot() {
		for(const [i, line] of this.values.entries()) {
			if(line[0] === 0) {
				return [i, "inner"] as const;
			}
			if(line[1] === 0) {
				return [i, "middle"] as const;
			}
			if(line[2] === 0) {
				return [i, "outer"] as const;
			}
		}
		return null;
	}
	nextSteps() {
		if(!this.isValid()) { return []; }
		const unused = Utils.range(1, 10).filter(n => !this.values.flat(1).includes(n));
		const firstUnusedSpot = this.firstUnusedSpot();
		if(firstUnusedSpot === null) { return []; }
		const [index, which] = firstUnusedSpot;
		return unused.map(unusedValue => {
			const copy = this.copy();
			copy.set(index, which, unusedValue);
			return copy;
		});
	}

	encoding() {
		const startIndex = Utils.minIndex(this.values, values => values[2]);
		let index = startIndex;
		let result = "";
		for(let i = 0; i < 5; i ++) {
			result += this.values[index][2] + this.values[index][1] + this.values[index][0];;
			index = this.nextIndex(index);
		}
		return Number.parseInt(result);
	}
}

const largestEncoding = (partialSolution: PartialSolution): number => {
	// console.log(partialSolution.values);
	// debugger;
	if(partialSolution.isComplete() && partialSolution.isValid()) {
		debugger;
		return partialSolution.encoding();
	}
	return Math.max(...partialSolution.nextSteps().map(s => largestEncoding(s)));
};

console.time();
console.log(largestEncoding(PartialSolution.empty()));
console.timeEnd();
debugger;
