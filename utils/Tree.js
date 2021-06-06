class Tree {
	static *iterate(root, getChildren, leavesOnly) {
		const GeneratorFunction = (function*() {}).constructor;
		if(getChildren instanceof GeneratorFunction) {
			const stack = [];
			stack.push({
				value: root,
				generator: getChildren(root),
				numChildren: 0
			});
			if(!leavesOnly) { yield root; }
			while(stack.length !== 0) {
				const lastItem = stack[stack.length - 1];
				const next = lastItem.generator.next();
				if(next.done) {
					if(leavesOnly && lastItem.numChildren === 0) {
						yield lastItem.value;
					}
					stack.pop();
					continue;
				}
				lastItem.numChildren ++;
				const value = next.value;
				stack.push({
					value: value,
					generator: getChildren(value),
					numChildren: 0
				});
				if(!leavesOnly) { yield value; }
			}
		}
		else {
			const stack = [];
			stack.push({
				item: root,
				children: getChildren(root),
				childIndex: 0
			});
			if(stack[0].children.length === 0 || !leavesOnly) {
				yield stack[0].item;
			}
			while(stack.length !== 0) {
			const lastItem = stack[stack.length - 1];
			if(lastItem.childIndex >= lastItem.children.length) {
				stack.pop();
				continue;
			}
			const nextChild = lastItem.children[lastItem.childIndex];
			const childrenOfChild = getChildren(nextChild);
			if(childrenOfChild.length === 0 || !leavesOnly) {
				yield nextChild;
			}
			stack.push({
				item: nextChild,
				children: childrenOfChild ?? [],
				childIndex: 0
			});
			lastItem.childIndex ++;
		}
		}
	}

	constructor(root, getChildren) {

	}
}
