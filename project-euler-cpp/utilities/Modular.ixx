export module Modular;

export template<typename N, N modulo> class Modular {
public:
	N value;

	Modular(N value) : value(value) {}

	Modular operator+(N num) {
		return Modular<N, modulo>{ (this->value + num) % modulo };
	}
};