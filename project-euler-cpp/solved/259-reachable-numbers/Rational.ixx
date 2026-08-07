module;

import <boost/container_hash/hash.hpp>;

export module Rational;

import std;

export class Rational {
public:
	const int numerator;
	const int denominator;

	Rational(int numerator) : numerator(numerator), denominator(1) { }
	Rational(int numerator, int denominator) : numerator(numerator), denominator(denominator) {
		if (denominator == 0) {
			throw std::runtime_error("Cannot construct a Rational with a denominator of 0.");
		}
	}

	Rational simplify() const {
		int gcd = std::gcd(this->numerator, this->denominator);
		if (this->denominator < 0) {
			return Rational{ -this->numerator / gcd, -this->denominator / gcd };
		}
		else {
			return Rational{ this->numerator / gcd, this->denominator / gcd };
		}
	}

	bool isInt() const {
		return this->numerator % this->denominator == 0;
	}

	friend std::ostream& operator<< (std::ostream& out, const Rational& rational) {
		out << rational.numerator << "/" << rational.denominator;
		return out;
	}
	bool operator==(const Rational& rational) const {
		return this->numerator * rational.denominator == this->denominator * rational.numerator;
	}
	Rational operator+(const Rational& rational) const {
		return Rational{
			this->numerator * rational.denominator + this->denominator * rational.numerator,
			this->denominator * rational.denominator
		};
	}
	Rational operator-(const Rational& rational) const {
		return Rational{
			this->numerator * rational.denominator - this->denominator * rational.numerator,
			this->denominator * rational.denominator
		};
	}
	Rational operator*(const Rational& rational) const {
		return Rational{
			this->numerator * rational.numerator,
			this->denominator * rational.denominator
		};
	}
	Rational operator/(const Rational& rational) const {
		return Rational{
			this->numerator * rational.denominator,
			this->denominator * rational.numerator
		};
	}
};

export struct RationalHasher {
	std::size_t operator()(const Rational& rational) const noexcept {
		Rational simplified = rational.simplify();
		std::size_t hash = 0;
		boost::hash_combine(hash, rational.numerator);
		boost::hash_combine(hash, rational.denominator);
		return hash;
	}
};
