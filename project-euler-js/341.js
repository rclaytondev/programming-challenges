const solve = (upperBound) => {
	/* Returns the sum of G(n^3) for all 1 <= n <= upperBound. */
	let result = 1n; // G(1) = 1
	const piecewiseLines = [{
		slopeDenominator: 2n, // slope = 1/2
		xOffset: 0n,
		yOffset: 1n,
		startIndex: 2n,
		endIndex: 5n
	}]; // G(n) = floor((n + 0)/2) + 1 for n between 2 and 5 inclusive
	let currentLine = piecewiseLines[0];
	let segmentsGenerated = 1;
	let iterations = 0;
	while(piecewiseLines[piecewiseLines.length - 1].endIndex < upperBound ** 3) {
		const lastLine = piecewiseLines[piecewiseLines.length - 1];
		const nextValue = ((lastLine.endIndex + lastLine.xOffset) / lastLine.slopeDenominator) + lastLine.yOffset + 1n;

		const slopeDenominator = BigInt(piecewiseLines.length) + 2n;
		const startIndex = lastLine.endIndex + 1n;
		const endIndex = lastLine.endIndex + slopeDenominator * currentLine.slopeDenominator;
		const xOffset = -(startIndex % slopeDenominator);
		const yOffset = nextValue - ((startIndex + xOffset) / slopeDenominator);
		piecewiseLines.push({ slopeDenominator, startIndex, endIndex, xOffset, yOffset });

		segmentsGenerated ++;
		if(segmentsGenerated >= (currentLine.endIndex - currentLine.startIndex + 1n) / currentLine.slopeDenominator) {
			currentLine = piecewiseLines[piecewiseLines.indexOf(currentLine) + 1];
			segmentsGenerated = 0;
		}
		iterations ++;
		if(iterations % 1000 === 0) {
			const progress = 100 * Number(lastLine.endIndex) / (upperBound ** 3);
			console.log(`${progress.toFixed(4)}% complete`);
		}
	}
	const golombSequence = (index) => {
		const lineIndex = utils.binarySearch(
			0, piecewiseLines.length - 1,
			(lineIndex) => {
				const line = piecewiseLines[lineIndex];
				if(line.endIndex < index) { return -1; }
				else if(line.startIndex > index) { return 1; }
				else { return 0; }
			}
		);
		const line = piecewiseLines[lineIndex];
		return ((index + BigInt(line.xOffset)) / BigInt(line.slopeDenominator)) + BigInt(line.yOffset);
	};
	debugger;
	for(let i = 2n; i < upperBound; i ++) {
		result += golombSequence(i ** 3n);
	}
	return result;
};

testing.addUnit("solve()", solve, [
	[10 ** 3, 153506976]
]);
