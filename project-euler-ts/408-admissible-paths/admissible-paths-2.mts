import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";

const getInadmissiblePoints = (gridSize: number) => {
	const points = new HashSet<Vector>();
	for(let x = 1; x ** 2 <= gridSize; x ++) {
		for(let y = 1; x ** 2 + y ** 2 <= gridSize; y ++) {
			const sum = x ** 2 + y ** 2;
			if(Math.floor(Math.sqrt(sum)) ** 2 === sum) {
				points.add(new Vector(x, y));
			}
		}
	}
	return points;
};

const inadmissiblePathsTo = (point: Vector, inadmissiblePoints: HashSet<Vector>) => {
	let result = 0;
	for(const inadmissible of inadmissiblePoints) {
		const newInadmissibles = inadmissiblePoints.filter(p => p.x <= inadmissible.x && p.y <= inadmissible.y && !p.equals(inadmissible));
		newInadmissibles.delete(point);
		const paths1 = admissiblePathsTo(inadmissible, newInadmissibles);
		const paths2 = MathUtils.binomial(point.x - inadmissible.x, point.y - inadmissible.y);
		result += paths1 * paths2;
	}
	return result;
};

const admissiblePathsTo = (point: Vector, inadmissiblePoints: HashSet<Vector>) => {
	const totalPaths = MathUtils.binomial(point.x + point.y, point.x);
	return totalPaths - inadmissiblePathsTo(point, inadmissiblePoints);
};

export const admissiblePaths = (gridSize: number) => {
	return admissiblePathsTo(
		new Vector(gridSize, gridSize),
		getInadmissiblePoints(gridSize)
	);
};
