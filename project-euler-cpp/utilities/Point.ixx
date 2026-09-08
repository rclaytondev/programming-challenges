export module Point;

export template<typename N>
class Point {
public:
	N x;
	N y;

	Point(N x, N y) : x(x), y(y) { }
};