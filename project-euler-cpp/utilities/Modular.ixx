export module Modular;

export template<typename N> class Modular {
public:
	N value;
	const N modulo;

	Modular(N value, N modulo) : value(value), modulo(modulo) {}

	Modular operator+(N num) {
		return Modular{ (this->value + num) % this->modulo, this->modulo };
	}
};