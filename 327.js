const cardsNeeded = (numCards, numRooms) => {

};

testing.addUnit("cardsNeeded()", [
	[3, 3, 6],
	[3, 6, 123],
	[4, 6, 23]
]);

const solve = () => {
	console.time("solving the problem");
	let result = 0;
	for(let c = 3; c <= 40; c ++) {
		result += cardsNeeded(c, 30);
	}
	console.log(`the answer is ${result}`);
	console.timeEnd("solving the problem");
	return result;
};
