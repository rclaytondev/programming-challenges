import { ArrayUtils } from "../../../utils-ts/modules/core-extensions/ArrayUtils.mjs";
import { Vector } from "../../../utils-ts/modules/geometry/Vector.mjs";
import { BigintMath } from "../../../utils-ts/modules/math/BigintMath.mjs";

export class ColoredRectangle {
	readonly width: number;
	readonly height: number;
	readonly leftColors: number[] | null;
	readonly rightColors: number[] | null;
	readonly topColors: number[] | null;
	readonly bottomColors: number[] | null;
	readonly maxColors: number;

	constructor(width: number, height: number, maxColors: number, leftColors: number[] | null, rightColors: number[] | null, topColors: number[] | null, bottomColors: number[] | null) {
		if(
			(leftColors && leftColors.length !== height)
			|| (rightColors && rightColors.length !== height)
			|| (topColors && topColors.length !== width)
			|| (bottomColors && bottomColors.length !== width)
		) {
			throw new Error("Invalid arguments to ColoredRectangle constructor; expected the number of colors on each edge to match the width or height.");
		}

		this.width = width;
		this.height = height;
		this.maxColors = maxColors;
		this.leftColors = leftColors;
		this.rightColors = rightColors;
		this.topColors = topColors;
		this.bottomColors = bottomColors;
	}
	static empty(width: number, height: number, maxColors: number) {
		return new ColoredRectangle(width, height, maxColors, null, null, null, null);
	}
	static coloringSum(width: number, height: number, maxColors: number) {
		let sum = 0n;
		for(let i = 1; i <= maxColors; i ++) {
			sum += ColoredRectangle.empty(width, height, i).colorings();
		}
		return sum;
	}

	transpose() {
		return new ColoredRectangle(this.height, this.width, this.maxColors, this.topColors, this.bottomColors, this.leftColors, this.rightColors);
	}
	reflectX() {
		return new ColoredRectangle(
			this.width, this.height, this.maxColors,
			this.rightColors, this.leftColors,
			this.topColors?.toReversed() ?? null, this.bottomColors?.toReversed() ?? null,
		);
	}
	reflectY() {
		return new ColoredRectangle(
			this.width, this.height, this.maxColors,
			this.leftColors?.toReversed() ?? null, this.rightColors?.toReversed() ?? null,
			this.bottomColors, this.topColors,
		);
	}

	static calls = 0;
	colorings(splitMode: "top" | "middle" = "middle") {
		ColoredRectangle.calls ++;
		if(this.width === 0 || this.height === 0) {
			return 1n;
		}

		if(splitMode === "top") {
			return this.coloringsByTopRow();
		}
		else {
			let result;
			const normalized = this.normalize();
			const cacheKey = normalized.cacheKey();
			const precomputed = ColoredRectangle.coloringsCache.get(cacheKey);
			if(precomputed != undefined) { return precomputed; }

			if(normalized.height % 2 === 1) {
				result = normalized.coloringsBySplitRow((normalized.height - 1) / 2, "middle", "middle");
			}
			else {
				result = normalized.coloringsBySplitRow(normalized.height / 2 - 1, "middle", "top");
			}
			ColoredRectangle.coloringsCache.set(cacheKey, result);
			return result;
		}
	}
	coloringsBySplitRow(rowY: number, topSplit: "top" | "middle", bottomSplit: "top" | "middle") {
		const rowCombinations = this.rowCombinations(rowY);
		const maxColorUsed = this.maxColorUsed();
		let colorings = 0n;
		for(const row of rowCombinations) {
			const recolorings = this.rowRecolorings(maxColorUsed, Math.max(...row));
			const topHalf = this.splitTop(rowY, row);
			const bottomHalf = this.splitBottom(rowY, row);
			const topHalfColorings = topHalf.colorings(topSplit);
			const bottomHalfColorings = bottomHalf.colorings(bottomSplit);
			colorings += recolorings * topHalfColorings * bottomHalfColorings;
		}
		return colorings;
	}
	coloringsByTopRow() {
		if(this.topColors === null || this.leftColors !== null || this.rightColors !== null || this.bottomColors !== null) {
			return this.coloringsBySplitRow(0, "middle", "middle");
		}

		const rowCombinations = ColoredRectangle.empty(this.width, this.height, this.maxColors).rowCombinations(0, -1);
		let result = 0n;
		for(const row of rowCombinations) {
			const rect = new ColoredRectangle(this.width, this.height - 1, this.maxColors, null, null, this.topColors, null);
			const colorings = rect.colorings("middle");
			const recolorings = ColoredRectangle.topRowRecolorings(this.topColors, row, this.maxColors);
			result += colorings * recolorings;
		}
		return result;
	}


	static topRowRecolorings(topRow: number[], row: number[], maxColors: number) {
		const maxColorUsed = Math.max(...topRow);
		const rowMax = Math.max(...row);
		const possibleColors = new Array(rowMax + 1).fill(0).map(_ => new Set(ArrayUtils.range(0, maxColorUsed)));
		for(const [i, templateColor] of row.entries()) {
			possibleColors[templateColor].delete(topRow[i]);
		}
		return ColoredRectangle.injectiveMaps(
			possibleColors.map(s => [...s]),
			maxColors - maxColorUsed - 1,
		);
	}
	private static injectiveMaps(possibleOutputs: number[][], unusedCodomain: number) {
		if(possibleOutputs.length === 0) { return 1n; }
		let result = 0n;
		for(const next of possibleOutputs[0]) {
			result += ColoredRectangle.injectiveMaps(
				possibleOutputs.slice(1).map(s => s.filter(n => n !== next)),
				unusedCodomain,
			);
		}
		if(unusedCodomain > 0) {
			const remaining = ColoredRectangle.injectiveMaps(
				possibleOutputs.slice(1),
				unusedCodomain - 1,
			);
			result += BigInt(unusedCodomain) * remaining;
		}
		return result;
	}

	
	static coloringsCache = new Map<string, bigint>();
	cacheKey() {
		return `${this.width}, ${this.height}, ${this.maxColors}: ${this.leftColors}; ${this.rightColors}; ${this.topColors}; ${this.bottomColors}`;
	}
	static normalize(nums: number[]) {
		const result = [];
		const numsFound = new Map<number, number>();
		for(const num of nums) {
			const numFound = numsFound.get(num);
			if(numFound == undefined) {
				result.push(numsFound.size);
				numsFound.set(num, numsFound.size);
			}
			else {
				result.push(numFound);
			}
		}
		return result;
	}
	normalizeColors() {
		const colors = [...(this.leftColors ?? []), ...(this.rightColors ?? []), ...(this.topColors ?? []), ...(this.bottomColors ?? [])];
		const normalized = ColoredRectangle.normalize(colors);
		let index = 0;
		let leftColors, rightColors, topColors, bottomColors;
		if(this.leftColors !== null) {
			leftColors = normalized.slice(index, index + this.height);
			index += this.height;
		}
		else { leftColors = null; }

		if(this.rightColors !== null) {
			rightColors = normalized.slice(index, index + this.height);
			index += this.height;
		}
		else { rightColors = null; }

		if(this.topColors !== null) {
			topColors = normalized.slice(index, index + this.width);
			index += this.width;
		}
		else { topColors = null; }

		if(this.bottomColors !== null) {
			bottomColors = normalized.slice(index, index + this.width);
		}
		else { bottomColors = null; }

		return new ColoredRectangle(this.width, this.height, this.maxColors, leftColors, rightColors, topColors, bottomColors);
	}
	normalize() {
		const untransposedRowSize = this.width * ((this.height % 2 === 0) ? 2 : 1);
		const transposedRowSize = this.height * ((this.width % 2 === 0) ? 2 : 1);
		const candidates = (
			(transposedRowSize === untransposedRowSize) ? [this, this.transpose()]
			: (transposedRowSize < untransposedRowSize) ? [this.transpose()]
			: [this]
		);
		const reflections = candidates.flatMap(r => [r, r.reflectX()]).flatMap(r => [r, r.reflectY()]);
		const recolorings = reflections.map(r => r.normalizeColors());
		return (
			recolorings
			.map(r => [r, r.cacheKey()] as [ColoredRectangle, string])
			.reduce(([r1, s1], [r2, s2]) => (s1 < s2) ? [r1, s1] : [r2, s2])
		)[0];
	}

	static rowCombinationsCache = new Map<string, number[][]>();
	rowCombinations(rowY: number, maxColorUsed: number = this.maxColorUsed()) {
		if((rowY === 0 && this.topColors !== null) || (rowY === this.height - 1 && this.bottomColors !== null)) {
			return this.rowCombinationsHelper(rowY, [], maxColorUsed);
		}
		const left = (this.leftColors === null) ? null : this.leftColors[rowY];
		const right = (this.rightColors === null) ? null : this.rightColors[rowY];
		const cacheKey = `${left}, ${right}, ${this.width}, ${this.maxColors}, ${maxColorUsed}`;
		const precomputed = ColoredRectangle.rowCombinationsCache.get(cacheKey);
		if(precomputed !== undefined) {
			return precomputed;
		}
		const result = this.rowCombinationsHelper(rowY, [], maxColorUsed);
		ColoredRectangle.rowCombinationsCache.set(cacheKey, result);
		return result;
	}
	private rowCombinationsHelper(rowY: number, row: number[] = [], maxColorUsed: number = Math.max(...row, this.maxColorUsed())): number[][] {
		if(row.length === this.width) {
			return [row];
		}
		const point = new Vector(row.length, rowY);
		const neighbors = [
			...this.neighborColors(point),
			...(row.length === 0 ? [] : [row[row.length - 1]]),
		];
		const result: number[][] = [];
		for(let next = 0; next <= maxColorUsed; next ++) {
			if(!neighbors.includes(next)) {
				result.push(...this.rowCombinationsHelper(
					rowY,
					[...row, next],
					maxColorUsed,
				));
			}
		}
		if(maxColorUsed + 1 < this.maxColors) {
			result.push(...this.rowCombinationsHelper(
				rowY,
				[...row, maxColorUsed + 1],
				maxColorUsed + 1,
			));
		}
		return result;
	}

	rowRecolorings(maxColorUsed: number, newMaxColorUsed: number) {
		const remainingColors = this.maxColors - (maxColorUsed + 1);
		return BigintMath.permutation(BigInt(remainingColors), BigInt(Math.max(0, newMaxColorUsed - maxColorUsed)));
	}

	maxColorUsed() {
		return Math.max(
			-1,
			...(this.leftColors ?? []),
			...(this.rightColors ?? []),
			...(this.topColors ?? []),
			...(this.bottomColors ?? []),
		);
	}
	neighborColors(point: Vector) {
		const result: (number | undefined)[] = [];
		if(point.y === 0) {
			result.push((this.topColors ?? [])[point.x]);
		}
		if(point.y === this.height - 1) {
			result.push((this.bottomColors ?? [])[point.x]);
		}
		if(point.x === 0) {
			result.push((this.leftColors ?? [])[point.y]);
		}
		if(point.x === this.width - 1) {
			result.push((this.rightColors ?? [])[point.y]);
		}
		return result.filter(v => v !== undefined);
	}

	splitTop(rowY: number, row: number[]) {
		return new ColoredRectangle(
			this.width,
			rowY,
			this.maxColors,
			this.leftColors?.slice(0, rowY) ?? null,
			this.rightColors?.slice(0, rowY) ?? null,
			this.topColors,
			row,
		);
	}
	splitBottom(rowY: number, row: number[]) {
		return new ColoredRectangle(
			this.width,
			this.height - rowY - 1,
			this.maxColors,
			this.leftColors?.slice(rowY + 1) ?? null,
			this.rightColors?.slice(rowY + 1) ?? null,
			row,
			this.bottomColors,
		);
	}

	toString() {
		const colorsToString = (colors: number[] | null) => colors === null ? "null" : `[${colors}]`;
		return `${this.width}x${this.height} with ${this.maxColors} colors; ${colorsToString(this.leftColors)}, ${colorsToString(this.rightColors)}, ${colorsToString(this.topColors)}, ${colorsToString(this.bottomColors)}`;
	}
}

// (() => {
// 	const rectangle = ColoredRectangle.empty(6, 6, 90);
// 	console.time();
// 	console.log(rectangle.colorings());
// 	console.timeEnd();
// 	debugger;
// }) ();
