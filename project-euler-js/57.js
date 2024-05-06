const nthFraction = (function nthFraction(n) {
	if(n === 1) {
		return new Rational(3, 2);
	}
	return nthFraction(n - 1).add(new Rational(1)).reciprocal().add(new Rational(1));
}).memoize(true);
testing.addUnit("nthFraction()", (n) => nthFraction(n).toString(), [
	[1, "3/2"],
	[2, "7/5"],
	[3, "17/12"],
	[4, "41/29"],
	[5, "99/70"],
	[6, "239/169"],
	[7, "577/408"],
	[8, "1393/985"],
	[20, "54608393/38613965"] // calculated using a correct version of the algorithm
]);
const solve = () => {
	let result = 0;
	for(let i = 1; i <= 1000; i ++) {
		const fraction = nthFraction(i).simplify();
		const numeratorDigits = fraction.numerator.toString().length;
		const denominatorDigits = fraction.denominator.toString().length;
		if(numeratorDigits > denominatorDigits) {
			result ++;
		}
	}
	return result;
};
