const COIN_VALUES = [1, 2, 5, 10, 20, 50, 100, 200];

const numWaysToMake = (total) => {
	let ways = 0;
	for(let a = 0; a <= total; a ++) {
		for(let b = 0; a + b <= total; b += 2) {
			for(let c = 0; a + b + c <= total; c += 5) {
				for(let d = 0; a + b + c + d <= total; d += 10) {
					for(let e = 0; a + b + c + d + e <= total; e += 20) {
						for(let f = 0; a + b + c + d + e + f <= total; f += 50) {
							for(let g = 0; a + b + c + d + e + f + g <= total; g += 100) {
								for(let h = 0; a + b + c + d + e + f + g + h <= total; h += 200) {
									const sum = a + b + c + d + e + f + g + h;
									if(sum === total) { ways ++; }
								}
							}
						}
					}
				}
			}
		}
	}
	return ways;
};

testing.addUnit("numWaysToMake()", [
	numWaysToMake,
	[1, 1],
	[2, 2], // {2} and {1, 1}
	[3, 2], // {2, 1} and {1, 1, 1}
	[4, 3], // {2, 2}, {2, 1, 1}, and {1, 1, 1, 1}
	[5, 4] // {5}, {2, 2, 1}, {2, 1, 1, 1}, {1, 1, 1, 1, 1}
]);
testing.testAll();
