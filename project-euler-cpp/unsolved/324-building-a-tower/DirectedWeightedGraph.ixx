export module DirectedWeightedGraph;

import std;

export template<typename T, typename N = long long>
class DirectedWeightedGraph {
private:
	std::map<T, std::map<T, N>> outEdgesMap;
	std::map<T, std::map<T, N>> inEdgesMap;

public:
	DirectedWeightedGraph() {}
	DirectedWeightedGraph(const DirectedWeightedGraph& graph) = default;
	template<typename It>
	DirectedWeightedGraph(It begin, It end) {
		for (auto it = begin; it != end; it++) {
			this->outEdgesMap[*it] = {};
			this->inEdgesMap[*it] = {};
		}
	}

	void add(const T& vertex) {
		if (!this->outEdgesMap.contains(vertex)) {
			this->outEdgesMap[vertex] = {};
			this->inEdgesMap[vertex] = {};
		}
	}
	bool contains(const T& vertex) const {
		return this->outEdgesMap.contains(vertex);
	}
	std::size_t size() const {
		return this->outEdgesMap.size();
	}
	void connect(const T& start, const T& end, N weight) {
		const auto it1 = this->outEdgesMap.find(start);
		const auto it2 = this->inEdgesMap.find(end);
		if (it1 == this->outEdgesMap.end() || it2 == this->inEdgesMap.end()) {
			throw std::out_of_range("Attempted to connect two vertices, but one or both were not in the graph.");
		}
		it1->second[end] = weight;
		it2->second[start] = weight;
	}
	void disconnect(const T& start, const T& end) {
		const auto it1 = this->outEdgesMap.find(start);
		const auto it2 = this->inEdgesMap.find(end);
		if (it1 == this->outEdgesMap.end() || it2 == this->inEdgesMap.end()) {
			throw std::out_of_range("Attempted to connect two vertices, but one or both were not in the graph.");
		}
		it1->second.erase(end);
		it2->second.erase(start);
	}
	bool areConnected(const T& vertex1, const T& vertex2) const {
		return this->edgeWeight(vertex1, vertex2).has_value();
	}
	std::optional<N> edgeWeight(const T& start, const T& end) const {
		auto it = this->outEdgesMap.find(start);
		if (it == this->outEdgesMap.end()) {
			throw std::out_of_range("Attempted to get the edge weight between two vertices, but one or both were not in the graph.");
		}
		auto edgeIt = it->second.find(end);
		if (edgeIt == it->second.end()) {
			return std::nullopt;
		}
		return edgeIt->second;
	}
};