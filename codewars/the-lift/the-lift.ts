class LiftSimulation {
	floorQueues: number[][];
	liftContents: number[] = [];
	floorsVisited: number[] = [];
	liftDirection: "up" | "down" = "up";
	liftLocation: number = 0;
	capacity: number;

	constructor(floorQueues: number[][], capacity: number) {
		this.floorQueues = floorQueues;
		this.capacity = capacity;
	}

	update() {

	}
	isDone(): boolean {
		return true;
	}
}

export const theLift = (floorQueues: number[][], capacity: number): number[] => {
	const simulation = new LiftSimulation(floorQueues, capacity);
	while(!simulation.isDone()) {
		simulation.update();
	}
	return simulation.floorsVisited;
};

import { expect } from 'chai';
describe("Example Tests", function() {
	it("simulates people moving upward from floor 2 to floor 5", function() {
		var queues = [
			[], // G
			[], // 1
			[5,5,5], // 2
			[], // 3
			[], // 4
			[], // 5
			[], // 6
		];
		var result = theLift(queues,5);
		expect(result).to.have.members([0,2,5,0]);
	});
	
	it("simulates people moving downward from floor 2 to floor 1", function() {
		var queues = [
			[], // G
			[], // 1
			[1,1], // 2
			[], // 3
			[], // 4
			[], // 5
			[], // 6
		];
		var result = theLift(queues,5);
		expect(result).to.have.members([0,2,1,0]);
	});	
	it("simulates people on multiple floors all moving up", function() {
		var queues = [
			[], // G
			[3], // 1
			[4], // 2
			[], // 3
			[5], // 4
			[], // 5
			[], // 6
		];
		var result = theLift(queues,5);
		expect(result).to.have.members([0,1,2,3,4,5,0]);
	}); 
	it("simulates people on multiple floors all moving down", function() {
		var queues = [
			[], // G
			[0], // 1
			[], // 2
			[], // 3
			[2], // 4
			[3], // 5
			[], // 6
		];
		var result = theLift(queues,5);
		expect(result).to.have.members([0,5,4,3,2,1,0]);
	});
	
	/* Tests written by me */
	it("simulates a situation in which the elevator needs to go up and then down", () => {
		const queues = [
			[], // G
			[3], // 1
			[], // 2
			[], // 3
			[0] // 4
		];
		const result = theLift(queues, 5);
		expect(result).to.have.members([0, 1, 3, 4, 0]);
	});
	it("simulates a situation in which the lift is already done", () => {
		const queues = [
			[] // G
		];
		const result = theLift(queues, 5);
		expect(result).to.have.members([0]);
	});
});
