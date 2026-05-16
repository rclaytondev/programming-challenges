type Node<T> = { value: T, connections: Node<T> };

export class Graph<T> {
	private nodes: Node<T>;
	private constructor(nodes: Node<T>) {
		this.nodes = nodes;
	}
	
	static fromConnections<T>(connections: Array<[T, T]>) {
		
	}
}
