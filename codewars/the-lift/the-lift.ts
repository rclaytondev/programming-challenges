let LOGGING = false;
const conditionalLog = (str: any) => {
	if(LOGGING) { console.log(str); }
};

class LiftSimulation {
	floorQueues: number[][];
	liftContents: number[] = [];
	floorsVisited: number[] = [0];
	liftDirection: "up" | "down" = "up";
	liftLocation: number = 0;
	capacity: number;

	constructor(floorQueues: number[][], capacity: number) {
		this.floorQueues = floorQueues;
		this.capacity = capacity;
	}

	moveLift() {
		this.liftLocation += (this.liftDirection === "up" ? 1 : -1);
	}
	update() {
		this.moveLift();
		conditionalLog((`moved ${this.liftDirection} to floor ${this.liftLocation}`));
		if(this.shouldStop()) {
			conditionalLog((`stopped at floor ${this.liftLocation}`));
			this.floorsVisited.push(this.liftLocation);
			this.peopleExitLift();
			this.peopleEnterLift();

			if(!this.canGoUp()) {
				this.liftDirection = "down";
			}
			if(!this.canGoDown()) {
				this.liftDirection = "up";
			}
		}
	}
	allPeopleArrived() {
		return this.floorQueues.every((queue, floor) => queue.every(num => num === floor));
	}
	isDone(): boolean {
		return this.liftLocation === 0 && this.allPeopleArrived();
	}

	shouldStop() {
		return (
			this.liftContents.includes(this.liftLocation) ||
			(this.liftContents.length < this.capacity && 
			this.floorQueues[this.liftLocation].some(destination => (
				this.shouldEnter(destination) && (
					(destination < this.liftLocation && this.floorQueues
						.slice(this.liftLocation + 1)
						.every((queue, floorNum) => queue.every(destination2 => destination2 > floorNum + this.liftLocation))
					) || (destination > this.liftLocation && this.floorQueues
						.slice(0, this.liftLocation)
						.every((queue, floorNum) => queue.every(destination2 => destination2 < floorNum))
					)
				)
			)))
		)
	}
	shouldEnter(destination: number) {
		return (
			this.liftContents.length === 0 ||
			(this.liftDirection === "up" && destination > this.liftLocation) ||
			(this.liftDirection === "down" && destination < this.liftLocation)
		)
	}
	peopleExitLift() {
		// const numExiting = this.liftContents.filter(p => p === this.liftLocation);
		conditionalLog(`${this.liftContents.filter(p => p === this.liftLocation).length} people exited on floor ${this.liftLocation}`);
		this.liftContents = this.liftContents.filter(p => p !== this.liftLocation)
		// this.floorQueues[this.liftLocation] = [...this.floorQueues[this.liftLocation], ...new Array(numExiting).fill(this.liftLocation)];
	}
	peopleEnterLift() {
		if(this.liftContents.length === 0) {
			if(this.floorQueues[this.liftLocation][0] > this.liftLocation) {
				this.liftDirection = "up";
			}
			else {
				this.liftDirection = "down";
			}
		}
		conditionalLog(`new lift direction is ${this.liftDirection}`);

		for(let i = 0; i < this.floorQueues[this.liftLocation].length; i ++) {
			const destination = this.floorQueues[this.liftLocation][i];
			if(this.liftContents.length < this.capacity && this.shouldEnter(destination)) {
				this.liftContents.push(destination);
				conditionalLog(`person with destination ${destination} entered the lift`);
				this.floorQueues[this.liftLocation].splice(i, 1);
				i --;
			}
		}
	}
	canGoUp() {
		return (
			this.liftContents.some(destination => destination > this.liftLocation) ||
			this.floorQueues.slice(this.liftLocation + 1).some(queue => queue.length > 0)
		);
	}
	canGoDown() {
		return (
			this.liftContents.some(destination => destination < this.liftLocation) ||
			this.floorQueues.slice(0, this.liftLocation).some(queue => queue.length > 0) ||
			(this.liftLocation !== 0 && this.allPeopleArrived())
		);
	}
}

export const theLift = (floorQueues: number[][], capacity: number): number[] => {
	const simulation = new LiftSimulation(floorQueues, capacity);
	while(!simulation.isDone()) {
		simulation.update();
	}
	if(simulation.floorsVisited[simulation.floorsVisited.length - 1] !== 0) {
		simulation.floorsVisited.push(0);
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
