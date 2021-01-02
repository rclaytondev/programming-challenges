outerLoop: for(let a = 0; a < 1000; a ++) {
	for(let b = 0; b < 1000; b ++) {
		const c = Math.sqrt(a * a + b * b);
		if(c === Math.round(c) && a + b + c === 1000 && a !== 0 && b !== 0 && c !== 0) {
			console.log(a, b, c);
			const product = a * b * c;
			console.log(product);
			break outerLoop;
		}
	}
}
