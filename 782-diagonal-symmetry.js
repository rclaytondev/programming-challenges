const testConjecture = (size) => {
	for(let numOnes = 0; numOnes <= (size ** 2) / 2; numOnes ++) {
		for(const grid of binaryGrids(size, numOnes)) {
			const rows = grid.rows;
			const columns = grid.columns();
			const numDistinctRows = distinctRows(grid).length;
			const numDistinctColumns = distinctColumns(grid).length;
			const complexity = findComplexity(grid);
			if(numDistinctRows === 3 && numDistinctColumns === 3 && complexity === 3 && !rows.equals(columns)) {
				console.log(`counterexample:`);
				console.log(grid);
				return;
			}
		}
	}
	console.log(`No counterexamples found.`);
};
