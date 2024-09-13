type Node<T> = { value: T, parent: Node<T> | null, children: Set<Node<T>> };

export class Partition<T> {
	/* Implements partition operations efficiently using a disjoint-sets forest. */
	private nodes: Map<T, Node<T>>;
	private constructor(nodes: Map<T, Node<T>>) {
		this.nodes = nodes;
	}
	static empty<T>() {
		return new Partition<T>(new Map());
	}
	static fromSets<T>(sets: Iterable<Iterable<T>>) {
		const result = Partition.empty<T>();
		for(const iterable of sets) {
			const set = new Set(iterable);
			if(set.size !== 0) {
				const [first, ...others] = set;
				result.add(first);
				for(const value of others) {
					result.add(value);
					result.merge(first, value);
				}
			}
		}
		return result;
	}

	add(value: T) {
		/* Time complexity: O(1) */
		if(!this.nodes.has(value)) {
			this.nodes.set(value, { value: value, parent: null, children: new Set() });
		}
	}
	merge(value1: T, value2: T) {
		/* Time complexity: O(h), where h is the depth of the nodes. */
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		if(!node1 || !node2) {
			throw new Error("Cannot merge nodes: at least one of the two provided nodes was not in the partition.");
		}
		const root1 = this.getRoot(value1);
		const root2 = this.getRoot(value2);
		if(root1 !== root2) {
			this.moveNode(root1, root2);
		}
	}
	private getRoot(value: T) {
		/* Time complexity: O(h), where h is the depth of the node. */
		let node = this.nodes.get(value);
		if(!node) {
			throw new Error(`Cannot get representative of value ${value}: it was not in the partition.`);
		}
		const visitedNodes = [];
		while(node.parent !== null) {
			visitedNodes.push(node);
			node = node.parent;
		}
		for(const visitedNode of visitedNodes) {
			this.moveNode(visitedNode, node);
		}
		return node;
	}
	representative(value: T) {
		return this.getRoot(value).value;
	}

	private moveNode(node: Node<T>, newParent: Node<T>) {
		node.parent?.children.delete(node);
		node.parent = newParent;
		newParent.children.add(node);
	}
}
