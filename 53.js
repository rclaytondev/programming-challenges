const solve = () => {
	let result = 0;
	for(let n = 1; n <= 100; n ++) {
		for(let r = 0; r <= n; r ++) {
			if(Math.combination(n, r) > 1e6) {
				result ++;
			}
		}
	}
	return result;
};
