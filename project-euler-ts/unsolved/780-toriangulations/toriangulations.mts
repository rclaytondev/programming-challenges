import { Vector } from "../../../utils-ts/modules/geometry/Vector.mjs";
import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";
import { SqrtPlusRational } from "../../solved/64-odd-period-square-roots/odd-period-square-roots.mjs";

export abstract class Toriangulation {
	/* Used for visualization. */
	xOffsets: number[];
	xStep: number;
	symmetry1: Vector;
	symmetry2: Vector;

	constructor(xOffsets: number[], xStep: number, symmetry1: Vector, symmetry2: Vector) {
		this.xOffsets = xOffsets;
		this.xStep = xStep;
		this.symmetry1 = symmetry1;
		this.symmetry2 = symmetry2;
	}

	log() {
		const symmetry1Row = new Vector(this.symmetry1.x, this.symmetry1.y * Math.sqrt(3) / 2);
		const symmetry2Row = new Vector(this.symmetry2.x, this.symmetry2.y * Math.sqrt(3) / 2);
		console.log(`dot product: ${symmetry1Row.dot(symmetry2Row)}`);

		const torusSide1 = symmetry1Row.magnitude();
		const torusSide2 = symmetry2Row.magnitude();
		console.log(`torus dimensions: ${torusSide1} by ${torusSide2}`);

		const area = torusSide1 * torusSide2;
		const AREA_OF_TRIANGLE = Math.sqrt(3) / 4;
		const triangles = area / AREA_OF_TRIANGLE;
		console.log(`number of triangles: ${triangles}`);
	}

	abstract getDisplayText(): string;
}

export class SameYToriangulation extends Toriangulation {
	y: number;
	xDist: number;
	sign: 1 | -1;

	constructor(y: number, xDist: number, sign: 1 | -1) {
		const discriminant = xDist ** 2 - 3 * y ** 2;
		const x1 = (-xDist + sign * Math.sqrt(discriminant)) / 2;
		const x2 = (xDist + sign * Math.sqrt(discriminant)) / 2;
		super(
			new Array(Math.abs(y)).fill(0),
			x1 / y,
			new Vector(x1, y),
			new Vector(x2, y),
		);

		this.y = y;
		this.xDist = xDist;
		this.sign = sign;
	}

	getDisplayText(): string {
		return `SameY: y=${this.y}, xDist=${this.xDist}, sign=${this.sign}`;
	}
}

export class DifferentYToriangulation extends Toriangulation {
	y1: number;
	y2: number;
	triangles: number;
	xSign: 1 | -1;

	constructor(y1: number, y2: number, triangles: number, xSign: 1 | -1) {
		const gcd = MathUtils.gcd(y1, y2);
		const [xStep, x1, x2] = Problem780.getXStep(y1, y2, xSign, triangles);
		super(
			new Array(gcd).fill(0),
			xStep.toNumber(),
			new Vector(x1.toNumber(), y1),
			new Vector(x2.toNumber(), y2),
		);

		this.y1 = y1;
		this.y2 = y2;
		this.triangles = triangles;
		this.xSign = xSign;
	}

	getDisplayText(): string {
		return `DifferentY: y1=${this.y1}, y2=${this.y2}, m=${this.triangles / 2}, sign=${this.xSign}`;
	}
}

export class TrivialToriangulation extends Toriangulation {
	width: number;
	height: number;

	constructor(width: number, height: number, rotate90: boolean = false) {
		const offsets = ((height % 2 === 0)
			? new Array(Math.abs(height)).fill(0).map((v, i) => i % 2 === 0 ? 1/2 : 0)
			: new Array(Math.abs(height)).fill(0)
		);
		if(rotate90) {
			super(
				offsets,
				0,
				new Vector(0, height),
				new Vector(width, 0),
			);
		}
		else {
			super(
				offsets,
				0,
				new Vector(width, 0),
				new Vector(0, height),
			);
		}
		this.width = width;
		this.height = height;
	}

	getDisplayText(): string {
		return `Trivial: width=${this.width}, height=${this.height} * sqrt(3)/2`;
	}
}

export class Problem780 {
	static nontrivialToriangulations(triangles: number, triangleMode: "exact" | "upper-bound") {
		/*
		Returns the number of toriangulations coming from orthogonal pairs of translational symmetries that have different y-values.
		*/
		const toriangulations: DifferentYToriangulation[] = [];
		if(triangleMode === "upper-bound") {
			for(let m = 2; m <= triangles; m += 2) {
				for(const toriangulation of Problem780.nontrivialToriangulations(m, "exact")) {
					toriangulations.push(toriangulation);
				}
			}
			return toriangulations;
		}

		for(let y1 = 1; 3 * y1 ** 2 <= (triangles / 2) ** 2; y1 ++) {
			for(let y2 = 1; 3 * (y1 * y2) ** 2 <= (triangles / 2) ** 2; y2 ++) {
				for(const triangleSign of [1, -1]) {
					const bothSigns = (triangles / 2 !== 2 * y1 * y2);
					for(const xSign of bothSigns ? ([1, -1] as const) : ([1] as const)) {
						const isValid = Problem780.isToriangulationValid(y1, -y2, xSign, triangles * triangleSign);
						if(isValid) {
							toriangulations.push(new DifferentYToriangulation(y1, -y2, triangles * triangleSign, xSign));
						}
						else {
							Problem780.isToriangulationValid(y1, -y2, xSign, triangles * triangleSign);
						}
					}
				}
			}
		}
		return toriangulations;
	}
	static discriminant(y1: number, y2: number, triangles: number) {
		return (triangles / 2) ** 2 - 3 * (y1 * y2) ** 2;
	}
	static getXStep(y1: number, y2: number, xSign: 1 | -1, triangles: number, discriminant?: number) {
		discriminant ??= Problem780.discriminant(y1, y2, triangles);
		const x1 = new SqrtPlusRational(discriminant, xSign, -(triangles / 2), 2 * y2);
		const x2 = new SqrtPlusRational(discriminant, xSign, (triangles / 2), 2 * y1);
		const [s1, s2] = MathUtils.bezoutCoefficients(y1, y2);
		const x = x1.multiplyByInteger(s1).add(x2.multiplyByInteger(s2));
		return [x, x1, x2] as [SqrtPlusRational, SqrtPlusRational, SqrtPlusRational];
	}
	static isToriangulationValid(y1: number, y2: number, xSign: 1 | -1, triangles: number) {
		if(triangles % 2 !== 0) { return false; }

		const discriminant = Problem780.discriminant(y1, y2, triangles);
		if(discriminant < 0) { return 0; }
		const gcd = MathUtils.gcd(y1, y2);
		const k1 = y1 / gcd;
		const k2 = y2 / gcd;
		const [x, x1, x2] = Problem780.getXStep(y1, y2, xSign, triangles, discriminant);
		const x1Valid = x.multiplyByInteger(k1).subtract(x1).isInteger();
		const x2Valid = x.multiplyByInteger(k2).subtract(x2).isInteger();
		return x1Valid && x2Valid;
	}

	static trivialToriangulations(triangles: number, triangleMode: "exact" | "upper-bound") {
		const toriangulations: TrivialToriangulation[] = [];
		if(triangleMode === "upper-bound") {
			for(let i = 2; i <= triangles; i += 2) {
				for(const toriangulation of Problem780.trivialToriangulations(i, "exact")) {
					toriangulations.push(toriangulation);
				}
			}
			return toriangulations;
		}

		if(triangles % 2 !== 0) { return []; }

		for(const a of MathUtils.divisors(triangles / 2)) {
			const b = (triangles / 2) / a;
			if(b % 2 === 1) {
				toriangulations.push(new TrivialToriangulation(a, b, false));
				toriangulations.push(new TrivialToriangulation(a, b, true));
			}
		}
		return toriangulations;
	}

	static toriangulations(triangles: number, triangleMode: "exact" | "upper-bound") {
		const trivial = Problem780.trivialToriangulations(triangles, triangleMode);
		const nontrivial = Problem780.nontrivialToriangulations(triangles, triangleMode);
		return [...trivial, ...nontrivial];
	}
}

// console.log(Problem780.toriangulations(6, "exact"));
// debugger;
