class DirectedGraph {
	constructor() {
		if(arguments.length === 0) {
			this.nodes = new Map();
		}
		else if(
			Array.isArray(arguments[0]) &&
			arguments[0].every(Array.isArray) &&
			arguments[0].every(a => a.length === 2)
		) {
			const [nodes] = arguments;
			this.nodes = new Map();
			for(const [value] of nodes) {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot create Graph: input nodes contain duplicate value '${value}'.`);
				}
				this.nodes.set(value, { value, nodesBefore: new Set(), nodesAfter: new Set() });
			}
			for(const [value, connections] of nodes) {
				this.nodes.get(value).nodesAfter = new Set(connections.map(c => this.nodes.get(c)));
				for(const connection of connections) {
					if(!this.nodes.has(connection)) {
						throw new Error(`Cannot connect '${value}' to '${connection}' as '${connection}' is not in the graph.`);
					}
					const node = this.nodes.get(connection);
					node.nodesBefore.add(this.nodes.get(value));
				}
			}
		}
		else if(Array.isArray(arguments[0]) || arguments[0] instanceof Set) {
			const [values] = arguments;
			this.nodes = new Map();
			for(const value of values) {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot create Graph: input nodes contain duplicate value '${value}'.`);
				}
				const node = { value: value, nodesBefore: new Set(), nodesAfter: new Set() };
				this.nodes.set(value, node);
			}
		}
		else if(arguments[0] instanceof DirectedGraph) {
			const [graph] = arguments;
			this.nodes = new Map();
			for(const value of graph.values()) {
				this.add(value);
			}
			for(const [value, node] of graph.nodes) {
				for(const connected of node.nodesAfter) {
					this.nodes.get(value).nodesAfter.add(this.nodes.get(connected.value));
				}
				for(const connected of node.nodesBefore) {
					this.nodes.get(value).nodesBefore.add(this.nodes.get(connected.value));
				}
			}
		}
		else if(arguments[0] instanceof Grid) {
			const [grid] = arguments;
			this.nodes = new Map();
			grid.forEach(value => {
				if(this.nodes.has(value)) {
					throw new Error(`Cannot construct a graph from a grid containing duplicate values.`);
				}
				this.nodes.set(value, { value: value, nodesBefore: new Set(), nodesAfter: new Set() });
			});
			grid.forEach((value, x, y) => {
				if(x !== 0) {
					this.connect(value, grid.get(x - 1, y));
				}
				if(x !== grid.width() - 1) {
					this.connect(value, grid.get(x + 1, y));
				}
				if(y !== 0) {
					this.connect(value, grid.get(x, y - 1));
				}
				if(y !== grid.height() - 1) {
					this.connect(value, grid.get(x, y + 1));
				}
			});
		}
	}

	size() { return this.nodes.size; }
	values() {
		return [...this.nodes.values()].map(node => node.value);
	}
	connections() {
		const result = [];
		for(const node of this.nodes.values()) {
			for(const connection of node.nodesAfter) {
				result.push([node.value, connection.value]);
			}
		}
		return result;
	}

	has(value) {
		return this.nodes.has(value);
	}
	add(value) {
		if(!this.nodes.has(value)) {
			const node = { value: value, nodesBefore: new Set(), nodesAfter: new Set() };
			this.nodes.set(value, node);
		}
	}
	remove(value) {
		if(this.nodes.has(value)) {
			const node = this.nodes.get(value);
			for(const connectedNode of node.nodesBefore) {
				connectedNode.nodesAfter.delete(node);
			}
			for(const connectedNode of node.nodesAfter) {
				connectedNode.nodesBefore.delete(node);
			}
			this.nodes.delete(value);
		}
	}
	areConnected(value1, value2) {
		if(!this.nodes.has(value1)) {
			throw new Error(`Expected the graph to contain '${value1}.'`);
		}
		if(!this.nodes.has(value2)) {
			throw new Error(`Expected the graph to contain '${value2}.'`);
		}
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		return node1.nodesAfter.has(node2);
	}
	connect(value1, value2) {
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		node1.nodesAfter.add(node2);
		node2.nodesBefore.add(node1);
	}
	disconnect(value1, value2) {
		const node1 = this.nodes.get(value1);
		const node2 = this.nodes.get(value2);
		node1.nodesAfter.delete(node2);
		node2.nodesBefore.delete(node1);
	}

	setConnection(value1, value2, connected) {
		if(connected) {
			this.connect(value1, value2);
		}
		else {
			this.disconnect(value1, value2);
		}
	}
	setConnections(callback) {
		for(const node1 of this.nodes.values()) {
			for(const node2 of this.nodes.values()) {
				this.setConnection(
					node1.value,
					node2.value,
					callback(node1.value, node2.value, this)
				);
			}
		}
	}
	toggleConnection(value1, value2) {
		if(this.areConnected(value1, value2)) {
			this.disconnect(value1, value2);
		}
		else {
			this.connect(value1, value2);
		}
	}

	paths(starts, ends, length) {
		let paths = starts.map(startValue => [startValue]);
		for(let i = 0; i < length; i ++) {
			const newPaths = [];
			for(const path of paths) {
				const lastStep = path[path.length - 1];
				const node = this.nodes.get(lastStep);
				for(const connection of node.nodesAfter) {
					newPaths.push([...path, connection.value]);
				}
			}
			paths = newPaths;
			if(paths.length === 0) { return new Set(); }
		}
		return new Set(paths.filter(p => ends.includes(p[p.length - 1])));
	}
	pathExists(starts, ends, length) {
		let reachables = new Set(starts.map(s => this.nodes.get(s)));
		const nodes = [...this.nodes.values()];
		nodes.forEach((node, index) => {
			// assign each node an ID (this will be deleted when the algorithm finishes)
			node.id = index;
		});
		const pastStates = new Map();
		for(let i = 0; i < length; i ++) {
			if(reachables.size === 0) { return false; }
			const newReachables = new Set();
			for(const reachable of reachables) {
				for(const newReachable of reachable.nodesAfter) {
					newReachables.add(newReachable);
				}
			}
			reachables = newReachables;
			const stateString = [...reachables].map(n => n.id).sort((a, b) => a - b).join(",");
			if(pastStates.has(stateString)) {
				const lastTime = pastStates.get(stateString);
				i += (i - lastTime) * Math.floor((length - i) / (i - lastTime));
			}
			pastStates.set(stateString, i);
		}
		for(const node of nodes) { delete node.id; }
		const reachableValues = reachables.map(r => r.value);
		return ends.some(e => reachableValues.has(e));
	}
	numPaths(starts, ends, length) {
		starts = new Set(starts);
		ends = [...ends];
		let paths = new Map();
		for(const [_, node] of this.nodes) {
			paths.set(node, starts.has(node.value) ? 1 : 0);
		}
		for(let i = 0; i < length; i ++) {
			const newPaths = new Map();
			for(const [node, numPaths] of paths) {
				for(const connectedNode of node.nodesAfter) {
					if(!newPaths.has(connectedNode)) {
						newPaths.set(connectedNode, numPaths);
					}
					else {
						newPaths.set(connectedNode, newPaths.get(connectedNode) + numPaths);
					}
				}
			}
			paths = newPaths;
		}
		return ends.sum(e => paths.get(this.nodes.get(e)));
	}
}
