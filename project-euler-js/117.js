const waysToTile = (rowLength => {
	const BASE_CASES = [1, 1, 2, 4, 8, 15];
	if(rowLength < 0) { return 0; }
	if(rowLength < BASE_CASES.length) { return BASE_CASES[rowLength]; }

	const TILE_SIZES = [2, 3, 4];
	if(rowLength % 2 === 0) {
		let ways = waysToTile(rowLength / 2) ** 2; // ways where there is no tile over the central line
		for(const tileSize of TILE_SIZES) {
			for(let offset = 0; offset < tileSize - 1; offset ++) {
				const leftGap = rowLength / 2 + offset - (tileSize - 1);
				const rightGap = rowLength / 2 - (offset + 1);
				ways += waysToTile(leftGap) * waysToTile(rightGap);
			}
		}
		return ways;
	}
	else {
		const halfSize = (rowLength - 1) / 2;
		let ways = waysToTile(halfSize) ** 2; // ways where the center tile is empty
		for(const tileSize of TILE_SIZES) {
			for(let offset = 0; offset < tileSize; offset ++) {
				const leftGap = halfSize - (tileSize - 1) + offset;
				const rightGap = halfSize - offset;
				ways += waysToTile(leftGap) * waysToTile(rightGap);
			}
		}
		return ways;
	}
}).memoize(true);
testing.addUnit("waysToTile()", waysToTile, [
	[5, 15]
]);
testing.testAll();
