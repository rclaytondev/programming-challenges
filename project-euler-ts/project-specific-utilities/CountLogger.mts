export class CountLogger {
	private milestoneSequence: (index: number) => number;
	private counter: number = 0;
	private milestoneIndex: number = 0;
	constructor(milestoneSequence: (index: number) => number) {
		this.milestoneSequence = milestoneSequence;
	}

	count() {
		this.counter ++;
		if(this.counter >= this.milestoneSequence(this.milestoneIndex)) {
			console.log(`counter: ${this.milestoneSequence(this.milestoneIndex)}`);
			this.milestoneIndex ++;
		}
	}
}
