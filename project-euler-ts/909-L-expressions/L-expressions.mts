export type LExpression = number | "A" | "Z" | "S" | LExpression[];

const applyRules = (expression: LExpression) => {
	if(Array.isArray(expression)) {
		for(let i = 0; i < expression.length; i ++) {
			const value = expression[i];
			if(value === "A" && i + 1 < expression.length && typeof expression[i + 1] === "number") {
				expression.splice(i, 2, (expression[i + 1] as number) + 1);
				i = Math.max(0, i - 1);
			}
			else if(value === "Z" && i + 2 < expression.length) {
				expression.splice(i, 3, expression[i + 2]);
				i = Math.max(0, i - 1);
			}
			else if(value === "S" && i + 3 < expression.length) {
				const [u, v, w] = expression.slice(i + 1);
				expression.splice(i, 4, [v, [u, v, w]]);
				// i = Math.
			}
		}
	}
};

export const evaluate = (expression: LExpression) => {
	while(typeof expression !== "number") {
		expression = applyRules(expression);
	}
	return expression;
};
