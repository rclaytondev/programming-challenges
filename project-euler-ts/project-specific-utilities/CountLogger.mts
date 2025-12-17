export class CountLogger {
	private milestoneSequence: (index: number) => number;
	private counter: number = 0;
	private milestoneIndex: number = 0;
	private startTime: number;
	private minDelayMS: number;
	private timeOfLastLog = 0;
	label: string | null;
	total: number | null;
	constructor(milestoneSequence: (index: number) => number, total: number | null = null, label: string | null = null, minDelayMS: number = 100) {
		this.milestoneSequence = milestoneSequence;
		this.total = total;
		this.startTime = Date.now();
		this.label = label;
		this.minDelayMS = minDelayMS;
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
		const now = Date.now();
		const shouldLog = (now - this.timeOfLastLog) >= this.minDelayMS;
		while(this.counter >= this.milestoneSequence(this.milestoneIndex)) {
			const milestone = this.milestoneSequence(this.milestoneIndex);
			if(shouldLog) {
				const name = (this.label ? `counter "${this.label}"` : `counter`);
				const time = CountLogger.formatTime(now - this.startTime);
				const percent = (this.total == null) ? "" : ` (${(100 * milestone / this.total).toFixed(1)}%)`;
				this.timeOfLastLog = now;
				console.log(`${name}: ${milestone}${percent} in ${time}`);
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
