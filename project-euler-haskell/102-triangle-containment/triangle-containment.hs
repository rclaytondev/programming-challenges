import Data.Maybe (isNothing, isJust, fromJust)
import Data.Foldable (find)

class PointContainer a where
    contains :: a -> Point -> Bool

filterMaybe predicate optionalValue = case optionalValue of
    Nothing -> Nothing
    Just value -> if predicate value then Just value else Nothing

count predicate array = length(filter predicate array)

data Point = Point Float Float deriving (Eq, Show)

plus (Point a b) (Point c d) = Point (a + c) (b + d)

opposite (Point a b) = Point (-a) (-b)

data Linear = Ray Point Point | Line Point Point | Segment Point Point deriving Show

toLine(Line point1 point2) = Line point1 point2
toLine(Ray point1 point2) = Line point1 point2
toLine(Segment point1 point2) = Line point1 point2

slope(Line (Point x1 y1) (Point x2 y2)) = (y2 - y1) / (x2 - x1)

yIntercept(Line (Point x1 y1) point2) = -(m * x1) + y1
    where m = slope (Line (Point x1 y1) point2)

isVertical(Line (Point x1 y1) (Point x2 y2)) = x1 == x2

isBetween value bound1 bound2 = (value >= min bound1 bound2) && (value <= max bound1 bound2)

isStrictlyBetween value bound1 bound2 = (value > min bound1 bound2) && (value < max bound1 bound2)

isInBoundingBox point1@(Point x1 y1) (Ray point2@(Point x2 y2) point3@(Point x3 y3)) = 
    not(isStrictlyBetween x2 x1 x3) && 
    not(isStrictlyBetween y2 y1 y3) && 
    point1 /= point2 && point1 /= point3
isInBoundingBox point@(Point x1 y1) (Segment endpoint1@(Point x2 y2) endpoint2@(Point x3 y3)) =
    isBetween x1 x2 x3 && isBetween y1 y2 y3 && point /= endpoint1 && point /= endpoint2
isInBoundingBox point@(Point _ _) line@(Line _ _) = True

intersection :: Linear -> Linear -> Maybe Point
intersection line1@(Line point1@(Point x1 y1) point2) line2@(Line point3 point4)
    | isVertical1 && isVertical2 = Nothing
    | isVertical1 && not isVertical2 = Just (Point x1 (m2 * x1 + b2))
    | isVertical2 && not isVertical1 = intersection line2 line1
    | m1 == m2 = Nothing
    | otherwise = Just(Point x y)
    where
        isVertical1 = isVertical line1
        isVertical2 = isVertical line2
        m1 = slope line1
        m2 = slope line2
        b1 = yIntercept line1
        b2 = yIntercept line2
        x = (b2 - b1) / (m1 - m2)
        y = m1 * x + b1
intersection linear1 linear2 = filterMaybe (\v -> (v `isInBoundingBox` linear1) && (v `isInBoundingBox` linear2)) (intersection (toLine linear1) (toLine linear2))

intersects linear1 linear2 = isJust(intersection linear1 linear2)

instance PointContainer Linear where
    line@(Line (Point x1 y1) _) `contains` (Point x3 y3)
        | isVertical line = x1 == x3
        | otherwise = (y3 - y1) / (x3 - x1) == slope line
    ray@(Ray _ _) `contains` point = (toLine ray `contains` point) && (point `isInBoundingBox` ray)

data Triangle = Triangle Point Point Point deriving Show

edges (Triangle vertex1 vertex2 vertex3) = [ Segment vertex1 vertex2, Segment vertex2 vertex3, Segment vertex1 vertex3 ]

verticesOf (Triangle vertex1 vertex2 vertex3) = [vertex1, vertex2, vertex3]

standardRays = [Ray (Point 0 0) (Point 1 0), Ray (Point 0 0) (Point 1 1),  Ray (Point 0 0) (Point 0 1), Ray(Point 0 0) (Point (-1) 1)]

rayToCast triangle = fromJust(find (\ray -> not(any (ray `contains`) (verticesOf triangle))) standardRays)

translate point (Triangle vertex1 vertex2 vertex3) = Triangle(vertex1 `plus` point) (vertex2 `plus` point) (vertex3 `plus` point)

instance PointContainer Triangle where
    triangle `contains` point = odd(count (`intersects` ray) (edges translatedTriangle))
        where 
            translatedTriangle = translate (opposite point) triangle
            ray = rayToCast translatedTriangle

main = do
    print(triangle `contains` point)
    where
        -- triangle = Triangle (Point (-340) 495) (Point (-153) (-910)) (Point 835 (-947))
        triangle = Triangle (Point (-175) 41) (Point (-421) (-714)) (Point 574 (-645))
        -- triangle = Triangle ()
        point = Point 0 0
    -- print(intersection line1 line2)
    -- where
    --     line1 = Line (Point (-1) (-1)) (Point 1 1)
    --     line2 = Line (Point (-1) 1) (Point 1 (-1))
