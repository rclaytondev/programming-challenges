import { Utils } from "../../utils-ts/modules/Utils.mjs";

const fibonacci = Utils.memoize(function(n: number): number {
	if(n === 0) { return 1; }
	if(n === 1) { return 2; }
	return fibonacci(n-1) + fibonacci(n-2);
});
// console.log(fibonacci(30));
// debugger;
