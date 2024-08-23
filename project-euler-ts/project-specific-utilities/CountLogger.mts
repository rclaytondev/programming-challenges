export class CountLogger {
	private milestoneSequence: (index: number) => number;
	private counter: number = 0;
	private milestoneIndex: number = 0;
	private startTime: number;
	label: string | null;
	total: number | null;
	constructor(milestoneSequence: (index: number) => number, total: number | null = null, label: string | null = null) {
		this.milestoneSequence = milestoneSequence;
		this.total = total;
		this.startTime = Date.now();
		this.label = label;
	}

	private static formatTime = (milliseconds: number) => {
		if(milliseconds < 1000) {
			return `${milliseconds} ms`;
		}
		else {
			return `${milliseconds / 1000} s`;
		}
	};

	log() {
		const name = (this.label ? `counter "${this.label}"` : `counter`);
		while(this.counter >= this.milestoneSequence(this.milestoneIndex)) {
			const milestone = this.milestoneSequence(this.milestoneIndex);
			const time = CountLogger.formatTime(Date.now() - this.startTime);
			if(this.total != null) {
				console.log(`${name}: ${milestone} (${(100 * milestone / this.total).toFixed(1)}%) in ${time}`);
			}
			else {
				console.log(`${name}: ${milestone} in ${time}`);
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
