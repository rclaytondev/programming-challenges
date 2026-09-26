export module Graph;

import std;

export template<typename T>
class Graph {
private:
	std::map<T, std::set<T>> neighborsMap;
	std::set<std::pair<T, T>> edgeSet;

public:
	Graph() { }
	Graph(const Graph& graph) = default;

	void add(const T& vertex) {
		if (!this->neighborsMap.contains(vertex)) {
			this->neighborsMap[vertex] = {};
		}
	}
	void remove(const T& vertex) {
		this->isolate(vertex);
		this->neighborsMap.erase(vertex);
	}
	bool contains(const T& vertex) const {
		return this->neighborsMap.contains(vertex);
	}
	void connect(const T& vertex1, const T& vertex2) {
		const auto it1 = this->neighborsMap.find(vertex1);
		const auto it2 = this->neighborsMap.find(vertex2);
		const auto end = this->neighborsMap.end();
		if (it1 == end || it2 == end) {
			throw std::out_of_range("Attempted to connect two vertices, but one or both were not in the graph.");
		}
		it1->second.insert(vertex2);
		it2->second.insert(vertex1);
		this->edgeSet.insert(std::make_pair(vertex1, vertex2));
		this->edgeSet.insert(std::make_pair(vertex2, vertex1));
	}
	void disconnect(const T& vertex1, const T& vertex2) {
		const auto it1 = this->neighborsMap.find(vertex1);
		const auto it2 = this->neighborsMap.find(vertex2);
		const auto end = this->neighborsMap.end();
		if (it1 == end || it2 == end) {
			throw std::out_of_range("Attempted to disconnect two vertices, but one or both were not in the graph.");
		}
		it1->second.erase(vertex2);
		it2->second.erase(vertex1);
		this->edgeSet.erase(std::make_pair(vertex1, vertex2));
		this->edgeSet.erase(std::make_pair(vertex2, vertex1));
	}
	bool areConnected(const T& vertex1, const T& vertex2) const {
		const auto it = this->neighborsMap.find(vertex1);
		if (it == this->neighborsMap.end() || !this->neighborsMap.contains(vertex2)) {
			throw std::out_of_range("Attempted to query whether two vertices are connected, but one or both were not in the graph.");
		}
		return it->second.contains(vertex2);
	}


	std::optional<std::pair<T, T>> findEdge() const {
		auto it = this->edgeSet.begin();
		if (it != this->edgeSet.end()) {
			return std::make_optional(*it);
		}
		return std::nullopt;
	}

	void contract(const T& vertex1, const T& vertex2) {
		for (const T& neighbor : this->neighborsMap[vertex2]) {
			if (neighbor != vertex1) {
				this->connect(neighbor, vertex1);
			}
		}
		this->remove(vertex2);
	}

	int numVertices() const {
		return this->neighborsMap.size();
	}

	void isolate(T vertex) {
		this->disconnect(vertex, vertex);
		for (const T& neighbor : this->neighborsMap[vertex]) {
			this->neighborsMap[neighbor].erase(vertex);
			this->edgeSet.erase(std::make_pair(vertex, neighbor));
			this->edgeSet.erase(std::make_pair(neighbor, vertex));
		}
		this->neighborsMap[vertex] = {};
	}
};