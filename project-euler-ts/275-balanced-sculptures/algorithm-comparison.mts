import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { allSculptures, SculpturesCounter, symmetricalSculptures } from "./balanced-sculptures-2.mjs";
import { PartialSculpture } from "./balanced-sculptures.mjs";

const compare = (label: string, result1: HashSet<HashSet<Vector>>, result2: HashSet<HashSet<Vector>>) => {
	console.log(`number of ${label} sculptures found: ${result1.size} (old) vs ${result2.size} (new)`);
	const firstButNotSecond = result1.difference(result2);
	const secondButNotFirst = result2.difference(result1);
	if(firstButNotSecond.size === 0 && secondButNotFirst.size === 0) {
		console.log(`${label} sculptures match!`);
	}
	else {
		console.log(`${label} sculptures found by the first algorithm but not by the second algorithm:`);
		for(const sculpture of firstButNotSecond) {
			console.log(SculpturesCounter.visualize(sculpture));
		}
		console.log(`${label} sculptures found by the second algorithm but not by the first algorithm:`);
		for(const sculpture of secondButNotFirst) {
			console.log(SculpturesCounter.visualize(sculpture));
		}
	}
};

const compareAll = (blocks: number) => {
	const symmetricalResult1 = new HashSet(PartialSculpture.sculptures(blocks, "symmetrical"));
	compare(
		"symmetrical",
		symmetricalResult1,
		new HashSet(symmetricalSculptures(blocks))
	);
	compare(
		"all",
		HashSet.union(symmetricalResult1, new HashSet(PartialSculpture.sculptures(blocks, "asymmetrical"))),
		new HashSet(allSculptures(blocks))
	);
	debugger;
};
// compareAll(10);
