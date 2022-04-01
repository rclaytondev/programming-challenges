String.method(function occurences(substring) {
	let occurences = 0;
	for(let i = 0; i < this.length - substring.length + 1; i ++) {
		if(this.slice(i, i + substring.length) === substring) {
			occurences ++;
		}
	}
	return occurences;
});
