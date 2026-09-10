export module Modular;

import std;
import MathUtils;

export template<typename N, N modulo> class Modular {
public:
	N value;

	Modular() : value(0) {}
	Modular(N value) : value(value) {}

	Modular operator+(const N& num) const {
		return Modular<N, modulo>{ MathUtils::mod(this->value + num, modulo) };
	}
	friend Modular<N, modulo> operator+(const N& num1, const Modular& num2) {
		return Modular<N, modulo>(MathUtils::mod(num1 + num2.value, modulo));
	}
	Modular operator+(const Modular<N, modulo>& num) const {
		return Modular<N, modulo>{ MathUtils::mod(this->value + num.value, modulo) };
	}
	void operator+=(const N& num) {
		this->value = MathUtils::mod(this->value + num, modulo);
	}
	void operator+=(const Modular<N, modulo>& num) {
		this->value = MathUtils::mod(this->value + num.value, modulo);
	}


	Modular operator-(const N& num) const {
		return Modular<N, modulo>{ MathUtils::mod(this->value - num, modulo) };
	}
	friend Modular<N, modulo> operator-(const N& num1, const Modular& num2) {
		return Modular<N, modulo>(MathUtils::mod(num1 - num2.value, modulo));
	}
	Modular operator-(const Modular<N, modulo>& num) const {
		return Modular<N, modulo>{ MathUtils::mod(this->value - num.value, modulo) };
	}
	void operator-=(const N& num) {
		this->value = MathUtils::mod(this->value - num, modulo);
	}
	void operator-=(const Modular<N, modulo>& num) {
		this->value = MathUtils::mod(this->value - num.value, modulo);
	}


	Modular operator*(const N& num) const {
		return Modular<N, modulo>{ MathUtils::mod(this->value * num, modulo) };
	}
	friend Modular<N, modulo> operator*(const N& num1, const Modular& num2) {
		return Modular<N, modulo>(MathUtils::mod(num1 * num2.value, modulo));
	}
	Modular operator*(const Modular<N, modulo>& num) const {
		return Modular<N, modulo>{ MathUtils::mod(this->value * num.value, modulo) };
	}
	Modular operator*=(const N& num) {
		this->value = MathUtils::mod(this->value * num, modulo);
	}
	Modular operator*=(const Modular<N, modulo>& num) {
		this->value = MathUtils::mod(this->value * num.value, modulo);
	}


	void operator=(const Modular<N, modulo>& num) {
		this->value = num.value;
	}
	bool operator==(const Modular<N, modulo>& num) const {
		return (this->value - num.value) % modulo == 0;
	}
	friend std::ostream& operator<<(std::ostream& os, const Modular& num) {
		os << num.value;
		return os;
	}
};