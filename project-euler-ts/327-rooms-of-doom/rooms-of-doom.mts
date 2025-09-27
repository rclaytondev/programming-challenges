import { assert } from "chai";
import { HashSet } from "../../utils-ts/modules/HashSet.mjs";
import { describe, it } from "mocha";

class RoomsState {
	readonly rooms: number;
	readonly carryableCards: number;
	readonly cardsUsed: number;
	readonly cardCounts: readonly number[];
	readonly position: number;

	constructor(rooms: number, carryableCards: number, cardsUsed: number, cardCounts: number[], position: number) {
		this.rooms = rooms;
		this.carryableCards = carryableCards;
		this.cardsUsed = cardsUsed;
		this.cardCounts = cardCounts;
		this.position = position;
	}
	static startState(rooms: number, carryableCards: number) {
		return new RoomsState(rooms, carryableCards, 0, new Array(rooms + 1).fill(0), 0);
	}

	nextStates() {
		const states = [];
		if(this.position === 0) {
			states.push(this.dispenseCard());
		}
		const carryableCards = Math.min((this.cardCounts[this.position] ?? 0), this.carryableCards) - 1;
		for(let i = 0; i <= carryableCards; i ++) {
			if(this.position > 0) {
				states.push(this.moveLeft(i));
			}
			if(this.position <= this.rooms) {
				states.push(this.moveRight(i));
			}
		}
		return states;
	}
	nextState(cardsUsed: number, cardCounts: number[], position: number) {
		return new RoomsState(this.rooms, this.carryableCards, cardsUsed, cardCounts, position);
	}
	dispenseCard() {
		const newCounts = [...this.cardCounts];
		newCounts[0] = (newCounts[0] ?? 0) + 1;
		return this.nextState(this.cardsUsed + 1, newCounts, this.position);
	}
	moveTo(room: number, cardsTaken: number) {
		const newCounts = [...this.cardCounts];
		newCounts[this.position] = (newCounts[this.position] ?? 0) - (cardsTaken + 1);
		newCounts[room] = (newCounts[room] ?? 0) + cardsTaken;
		return this.nextState(this.cardsUsed, newCounts, room);
	}
	moveLeft(cardsTaken: number) {
		return this.moveTo(this.position - 1, cardsTaken);
	}
	moveRight(cardsTaken: number) {
		return this.moveTo(this.position + 1, cardsTaken);
	}
	isSolved() {
		return this.position >= this.rooms + 1;
	}

	toString() {
		const counts = this.cardCounts.map((v, i) => (i === this.position) ? `(${v})` : v);
		return `[${counts}] with ${this.cardsUsed} used`;
		// return `room ${this.position} of ${this.rooms} with ${this.cardsUsed} cards used and [${this.cardCounts.join(", ")}]`;
	}
}

const nextStates = (states: HashSet<RoomsState>) => {
	const result = new HashSet<RoomsState>();
	for(const state of states) {
		for(const next of state.nextStates()) {
			result.add(next);
		}
	}
	return result;
};

const cardsRequired = (rooms: number, carryableCards: number) => {
	let states = new HashSet<RoomsState>([RoomsState.startState(rooms, carryableCards)]);
	let bestSolution = Infinity;
	let done = false;
	let iterations = 0;
	while(!done) {
		states = nextStates(states);
		iterations ++;
		let minimum = Infinity;
		for(const state of states) {
			if(state.isSolved()) {
				bestSolution = Math.min(bestSolution, state.cardsUsed);
			}
			minimum = Math.min(minimum, state.cardsUsed);
		}
		console.log(`depth ${iterations}: ${states.size} states with a minimum cardsUsed of ${minimum} (best solution so far: ${bestSolution})`);
		if(minimum >= bestSolution) { done = true; }
	}
	return bestSolution;
};

describe("cardsRequired", () => {
	it("works for 2 rooms and 3 cards", () => {
		const result = cardsRequired(2, 3);
		assert.equal(result, 3);
	});
	it("works for 3 rooms and 3 cards", () => {
		const result = cardsRequired(3, 3);
		assert.equal(result, 6);
	});
	it.only("works for 3 cards and 6 rooms", () => {
		const result = cardsRequired(6, 3);
		assert.equal(result, 123);
	});
});
