const binaryInsert = (array, value) => {
	const index = utils.binarySearch(0, array.length - 1, (index) => array[index] - value, "first");
	console.log(index);
	if(index === 0 && value < array[0]) {
		return [value, ...array];
	}
	return [...array.slice(0, index + 1), value, ...array.slice(index + 1, array.length)];
};
testing.addUnit("binaryInsert()", {
	"can insert a value in a array when the value is already in the array": () => {
		const array = [1, 2, 3, 4]; // expected insertion index: 1 or 2
		const inserted = binaryInsert(array, 3);
		expect(inserted).toEqual([1, 2, 3, 3, 4]);
	},
	"can insert a value in a array when the value is not in the array": () => {
		const array = [1, 2, 3, 5]; // expected insertion index: 2
		const inserted = binaryInsert(array, 4);
		expect(inserted).toEqual([1, 2, 3, 4, 5]);
	},
	"can insert a value in the array when it already occurs multiple times in the array": () => {
		const array = [1, 2, 2, 2, 3];
		const inserted = binaryInsert(array, 2); // expected insertion index: 0, 1, 2, or 3
		expect(inserted).toEqual([1, 2, 2, 2, 2, 3]);
	},
	"can insert a value at the beginning of the array": () => {
		const array = [1, 2, 3, 4, 5]; // expected insertion index: 0. Special case: insert at the beginning.
		const inserted = binaryInsert(array, 0);
		expect(inserted).toEqual([0, 1, 2, 3, 4, 5]);
	},
	"can insert a value at the end of the array": () => {
		const array = [1, 2, 3, 4, 5]; // expected insertion index: 4.
		debugger;
		const inserted = binaryInsert(array, 100);
		expect(inserted).toEqual([1, 2, 3, 4, 5, 100]);
	},
});
