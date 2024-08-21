export class CountLogger {
	private milestoneSequence: (index: number) => number;
	private counter: number = 0;
	private milestoneIndex: number = 0;
	total: number | null;
	constructor(milestoneSequence: (index: number) => number, total?: number) {
		this.milestoneSequence = milestoneSequence;
		this.total = total ?? null;
	}

	log() {
		while(this.counter >= this.milestoneSequence(this.milestoneIndex)) {
			const milestone = this.milestoneSequence(this.milestoneIndex);
			if(this.total != null) {
				console.log(`counter: ${milestone} (${(100 * milestone / this.total).toFixed(1)}%)`);
			}
			else {
				console.log(`counter: ${milestone}`);
			}
			this.milestoneIndex ++;
		}
	}
	count() {
		this.counter ++;
		this.log();
	}
	countTo(num: number) {
		this.counter = num;
		this.log();
	}
}
