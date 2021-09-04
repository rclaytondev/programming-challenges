Array.method(function average() {
	if(this.length === 0) {
		throw new Error("Cannot find the average of the numbers in an empty array.");
	}
	return this.sum(...arguments) / this.length;
});
Array.method(function median() {
	if(this.length === 0) {
		throw new Error("Cannot find the median of the numbers in an empty array.");
	}
	else if(this.length % 2 === 0) {
		const sorted = [...this].sort(Array.SORT_ASCENDING);
		const middleLeft = sorted[sorted.length / 2 - 1];
		const middleRight = sorted[sorted.length / 2];
		return (middleLeft + middleRight) / 2;
	}
	else {
		const sorted = [...this].sort(Array.SORT_ASCENDING);
		return sorted[Math.floor(sorted.length / 2)];
	}
});

testing.addUnit("Array.average()", {
	"can return the average of the numbers in an array": () => {
		const numbers = [1, 2, 3, 4, 100];
		const average = numbers.average();
		expect(average).toEqual(22);
	},
	"throws an error when the array is empty": () => {
		const numbers = [];
		expect(() => numbers.average()).toThrow();
	}
});
testing.addUnit("Array.median()", {
	"can return the median of the numbers in an even-length array": () => {
		const numbers = [3, 100, 2, 1, 4, 0];
		const median = numbers.median();
		expect(median).toEqual((2 + 3) / 2);
	},
	"can return the median of the numbers in an odd-length array": () => {
		const numbers = [3, 100, 2, 1, 4];
		const median = numbers.median();
		expect(median).toEqual(3);
	},
	"throws an error when the array is empty": () => {
		const numbers = [];
		expect(() => numbers.median()).toThrow();
	}
});
testing.testAll();
