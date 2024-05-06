const NUM_CARDS = 4;
const NUM_ROOMS = 6 + 2;

// display settings
const ROOM_WIDTH = 100;
const ROOM_HEIGHT = 100;

class GameState {
	static STYLES = {
		DEFAULT: {
			font: "bold 30px monospace",
			textAlign: "center",
			textBaseline: "middle",
			fillStyle: "black"
		},
		DEFAULT_TOP_LEFT_ALIGN: {
			font: "bold 30px monospace",
			textAlign: "left",
			textBaseline: "top",
			fillStyle: "black"
		},

		ROOM_BORDER: {
			lineWidth: 1,
			strokeStyle: "black"
		}
	};

	constructor(currentRoom, cardsHeld, cardsInRooms, cardsUsed) {
		this.currentRoom = currentRoom ?? 0;
		this.cardsHeld = cardsHeld ?? 0;
		this.cardsInRooms = cardsInRooms ?? Array(NUM_ROOMS).fill(0).set(0, Infinity);
		this.cardsUsed = cardsUsed ?? 0;
	}

	display() {
		c.fillCanvas("white");

		c.loadStyle(GameState.STYLES.DEFAULT_TOP_LEFT_ALIGN);
		c.fillText(`Cards Used: ${this.cardsUsed}`, 0, 0);

		const roomsPos = new Rectangle({
			w: ROOM_WIDTH * NUM_ROOMS,
			h: ROOM_HEIGHT
		}).centerAt(canvas.width / 2, canvas.height / 2);
		let roomIndex = 0;
		for(let x = roomsPos.left; x < roomsPos.right; x += ROOM_WIDTH) {
			this.displayRoom(
				roomIndex,
				new Rectangle({x: x, y: roomsPos.y, width: ROOM_WIDTH, height: ROOM_HEIGHT})
			);
			roomIndex ++;
		}
	}
	displayRoom(roomIndex, position) {
		const { x, y, width, height } = position;

		c.loadStyle(GameState.STYLES.ROOM_BORDER);
		c.strokeRect(x, y, width, height);

		const cardsInRoom = this.cardsInRooms[roomIndex];
		c.loadStyle(GameState.STYLES.DEFAULT);
		if(cardsInRoom !== 0) {
			c.fillStyle = "black";
			c.fillText(
				cardsInRoom === Infinity ? "Inf" : cardsInRoom,
				x + (width / 2), y + (height * 1/4)
			);
		}
		if(roomIndex === this.currentRoom) {
			const playerPos = new Vector(x + (width / 2), y + (height * 2/3));
			c.fillStyle = "grey";
			c.fillCircle(playerPos.x, playerPos.y, Math.min(width, height) / 4);
			c.fillStyle = "white";
			c.fillText(this.cardsHeld, playerPos.x, playerPos.y);
		}
	}

	nextState(io) {
		const newState = this.clone();

		const keyLeft = io.beganPressing("KeyA") || io.beganPressing("ArrowLeft");
		const keyRight = io.beganPressing("KeyD") || io.beganPressing("ArrowRight");
		const keyUp = io.beganPressing("KeyW") || io.beganPressing("ArrowUp");
		const keyDown = io.beganPressing("KeyS") || io.beganPressing("ArrowDown");

		if(keyLeft && this.canMoveLeft()) {
			newState.currentRoom --;
			newState.cardsHeld --;
		}
		else if(keyRight && this.canMoveRight()) {
			newState.currentRoom ++;
			newState.cardsHeld --;
		}
		else if(keyUp && this.canPickUpCard()) {
			newState.cardsHeld ++;
			newState.cardsInRooms[newState.currentRoom] --;
			if(newState.currentRoom === 0) {
				newState.cardsUsed ++;
			}
		}
		else if(keyDown && this.canDepositCard()) {
			newState.cardsHeld --;
			newState.cardsInRooms[newState.currentRoom] ++;
			if(newState.currentRoom === 0) {
				newState.cardsUsed --;
			}
		}
		return newState;
	}

	canMoveLeft() {
		return this.currentRoom !== 0 && this.cardsHeld > 0;
	}
	canMoveRight() {
		return this.currentRoom < NUM_ROOMS + 1 && this.cardsHeld > 0;
	}
	canPickUpCard() {
		return this.cardsInRooms[this.currentRoom] > 0 && this.cardsHeld < NUM_CARDS;
	}
	canDepositCard() {
		return this.cardsHeld > 0;
	}

	clone() {
		return new GameState(this.currentRoom, this.cardsHeld, [...this.cardsInRooms], this.cardsUsed);
	}
}


let currentState = new GameState();
currentState.display();


setInterval(() => {
	currentState = currentState.nextState(io);
	currentState.display();

	utils.pastInputs.update();
}, 1000 / 60);
