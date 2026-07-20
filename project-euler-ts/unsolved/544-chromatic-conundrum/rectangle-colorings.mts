import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";

class RectUnfilled {
	readonly width: number;
	readonly height: number;
	readonly maxColors: number;

	constructor(width: number, height: number, maxColors: number) {
		this.width = width;
		this.height = height;
		this.maxColors = maxColors;
	}

	colorings(): number {
		if(this.height % 2 === 0) {
			if(this.width % 2 === 1) {
				return new RectUnfilled(this.height, this.width, this.maxColors).colorings();
			}
			throw new Error("Calculating colorings for unfilled rectangles with even width and height is not currently supported.");
		}

		let colorings = 0;
		for(const template of this.middleRowTemplates()) {
			const combinations = this.middleRowCombinations(template);
			const halfColorings = new RectTopFilled(this.width, (this.height - 1) / 2, this.maxColors, template).colorings();
			colorings += combinations * (halfColorings ** 2);
		}
		return colorings;
	}

	middleRowTemplates(colors: number[] = [0], maxColorUsed: number = 0) {
		if(colors.length >= this.width) {
			return [colors];
		}
		const templates: number[][] = [];
		for(let i = 0; i <= maxColorUsed; i ++) {
			if(i !== colors[colors.length - 1]) {
				templates.push(...this.middleRowTemplates([...colors, i], maxColorUsed));
			}
		}
		if(maxColorUsed + 1 < this.maxColors) {
			templates.push(...this.middleRowTemplates([...colors, maxColorUsed + 1], maxColorUsed + 1));
		}
		return templates;
	}
	
	middleRowCombinations(template: number[]) {
		const colorsUsed = Math.max(...template) + 1;
		return MathUtils.permutation(this.maxColors, colorsUsed);
	}
}



class RectTopFilled {
	readonly width: number;
	readonly height: number;
	readonly maxColors: number;
	readonly topColors: number[];

	constructor(width: number, height: number, maxColors: number, topColors: number[]) {
		if(topColors.length !== width) {
			throw new Error(`Expected the number of colors along the top edge (${topColors}) to equal the width of the rectangle (${width})`);
		}
		this.width = width;
		this.height = height;
		this.maxColors = maxColors;
		this.topColors = topColors;
	}

	colorings() {
		if(this.width % 2 === 1) {
			throw new Error("Calculating colorings for a top-edge-filled rectangle with odd width is not currently supported.");
		}
		if(this.height === 0) { return 1; }

		const colorings = 0;
		for(const [leftColumn, rightColumn] of this.middleColumnTemplates()) {
			const middleColumnCombinations = this.middleColumnCombinations(leftColumn, rightColumn);
			// const leftCombinations = 
		}
		return colorings;
	}

	middleColumnTemplates(leftColumn: number[] = [], rightColumn: number[] = [], maxColorUsed: number = Math.max(...this.topColors)): [number[], number[]][] {
		if(leftColumn.length >= this.height && rightColumn.length >= this.height) {
			return [[leftColumn, rightColumn]];
		}

		const previousLeft = leftColumn[leftColumn.length - 1] ?? this.topColors[this.topColors.length / 2 - 1];
		const previousRight = rightColumn[rightColumn.length - 1] ?? this.topColors[this.topColors.length / 2];

		const templates: [number[], number[]][] = [];
		for(let left = 0; left <= maxColorUsed + 1; left ++) {
			if(left === previousLeft) { continue; }
			for(let right = 0; right <= maxColorUsed + 1; right ++) {
				if(right === previousRight || right === left) { continue; }
				if((left > maxColorUsed || right > maxColorUsed) && maxColorUsed + 1 >= this.maxColors) { continue; }
				templates.push(...this.middleColumnTemplates(
					[...leftColumn, left],
					[...rightColumn, right],
					Math.max(maxColorUsed, left, right),
				));
			}
		}
		if(maxColorUsed + 2 < this.maxColors) {
			templates.push(...this.middleColumnTemplates(
				[...leftColumn, maxColorUsed + 1],
				[...rightColumn, maxColorUsed + 2],
				maxColorUsed + 2,
			));
		}
		return templates;
	}

	middleColumnCombinations(leftColumn: number[], rightColumn: number[]) {
		const remainingColors = this.maxColors - (Math.max(...this.topColors) + 1);
		const newColorsUsed = Math.max(0, Math.max(...leftColumn, ...rightColumn) - Math.max(...this.topColors));
		return MathUtils.permutation(remainingColors, newColorsUsed);
	}

	leftCombinations(leftColumn: number[]) {
		// const rect = new RectTopRightFilled((this.width / 2) - 1, this.)
	}
}

class RectTopRightFilled {
	readonly width: number;
	readonly height: number;
	readonly maxColors: number;
	readonly topColors: number[];
	readonly rightColors: number[];
	
	constructor(width: number, height: number, maxColors: number, topColors: number[], rightColors: number[]) {
		if(topColors.length !== width) {
			throw new Error(`Expected the number of colors along the top edge (${topColors}) to equal the width of the rectangle (${width})`);
		}
		if(rightColors.length !== height) {
			throw new Error(`Expected the number of colors along the right edge (${rightColors}) to equal the height of the rectangle (${height})`);
		}
		this.width = width;
		this.height = height;
		this.maxColors = maxColors;
		this.topColors = topColors;
		this.rightColors = rightColors;
	}
}



console.log(new RectUnfilled(10, 9, 90).colorings());
debugger;
