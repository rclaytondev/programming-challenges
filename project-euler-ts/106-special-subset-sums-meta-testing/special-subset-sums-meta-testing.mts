import { ArrayUtils } from "../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { SetUtils } from "../../utils-ts/modules/core-extensions/SetUtils.mjs";
import { GenUtils } from "../../utils-ts/modules/core-extensions/GenUtils.mjs";
import { Utils } from "../../utils-ts/modules/Utils.mjs";

const mustBeChecked = (set1: number[], set2: number[]) => {
	if(set1.sort((a, b) => a-b).join(",") < set2.sort((a, b) => a-b).join(",")) {
		return false;
	}
	injectionLoop: for(const injection of Utils.injections(set1, set2)) {
		let allGreater = true;
		let allSmaller = true;
		for(const [x, y] of injection) {
			if(x < y) { allGreater = false; }
			if(x > y) { allSmaller = false; }
			if(!allGreater && !allSmaller) { continue injectionLoop; }
		}
		return false;
	}
	return true;
};

export const requiredSubsetPairs = (size: number) => {
	let required = 0;
	const set = ArrayUtils.range(1, size);
	for(const subset1 of GenUtils.subsets(set)) {
		for(const subset2 of GenUtils.subsets(set.filter(s => !subset1.has(s)), subset1.size)){
			if(mustBeChecked([...subset1], [...subset2])) {
				required ++;
			}
		}
	}
	return required;
};

// console.time();
// console.log(requiredSubsetPairs(12));
// console.timeEnd();
// debugger;
