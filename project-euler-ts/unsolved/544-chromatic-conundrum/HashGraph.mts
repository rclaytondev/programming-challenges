import { Graph } from "./Graph.mjs";

export class HashGraph<V> {
	private graph: Graph<string>;
	private hashMap: Map<string, V>;
	private hashFunction: (vertex: V) => string;
	
	private constructor(graph: Graph<string>, hashMap: Map<string, V>, hashFunction: (vertex: V) => string = (v: V) => `${v}`) {
		this.graph = graph;
		this.hashMap = hashMap;
		this.hashFunction = hashFunction;
	}
	static emptyGraph<V>(vertices: Iterable<V>, hashFunction: (vertex: V) => string = (v: V) => `${v}`) {
		const hashes = new Map();
		for(const vertex of vertices) {
			hashes.set(hashFunction(vertex), vertex);
		}
		return new HashGraph(
			Graph.emptyGraph([...vertices].map(hashFunction)),
			hashes,
			hashFunction,
		);
	}
	static fromEdgesList<V>(vertices: Iterable<V>, edges: Iterable<[V, V]>) {
		const graph = HashGraph.emptyGraph<V>(vertices);
		for(const [v1, v2] of edges) {
			graph.setConnected(v1, v2, true);
		}
		return graph;
	}
	static fromFunction<V>(vertices: Iterable<V>, areConnected: (v1: V, v2: V) => boolean, hashFunction: (vertex: V) => string = (v) => `${v}`) {
		const verticesList = [...vertices];
		const graph = HashGraph.emptyGraph<string>(verticesList.map(v => hashFunction(v)));
		for(const [i, vertex] of verticesList.entries()) {
			for(let j = i + 1; j <= verticesList.length; j ++) {
				if(areConnected(vertex, verticesList[j])) {
					graph.connect(hashFunction(vertex), hashFunction(verticesList[j]));
				}
			}
		}
		return graph;
	}

	add(vertex: V) {
		const hash = this.hashFunction(vertex);
		this.graph.add(hash);
		this.hashMap.set(hash, vertex);
		return this;
	}
	delete(vertex: V) {
		const hash = this.hashFunction(vertex);
		this.graph.delete(hash);
		this.hashMap.delete(hash);
		return this;
	}
	has(vertex: V) {
		return this.graph.has(this.hashFunction(vertex));
	}

	setConnected(vertex1: V, vertex2: V, connected: boolean) {
		this.graph.setConnected(this.hashFunction(vertex1), this.hashFunction(vertex2), connected);
		return this;
	}
	connect(vertex1: V, vertex2: V) {
		this.graph.setConnected(this.hashFunction(vertex1), this.hashFunction(vertex2), true);
		return this;
	}
	disconnect(vertex1: V, vertex2: V) {
		this.graph.setConnected(this.hashFunction(vertex1), this.hashFunction(vertex2), false);
		return this;
	}
	areConnected(vertex1: V, vertex2: V) {
		return this.graph.areConnected(this.hashFunction(vertex1), this.hashFunction(vertex2));
	}

	identify(vertices: Iterable<V>, newVertexLabel: V) {
		const verticesList = [...vertices];
		const hashes = verticesList.map(v => this.hashFunction(v));
		const newVertexHash = this.hashFunction(newVertexLabel);
		this.graph.identify(hashes, newVertexHash);
		for(const hash of hashes) {
			this.hashMap.delete(hash);
		}
		this.hashMap.set(newVertexHash, newVertexLabel);
		return this;
	}

	neighbors(vertex: V) {
		return new Set([...this.graph.neighbors(this.hashFunction(vertex))].map(v => this.hashMap.get(v) as V));
	}

	isEmpty() {
		return this.graph.isEmpty();
	}

	*vertices() {
		yield* this.hashMap.values();
	}
	numVertices() {
		return this.graph.numVertices();
	}
	*edges() {
		for(const [hash1, hash2] of this.graph.edges()) {
			yield [this.hashMap.get(hash1)!, this.hashMap.get(hash2)!] as [V, V];
		}
	}

	map<W>(callback: (vertex: V) => W, newHashFunction: (vertex: W) => string = (w) => `${w}`) {
		const graph = this.graph.map(hash => newHashFunction(callback(this.hashMap.get(hash) as V)));
		const hashMap = new Map([...this.hashMap.values()].map(vertex => {
			const w = callback(vertex);
			return [newHashFunction(w), w];
		}));
		return new HashGraph(graph, hashMap, newHashFunction);
	}
	copy() {
		return this.map(x => x);
	}
}
