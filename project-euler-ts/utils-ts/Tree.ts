import { assert } from "chai";

export class Tree {
	static *leaves<T>(root: T, getChildren: (node: T) => T[] | Generator<T>) {
		const childrenGenerator = function*(node: T) { yield* getChildren(node); };

		type StackItem = { value: T, generator: Generator<T>, hasChildren: boolean };
		const stack: StackItem[] = [{ value: root, generator: childrenGenerator(root), hasChildren: false }];
		while(stack.length !== 0) {
			const currentItem = stack[stack.length - 1];
			const nextChild = currentItem.generator.next();
			if(nextChild.done) {
				stack.pop();
				if(!currentItem.hasChildren) {
					yield currentItem.value;
				}
			}
			else {
				currentItem.hasChildren = true;
				stack.push({ value: nextChild.value, generator: childrenGenerator(nextChild.value), hasChildren: false });
			}
		}
	}
}

describe("Tree.leaves", () => {
	it("iterates through the leaves of the tree", () => {
		const ALPHABET = ["A", "B", "C"];
		const getChildren = (str: string) => {
			if(str.length < 3) {
				return ALPHABET.map(char => str + char)
			}
			else { return []; }
		};
		const rootNode = "A";
		const results: string[] = [];
		for(const str of Tree.leaves(rootNode, getChildren)) {
			results.push(str);
		}
		assert.sameOrderedMembers(results, [
			"AAA",
			"AAB",
			"AAC",
			"ABA",
			"ABB",
			"ABC",
			"ACA",
			"ACB",
			"ACC",
		]);
	});
	it("works when the root is the only leaf", () => {
		const results = [...Tree.leaves(0, () => [])];
		assert.sameMembers(results, [0]);
	});
});
