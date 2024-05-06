const numRectangles = (w, h) => w * (w + 1) * h * (h + 1) / 4;
const integerPairs = function*() {
	for(let sum = 2; sum < Infinity; sum ++) {
		for(let x = 1; x < sum; x ++) {
			const y = sum - x;
			yield [x, y];
		}
	}
};

let i = 0;
for(const pair of integerPairs()) {
	i ++;
	console.log(pair);
	if(i > 30) { break; }
}
