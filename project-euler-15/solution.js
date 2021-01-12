const paths = function(x, y) {
	if(x < 0 || y < 0) { return 0; }
	if((x === 1 && y === 0) || (x === 0 && y === 1)) { return 1; }
	return paths(x - 1, y) + paths(x, y - 1);
}.memoize(true);

console.log(paths(20, 20));
