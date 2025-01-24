import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { allSculptures, SculpturesCounter } from "./balanced-sculptures-2.mjs";
import { PartialSculpture } from "./balanced-sculptures.mjs";

const compare = (blocks: number) => {
	const result1 = new HashSet(PartialSculpture.allSculptures(blocks));
	const result2 = new HashSet(allSculptures(blocks));
	console.log(`number of sculptures found: ${result1.size} (old) vs ${result2.size} (new)`);
	console.log(`sculptures found by the first algorithm but not by the second algorithm:`);
	const firstButNotSecond = result1.difference(result2);
	const secondButNotFirst = result2.difference(result1);
	for(const sculpture of firstButNotSecond) {
		console.log(SculpturesCounter.visualize(sculpture));
	}
	console.log(`sculptures found by the second algorithm but not by the first algorithm:`);
	for(const sculpture of secondButNotFirst) {
		console.log(SculpturesCounter.visualize(sculpture));
	}
	debugger;
};
compare(9);
