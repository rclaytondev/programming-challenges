const solve = (upperBound) => {
	/* Returns the sum of G(n^3) for all 1 <= n <= upperBound. */
	let result = 1; // G(1) = 1
	const piecewiseLines = [{
		slopeDenominator: 2, // slope = 1/2
		xOffset: 0,
		yOffset: 1,
		startIndex: 2,
		endIndex: 5
	}]; // G(n) = floor((n + 0)/2) + 1 for n between 2 and 5 inclusive
	let currentLine = piecewiseLines[0];
	let segmentsGenerated = 1;
	while(piecewiseLines[piecewiseLines.length - 1].endIndex < upperBound ** 3) {
		const lastLine = piecewiseLines[piecewiseLines.length - 1];
		const nextValue = Math.floor((lastLine.endIndex + lastLine.xOffset) / lastLine.slopeDenominator) + lastLine.yOffset + 1;

		const slopeDenominator = piecewiseLines.length + 2;
		const startIndex = lastLine.endIndex + 1;
		const endIndex = lastLine.endIndex + slopeDenominator * currentLine.slopeDenominator;
		const xOffset = -(startIndex % slopeDenominator);
		const yOffset = nextValue - Math.floor((startIndex + xOffset) / slopeDenominator);
		piecewiseLines.push({ slopeDenominator, startIndex, endIndex, xOffset, yOffset });

		segmentsGenerated ++;
		if(segmentsGenerated >= (currentLine.endIndex - currentLine.startIndex + 1) / currentLine.slopeDenominator) {
			currentLine = piecewiseLines[piecewiseLines.indexOf(currentLine) + 1];
			segmentsGenerated = 0;
		}
	}
	const golombSequence = (index) => {
		const line = piecewiseLines.find(l => l.startIndex <= index && index <= l.endIndex);
		return Math.floor((index + line.xOffset) / line.slopeDenominator) + line.yOffset;
	};
	for(let i = 2; i < upperBound; i ++) {
		result += golombSequence(i ** 3);
	}
	return result;
};

testing.addUnit("solve()", solve, [
	[10 ** 3, 153506976]
]);
