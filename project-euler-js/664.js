// const grid = [
// 	[1, 1, 1, 1, 0, 0, 0, 0],
// 	[1, 1, 1, 1, 0, 0, 0, 0],
// 	[1, 1, 1, 1, 0, 0, 0, 0],
// 	[1, 1, 1, 1, 0, 0, 0, 0],
// 	[1, 1, 1, 1, 0, 0, 0, 0],
// 	[1, 1, 1, 1, 0, 0, 0, 0],
// 	[1, 1, 1, 1, 0, 0, 0, 0],
// 	[1, 1, 1, 1, 0, 0, 0, 0],
// ];
const grid = [
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[3, 3, 3, 3, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[0, 0, 0, 0, 0, 0, 0, 0],
	[1, 1, 1, 1, 0, 0, 0, 0],
	[1, 1, 1, 1, 0, 0, 0, 0],
	[1, 1, 1, 1, 0, 0, 0, 0],
];

let movementPosition = null;
let deletionPosition = null;


const CANVAS_SIZE = 800;
const gridSize = CANVAS_SIZE / grid[0].length;
const displayGrid = () => {
	const width = grid[0].length;
	const height = grid.length;


	grid.forEach((row, gridCellY) => {
		row.forEach((numTokens, gridCellX) => {
			const screenPos = {
				x: Math.map(gridCellX, 0, width, 0, CANVAS_SIZE),
				y: Math.map(gridCellY, 0, height, 0, CANVAS_SIZE),
			};
			c.strokeStyle = "black";
			c.fillStyle = "white";
			if(movementPosition?.equals(gridCellX, gridCellY)) {
				c.fillStyle = "green";
			}
			else if(deletionPosition?.equals(gridCellX, gridCellY)) {
				c.fillStyle = "red";
			}
			c.lineWidth = 5;
			c.strokeRect(screenPos.x, screenPos.y, gridSize, gridSize);
			c.fillRect(screenPos.x, screenPos.y, gridSize, gridSize);

			c.font = "30px monospace";
			c.fillStyle = "black";
			c.fillText(numTokens, screenPos.x + (gridSize / 2), screenPos.y + (gridSize / 2));
		});
	});
};
displayGrid(grid);

canvas.addEventListener("click", () => {
	const clickPos = io.mouse.divide(gridSize).floor();
	if(!movementPosition && grid[clickPos.y][clickPos.x] !== 0) {
		movementPosition = clickPos;
	}
	else if(!deletionPosition) {
		if(grid[clickPos.y][clickPos.x] !== 0 && clickPos.isAdjacentTo(movementPosition)) {
			deletionPosition = clickPos;
		}
	}
	else if(clickPos.isAdjacentTo(movementPosition)) {
		grid[movementPosition.y][movementPosition.x] --;
		grid[deletionPosition.y][deletionPosition.x] --;
		grid[clickPos.y][clickPos.x] ++;

		movementPosition = null, deletionPosition = null;
	}
	displayGrid();
});
window.addEventListener("keyup", (event) => {
	if(event.key === "Escape") {
		movementPosition = null, deletionPosition = null;
	}
	displayGrid();
})

const nextStates = (state) => {
	const states = [];
	state.forEach((gridSpace, index) => {
		if(gridSpace !== 0) {
			if(index !== 0 && state[index - 1] !== 0) {
				if(index !== state.length - 1) {
					const newState1 = state.clone();
					newState1[index] --;
					newState1[index - 1] --;
					newState1[index + 1] ++;
					states.push(newState1);
				}
				const newState2 = state.clone();
				newState2[index] --;
				newState2[index - 1] --;
				newState2[index - 1] ++;
				states.push(newState1);
			}
			if(index !== state.length - 1 && state[index + 1] !== 0) {
				const newState1 = state.clone();
				newState1[index] --;
				newState1[index + 1] --;
				newState1[index + 1] ++;
				states.push(newState1);
				if(index !== 0) {
					const newState1 = state.clone();
					newState1[index] --;
					newState1[index + 1] --;
					newState1[index - 1] ++;
					states.push(newState1);
				}
			}
		}
	});
};
const bruteForce = (initialState) => {

};
