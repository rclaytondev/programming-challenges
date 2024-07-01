import { Utils } from "../../utils-ts/modules/Utils.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { Tree } from "../../utils-ts/modules/math/Tree.mjs";

const UPPER_BOUND = 10 ** 12;

export const isSNumber = (num: number) => {
	type PartialPartition = { size: number, values: number[] };

	const digits = `${num}`.split("").map(n => Number.parseInt(n));
	for(const partition of Tree.leaves({ size: 0, values: [] }, function*(partition: PartialPartition) {
		const largestPossibleSum = (
			MathUtils.sum(partition.values.slice(0, partition.values.length - 1))
			+ Number.parseInt(
				(partition.values[partition.values.length - 1] ?? 0).toString() 
				+ digits.slice(partition.size).join("")
			)
		);
		if(
			partition.size < digits.length && 
			MathUtils.sum(partition.values) ** 2 <= num &&
			largestPossibleSum ** 2 >= num
		) {
			const nextDigit = digits[partition.size];
			yield {
				size: partition.size + 1,
				values: [...partition.values, nextDigit]
			};
			if(partition.values.length > 0) {
				yield {
					size: partition.size + 1,
					values: [
						...partition.values.slice(0, partition.values.length - 1),
						Number.parseInt(partition.values[partition.values.length - 1].toString() + nextDigit.toString())
					]
				};
			}
		}
	})) {
		if(partition.values.length >= 2 && MathUtils.sum(partition.values) ** 2 === num) {
			return true;
		}
	}
	return false;
};

const solve = (upperBound: number = UPPER_BOUND) => {
	let iterations = 0;
	const sNumbers = Utils.range(1, Math.sqrt(upperBound)).map(n => n ** 2).filter(n => {
		iterations ++;
		if(iterations % 200 === 0) {
			console.log(`finished ${iterations} iterations out of ${Math.sqrt(upperBound)} (proportion complete: ${(iterations / Math.sqrt(upperBound)).toFixed(4)})`);
		}
		return isSNumber(n);
	});
	return MathUtils.sum(sNumbers);
};
console.log(solve());
