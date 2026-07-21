import { Vector } from "../../../utils-ts/modules/geometry/Vector.mjs";
import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";

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

	transpose() {
		return new ColoredRectangle(this.height, this.width, this.maxColors, this.topColors, this.bottomColors, this.leftColors, this.rightColors);
	}

	colorings(splitMode: number | "auto" = "auto") {
		if(typeof splitMode === "number") {
			return this.coloringsBySplitRow(splitMode, "auto", "auto");
		}
		else if(this.height % 2 === 1) {
			return this.coloringsBySplitRow((this.height - 1) / 2, "auto", "auto");
		}
		else {
			return this.coloringsBySplitRow(this.height / 2 - 1, "auto", 0);
		}
	}
	coloringsBySplitRow(rowY: number, topSplit: number | "auto", bottomSplit: number | "auto") {
		if(this.height % 2 === 0) {
			throw new Error("Called oddHeightColorings on a rectangle with even height.");
		}

		const rowCombinations = this.rowCombinations(rowY);
		const maxColorUsed = this.maxColorUsed();
		let colorings = 0;
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

	rowCombinations(rowY: number, row: number[] = [], maxColorUsed: number = Math.max(...row, this.maxColorUsed())): number[][] {
		const point = new Vector(row.length, rowY);
		const neighbors = [
			...this.neighborColors(point),
			...(row.length === 0 ? [] : [row[row.length - 1]]),
		];
		const result: number[][] = [];
		for(let next = 0; next <= maxColorUsed; next ++) {
			if(!neighbors.includes(next)) {
				result.push(...this.rowCombinations(
					rowY,
					[...row, next],
					maxColorUsed,
				));
			}
		}
		if(maxColorUsed + 1 < this.maxColors) {
			result.push(...this.rowCombinations(
				rowY,
				[...row, maxColorUsed + 1],
				maxColorUsed + 1,
			));
		}
		return result;
	}

	rowRecolorings(maxColorUsed: number, newMaxColorUsed: number) {
		const remainingColors = this.maxColors - (maxColorUsed + 1);
		return MathUtils.permutation(remainingColors, Math.max(0, newMaxColorUsed - maxColorUsed));
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
			this.leftColors?.splice(0, rowY) ?? null,
			this.rightColors?.splice(0, rowY) ?? null,
			this.topColors,
			row,
		);
	}
	splitBottom(rowY: number, row: number[]) {
		return new ColoredRectangle(
			this.width,
			this.height - rowY - 1,
			this.maxColors,
			this.leftColors?.splice(rowY + 1) ?? null,
			this.rightColors?.splice(rowY + 1) ?? null,
			row,
			this.bottomColors,
		);
	}
}
