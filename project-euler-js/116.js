const tileCombinations = function(totalLength, tileSize) {
	if(totalLength < tileSize) {
		return 0;
	}

	let combinations = 0;
	for(let i = 0; i <= totalLength - tileSize; i ++) {
		const spacesAfter = totalLength - tileSize - i;
		combinations += tileCombinations(spacesAfter, tileSize) + 1;
	}
	return combinations;
}.memoize(true);
console.log(tileCombinations(50, 2) + tileCombinations(50, 3) + tileCombinations(50, 4));
