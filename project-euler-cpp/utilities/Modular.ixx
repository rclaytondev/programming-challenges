export module Modular;

import std;
import MathUtils;

export template<typename N, N modulo> class Modular {
public:
	N value;

	Modular() : value(0) {}
	Modular(N value) : value(value) {}

	friend Modular operator+(const Modular<N, modulo>& num1, const N& num2) {
		return Modular<N, modulo>{ MathUtils::mod(num1.value + num2, modulo) };
	}
	friend Modular<N, modulo> operator+(const N& num1, const Modular<N, modulo>& num2) {
		return Modular<N, modulo>(MathUtils::mod(num1 + num2.value, modulo));
	}
	friend Modular operator+(const Modular<N, modulo>& num1, const Modular<N, modulo>& num2) {
		return Modular<N, modulo>{ MathUtils::mod(num1.value + num2.value, modulo) };
	}
	Modular operator+=(const N& num) {
		this->value = MathUtils::mod(this->value + num, modulo);
		return *this;
	}
	Modular operator+=(const Modular<N, modulo>& num) {
		this->value = MathUtils::mod(this->value + num.value, modulo);
		return *this;
	}


	friend Modular operator-(const Modular<N, modulo>& num1, const N& num) {
		return Modular<N, modulo>{ MathUtils::mod(num1->value - num, modulo) };
	}
	friend Modular<N, modulo> operator-(const N& num1, const Modular<N, modulo>& num2) {
		return Modular<N, modulo>(MathUtils::mod(num1 - num2.value, modulo));
	}
	friend Modular operator-(const Modular<N, modulo>& num1, const Modular<N, modulo>& num2) {
		return Modular<N, modulo>{ MathUtils::mod(num1.value - num2.value, modulo) };
	}
	Modular operator-=(const N& num) {
		this->value = MathUtils::mod(this->value - num, modulo);
		return *this;
	}
	Modular operator-=(const Modular<N, modulo>& num) {
		this->value = MathUtils::mod(this->value - num.value, modulo);
		return *this;
	}


	friend Modular operator*(const Modular& num1, const N& num2) {
		return Modular<N, modulo>{ MathUtils::mod(num1.value * num2, modulo) };
	}
	friend Modular<N, modulo> operator*(const N& num1, const Modular& num2) {
		return Modular<N, modulo>(MathUtils::mod(num1 * num2.value, modulo));
	}
	friend Modular operator*(const Modular<N, modulo>& num1, const Modular<N, modulo>& num2) {
		return Modular<N, modulo>{ MathUtils::mod(num1.value * num2.value, modulo) };
	}
	Modular operator*=(const N& num) {
		this->value = MathUtils::mod(this->value * num, modulo);
		return *this;
	}
	Modular operator*=(const Modular<N, modulo>& num) {
		this->value = MathUtils::mod(this->value * num.value, modulo);
		return *this;
	}


	void operator=(const Modular<N, modulo>& num) {
		this->value = num.value;
	}
	operator N() const {
		return this->value;
	}
	bool operator==(const Modular<N, modulo>& num) const {
		return (this->value - num.value) % modulo == 0;
	}
	friend std::ostream& operator<<(std::ostream& os, const Modular& num) {
		os << num.value;
		return os;
	}
};