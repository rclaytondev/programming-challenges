export const getArraySum = function(array: number[]) {
	let sum = 0;
	for(const value of array) {
		sum += value;
	}
	return sum;
}
