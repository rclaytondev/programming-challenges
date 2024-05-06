class GameState {
	constructor(maxCards, cardsUsed, cardsHeld, position, rooms) {
		this.maxCards = maxCards; // maximum number of cards held at once
		this.cardsUsed = cardsUsed; // total number of cards used so far
		this.cardsHeld = cardsHeld;
		this.position = position; // which room you're in
		this.rooms = [...rooms]; // array containing the number of key cards in each room. 0 = starting room.
	}

	children() {
		const children = [];
		if(this.position !== this.rooms.length && this.cardsHeld > 0) {
			/* move to the next room */
			children.push(new GameState(this.maxCards, this.cardsUsed, this.cardsHeld - 1, this.position + 1, this.rooms));
		}
		if(this.position !== 0 && this.cardsHeld > 0) {
			/* move to the previous room */
			children.push(new GameState(this.maxCards, this.cardsUsed, this.cardsHeld - 1, this.position - 1, this.rooms));
		}
		if(this.rooms[this.position] > 0 && this.cardsHeld < this.maxCards) {
			/* pick up a card */
			const cardsUsed = (this.position === 0) ? this.cardsUsed + 1 : this.cardsUsed;
			const rooms = [...this.rooms];
			rooms[this.position] --;
			children.push(new GameState(this.maxCards, cardsUsed, this.cardsHeld + 1, this.position, rooms));
		}
		if(this.cardsHeld > 0 && this.position !== 0) {
			/* deposit a card in the current room */
			const rooms = [...this.rooms];
			rooms[this.position] ++;
			children.push(new GameState(this.maxCards, this.cardsUsed, this.cardsHeld - 1, this.position, rooms));
		}
		return children;
	}
}

const cardsNeeded = (numCards, numRooms) => {

};

testing.addUnit(cardsNeeded, [
	[3, 3, 6],
	[3, 6, 123],
	[4, 6, 23]
]);

const solve = () => {
	console.time("solving the problem");
	let result = 0;
	for(let c = 3; c <= 40; c ++) {
		result += cardsNeeded(c, 30);
	}
	console.log(`the answer is ${result}`);
	console.timeEnd("solving the problem");
	return result;
};
