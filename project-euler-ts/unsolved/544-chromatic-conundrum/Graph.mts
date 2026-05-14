type Node<V> = { value: V, neighbors: Set<Node<V>> };

export class Graph<V> {
	private nodes: Map<V, Node<V> >;
	private constructor(nodes: Map<V, Node<V>>) {
		this.nodes = nodes;
	}

	static emptyGraph<V>(vertices: Iterable<V>) {
		const nodesMap = new Map<V, Node<V>>();
		for(const v of vertices) {
			nodesMap.set(v, { value: v, neighbors: new Set() });
		}
		return new Graph(nodesMap);
	}
	static fromEdgesList<V>(vertices: Iterable<V>, edges: Iterable<[V, V]>) {
		const graph = Graph.emptyGraph<V>(vertices);
		for(const [v1, v2] of edges) {
			graph.setConnected(v1, v2, true);
		}
		return graph;
	}

	add(vertex: V) {
		if(this.nodes.get(vertex)) {
			return;
		}
		this.nodes.set(vertex, { value: vertex, neighbors: new Set() });
		return this;
	}
	delete(vertex: V) {
		const node = this.nodes.get(vertex);
		if(!node) {
			return;
		}
		for(const neighbor of node.neighbors) {
			neighbor.neighbors.delete(node);
		}
		this.nodes.delete(vertex);
		return this;
	}
	has(vertex: V) {
		return this.nodes.has(vertex);
	}

	private setNodesConnected(node1: Node<V>, node2: Node<V>, connected: boolean) {
		if(connected) {
			node1.neighbors.add(node2);
			node2.neighbors.add(node1);
		}
		else {
			node1.neighbors.delete(node2);
			node2.neighbors.delete(node1);
		}
	}
	setConnected(vertex1: V, vertex2: V, connected: boolean) {
		const node1 = this.nodes.get(vertex1);
		const node2 = this.nodes.get(vertex2);
		if(node1 == undefined || node2 == undefined) {
			throw new Error("Cannot connect vertices: the provided vertices were not in the graph.");
		}
		this.setNodesConnected(node1, node2, connected);
		return this;
	}
	connect(vertex1: V, vertex2: V) {
		this.setConnected(vertex1, vertex2, true);
		return this;
	}
	disconnect(vertex1: V, vertex2: V) {
		this.setConnected(vertex1, vertex2, false);
		return this;
	}
	areConnected(vertex1: V, vertex2: V) {
		const node1 = this.nodes.get(vertex1);
		const node2 = this.nodes.get(vertex2);
		if(!node1 || !node2) {
			throw new Error("The provided vertex was not in the graph.");
		}
		return node1.neighbors.has(node2);
	}

	identify(vertices: Iterable<V>, newVertexLabel: V) {
		const verticesList = [...vertices];
		const nodes = verticesList.map(v => {
			const node = this.nodes.get(v);
			if(!node) {
				throw new Error("The provided vertex was not in the graph.");
			}
			return node;
		});
		const nodesSet = new Set(nodes);
		const neighbors = [];
		for(const node of nodes) {
			for(const neighbor of node.neighbors) {
				if(!nodesSet.has(neighbor)) {
					neighbors.push(neighbor);
				}
				neighbor.neighbors.delete(node);
			}
			this.nodes.delete(node.value);
		}
		if(this.has(newVertexLabel)) {
			throw new Error("Cannot identify vertices: the label for the new vertex was already in use.");
		}
		this.add(newVertexLabel);
		for(const neighbor of neighbors) {
			this.connect(newVertexLabel, neighbor.value);
		}
		return this;
	}

	neighbors(vertex: V) {
		const node = this.nodes.get(vertex);
		if(!node) {
			throw new Error("The provided vertex was not in the graph.");
		}
		return new Set([...node.neighbors].map(n => n.value));
	}

	isEmpty() {
		return [...this.nodes.values()].every(n => n.neighbors.size === 0);
	}

	*vertices() {
		yield* this.nodes.keys();
	}
	numVertices() {
		return this.nodes.size;
	}

	*edges() {
		const vertices = [...this.nodes.keys()];
		const vertexIndices = new Map<V, number>();
		for(const [i, vertex] of vertices.entries()) {
			vertexIndices.set(vertex, i);
		}
		for(const [i, vertex] of vertices.entries()) {
			for(const neighbor of this.nodes.get(vertex)!.neighbors) {
				if(vertexIndices.get(neighbor.value)! >= i) {
					yield [vertex, neighbor.value] as [V, V];
				}
			}
		}
	}

	map<W>(callback: (vertex: V) => W) {
		const result = Graph.emptyGraph([...this.vertices()].map(callback));
		for(const node of this.nodes.values()) {
			for(const neighbor of node.neighbors) {
				result.connect(callback(node.value), callback(neighbor.value));
			}
		}
		return result;
	}
	copy() {
		return this.map(x => x);
	}
}
