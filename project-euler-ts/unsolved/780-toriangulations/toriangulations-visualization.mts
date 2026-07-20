import { CanvasIO } from "../../../utils-ts/modules/CanvasIO.mjs";
import { Vector } from "../../../utils-ts/modules/geometry/Vector.mjs";
import { MathUtils } from "../../../utils-ts/modules/math/MathUtils.mjs";
import { Problem780, Toriangulation } from "./toriangulations.mjs";

export class Problem780Visualizer {
	static TRIANGLE_WIDTH = 50;
	static ROW_HEIGHT = Problem780Visualizer.TRIANGLE_WIDTH * (Math.sqrt(3) / 2);
	static RECTANGLE_LINE_WIDTH = 4;

	static CANVAS_WIDTH = 400;
	static CANVAS_HEIGHT = 400;
	
	static triangleRow(x: number, y: number, triangles: number, canvasIO: CanvasIO) {
		canvasIO!.strokeLine(
			x, y,
			x + triangles * Problem780Visualizer.TRIANGLE_WIDTH, y,
		);
		canvasIO!.strokeLine(
			x, y + Problem780Visualizer.ROW_HEIGHT,
			x + triangles * Problem780Visualizer.TRIANGLE_WIDTH, y + Problem780Visualizer.ROW_HEIGHT,
		);

		for(let i = 0; i < triangles; i ++) {
			canvasIO!.strokePoly(
				x + i * Problem780Visualizer.TRIANGLE_WIDTH, y + Problem780Visualizer.ROW_HEIGHT,
				x + (i + 1/2) * Problem780Visualizer.TRIANGLE_WIDTH, y,
				x + (i + 1) * Problem780Visualizer.TRIANGLE_WIDTH, y + Problem780Visualizer.ROW_HEIGHT,
			);
		}
	}

	static initializeCanvas() {
		const canvasIO = new CanvasIO();
		canvasIO.canvas.style.margin = "25px";
		canvasIO.setDimensions(Problem780Visualizer.CANVAS_WIDTH, Problem780Visualizer.CANVAS_HEIGHT);
		document.body.appendChild(canvasIO.canvas);
		return canvasIO;
	}

	static visualize(tiling: Toriangulation, rotate: boolean) {
		const canvasIO = Problem780Visualizer.initializeCanvas();
		const symmetry1Row = new Vector(tiling.symmetry1.x, tiling.symmetry1.y * Math.sqrt(3) / 2);
		const symmetry2Row = new Vector(tiling.symmetry2.x, tiling.symmetry2.y * Math.sqrt(3) / 2);
		const center = symmetry1Row.add(symmetry2Row).multiply(Problem780Visualizer.TRIANGLE_WIDTH / 2);
		canvasIO.fillCanvas("rgb(250, 250, 250)");
		canvasIO.ctx.save();
		canvasIO.ctx.translate(canvasIO.canvas.width / 2, canvasIO.canvas.height / 2);
		if(rotate) {
			const angle = symmetry1Row.angle();
			canvasIO.ctx.rotate(-angle);
		}
		Problem780Visualizer.drawTriangles(tiling, canvasIO, center);
		Problem780Visualizer.drawRect(canvasIO, symmetry1Row, symmetry2Row, center);
		canvasIO.ctx.restore();
		Problem780Visualizer.displayText(tiling, canvasIO, rotate);
	}
	private static drawTriangles(tiling: Toriangulation, canvasIO: CanvasIO, onscreenCenter: Vector) {
		const screenOffsetX = Math.ceil(canvasIO.width() / Problem780Visualizer.TRIANGLE_WIDTH);
		const screenOffsetY = Math.ceil(canvasIO.height() / Problem780Visualizer.ROW_HEIGHT);
		for(const [i, xOffset] of tiling.xOffsets.entries()) {
			for(let j = 0; i + tiling.xOffsets.length * j <= 2 * screenOffsetY; j ++) {
				const rowWidth = 2 * screenOffsetX;
				const x = MathUtils.generalizedModulo(xOffset + tiling.xStep * j, 1) - screenOffsetX;
				const y = (i + tiling.xOffsets.length * j) - screenOffsetY;
				const onscreenX = -onscreenCenter.x + Problem780Visualizer.TRIANGLE_WIDTH * (1/2 + x);
				const onscreenY = -onscreenCenter.y + y * Problem780Visualizer.ROW_HEIGHT;
				Problem780Visualizer.triangleRow(onscreenX, onscreenY, rowWidth, canvasIO);
			}
		}
	}
	private static drawRect(canvasIO: CanvasIO, symmetry1Row: Vector, symmetry2Row: Vector, onscreenCenter: Vector) {
		canvasIO.ctx.strokeStyle = "orange";
		canvasIO.ctx.lineWidth = Problem780Visualizer.RECTANGLE_LINE_WIDTH;
		const offset = onscreenCenter.multiply(-1);

		const vertex1 = offset;
		const vertex2 = offset.add(symmetry1Row.multiply(Problem780Visualizer.TRIANGLE_WIDTH));
		const vertex3 = offset.add(symmetry1Row.add(symmetry2Row).multiply(Problem780Visualizer.TRIANGLE_WIDTH));
		const vertex4 = offset.add(symmetry2Row.multiply(Problem780Visualizer.TRIANGLE_WIDTH));

		canvasIO.strokePoly(vertex1, vertex2, vertex3, vertex4);

		canvasIO.ctx.fillStyle = "red";
		canvasIO.fillCircle(vertex1.x, vertex1.y, 10);

		canvasIO.ctx.fillStyle = "green";
		canvasIO.fillCircle(vertex2.x, vertex2.y, 5);

		canvasIO.ctx.fillStyle = "blue";
		canvasIO.fillCircle(vertex4.x, vertex4.y, 5);
	}
	private static displayText(tiling: Toriangulation, canvasIO: CanvasIO, rotate: boolean) {
		const FONT_SIZE = 13;
		canvasIO.ctx.fillStyle = "rgb(40, 40, 40)";
		canvasIO.ctx.fillRect(0, 0, canvasIO.canvas.width, FONT_SIZE + 10);

		const rotatedText = rotate ? "(rotated)" : "(unrotated)";
		const text = `${tiling.getDisplayText()} ${rotatedText}`;
		canvasIO.ctx.fillStyle = "rgb(255, 255, 255)";
		canvasIO.ctx.textAlign = "left";
		canvasIO.ctx.textBaseline = "top";
		canvasIO.ctx.font = `${FONT_SIZE}px monospace`;
		canvasIO.ctx.fillText(text, 5, 5);
	}

	static visualizeAndLog(tiling: Toriangulation, rotate: boolean | "both") {
		if(rotate === "both") {
			Problem780Visualizer.visualize(tiling, false);
			Problem780Visualizer.visualize(tiling, true);
		}
		else {
			Problem780Visualizer.visualize(tiling, rotate);
		}
		tiling.log();
	}

	static visualizeAll(triangles: number, triangleMode: "exact" | "upper-bound") {
		const toriangulations = Problem780.toriangulations(triangles, triangleMode);
		for(const toriangulation of toriangulations) {
			Problem780Visualizer.visualizeAndLog(toriangulation, true);
		}
	}
}

Problem780Visualizer.visualizeAll(4, "upper-bound");
