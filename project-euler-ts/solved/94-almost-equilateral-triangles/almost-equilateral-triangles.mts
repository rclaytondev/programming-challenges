import { HashSet } from "../../../utils-ts/modules/HashSet.mjs";
import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";

export class Problem94 {
	static getTriangles(maxPerimeter: number) {
		const triangles = new HashSet<[number, number]>();
		loopA: for(let m = 1; true; m ++) {
			loopB: for(let n = 1; n <= m; n ++) {
				loopK: for(let k = 1; true; k ++) {
					const a = k * (m ** 2 - n ** 2);
					const b = k * 2 * m * n;
					const c = k * (m ** 2 + n ** 2);

					const triangle1Perimeter = a + c; // sides: a, c/2, c/2 (area is always integer)
					const triangle2Perimeter = b + c; // sides: b, c/2, c/2 (area is always integer)
					if(
						a > 0 && c > 0
						&& c % 2 === 0
						&& MathUtils.dist(a, c/2) <= 1
						&& triangle1Perimeter <= maxPerimeter
					) { triangles.add([a, c/2]); }
					if(
						a > 0 && c > 0
						&& c % 2 === 0
						&& MathUtils.dist(b, c/2) <= 1
						&& triangle2Perimeter <= maxPerimeter
					) { triangles.add([b, c/2]); }
					
					if(triangle1Perimeter > maxPerimeter && triangle2Perimeter > maxPerimeter) {
						if(k === 1 && n === 1) { break loopA; }
						else if(k === 1) { break loopB; }
						else { break loopK; }
					}
				}
			}
		}
		return [...triangles].sort(([a, b], [c, d]) => (a + 2 * b) - (c + 2 * d));
	}
	static solve(maxPerimeter: number) {
		const triangles = Problem94.getTriangles(maxPerimeter);
		return MathUtils.sum(triangles.map(([x, y]) => x + 2 * y));
	}
}

// console.time();
// console.log(Problem94.solve(1_000_000_000));
// console.timeEnd();
// debugger;
