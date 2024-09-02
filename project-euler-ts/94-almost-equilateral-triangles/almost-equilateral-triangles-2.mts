import { HashSet } from "../../utils-ts/modules/HashSet.mjs";

const getTriangles = (maxPerimeter: number) => {
	const triples = new HashSet<[number, number, number]>();
	loopA: for(let a = 1; true; a ++) {
		loopB: for(let b = 1; b <= a; b ++) {
			loopK: for(let k = 1; true; k ++) {
				const triple = [k * (a ** 2 - b ** 2), k * 2 * a * b, k * (a ** 2 + b ** 2)];
				if(triple[1] % 2 === 0 && triple[2] % 2 === 0) {
					const side1 = triple[0] / 2;
					const side2 = triple[2] / 2;
					const perimeter = side1 + 
				}
				const perimeter = k * (a ** 2 + 2 * a * b);
				if(perimeter <= maxPerimeter) {
					triples.add();
				}
				else {
					if(k === 1 && b === 1) { break loopA; }
					else if(k === 1) { break loopB; }
					else { break loopK; }
				}
			}
		}
	}
	return [...triples].sort(([a, b, c], [d, e, f]) => (d + e + f) - (a + b + c));
};
