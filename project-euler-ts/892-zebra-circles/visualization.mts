import { CanvasIO, canvasIO } from "../../utils-ts/modules/CanvasIO.mjs";
import { Vector } from "../../utils-ts/modules/geometry/Vector.mjs";
import { MathUtils } from "../../utils-ts/modules/math/MathUtils.mjs";
import { allCuttings, Edge, PartialCutting, Region } from "./zebra-circles.mjs";

const NUM_POINTS = 4;
const TEXT_SIZE = 20;
const MARGIN = 20;
const DISPLAY_SIZE = 100;
const WHITE_COLOR = "rgb(200, 200, 200)";
const BLACK_COLOR = "rgb(50, 50, 50)";

class Visualization {
	static getPoint(pointNumber: number, center: Vector, radius: number) {
		const angle = MathUtils.toRadians(90 - ((pointNumber - 1) / NUM_POINTS * 360));
		return center.add(new Vector(Math.cos(angle), -Math.sin(angle)).multiply(radius));
	}
	static displayRegion(region: Region, color: "white" | "black", center: Vector, radius: number, canvasIO: CanvasIO) {
		// TODO
	}
	static displayCutting(cutting: PartialCutting, center: Vector, radius: number, canvasIO: CanvasIO) {
		// canvasIO.strokeCircle(center.x, center.y, radius);
		for(const [region, color] of cutting.getColoring()) {
			Visualization.displayRegion(region, color, center, radius, canvasIO);
		}
	}
	static displayCuttings(cuttings: PartialCutting[], displayY: number, canvasIO: CanvasIO) {
		let displayX = MARGIN;
		for(const cutting of cuttings) {
			Visualization.displayCutting(
				cutting, 
				new Vector(displayX + (DISPLAY_SIZE / 2), displayY + (DISPLAY_SIZE / 2)),
				DISPLAY_SIZE / 2,
				canvasIO
			);
		}
	}
	static getSortedCuttings() {
		const sortedCuttings: PartialCutting[][] = [];
		debugger;
		for(const cutting of allCuttings(NUM_POINTS)) {
			const difference = cutting.coloringDifference();
			sortedCuttings[difference] ??= [];
			sortedCuttings[difference].push(cutting);
		}
		return sortedCuttings;
	}
	static display(canvasIO: CanvasIO) {
		let displayY = 0;
		const sortedCuttings = Visualization.getSortedCuttings();

		for(const [difference, cuttings] of sortedCuttings.entries()) {
			canvasIO.ctx.fillStyle = "black";
			canvasIO.ctx.textBaseline = "top";
			canvasIO.ctx.font = `${TEXT_SIZE}px monospace`;
			canvasIO.ctx.fillText(`d=${difference}`, 0, displayY);
			displayY += TEXT_SIZE;
			displayY += MARGIN;

			Visualization.displayCuttings(cuttings, displayY, canvasIO);
		}
	}
}


if(canvasIO) {
	Visualization.display(canvasIO);
}
