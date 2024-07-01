import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const UPPER_BOUND = 10 ** 12;

const adjacentPartitions = function*<T>(elements: T[]): Generator<T[][]> {
	if(elements.length === 1) {
		yield [elements];
	}
	else {
		const firstElement = elements[0];
		for(const partition of adjacentPartitions(elements.slice(1))) {
			const firstPart = partition[0];
			yield [[firstElement], ...partition];
			yield [[firstElement, ...firstPart], ...partition.slice(1)];
		}
	}
};

const isSNumber = (num: number) => {
	const digits = `${num}`.split("").map(n => Number.parseInt(n));
	for(const partition of adjacentPartitions(digits)) {
		const numbers = partition.map(digits => Number.parseInt(digits.join("")));
		const sum = MathUtils.sum(numbers);
		if(numbers.length >= 2 && sum ** 2 === num) {
			return true;
		}
	}
	return false;
};

const solve = (upperBound: number = UPPER_BOUND) => {
	const sNumbers = Utils.range(1, Math.sqrt(upperBound)).map(n => n ** 2).filter(n => isSNumber(n));
	return MathUtils.sum(sNumbers);
};
console.log(solve());
