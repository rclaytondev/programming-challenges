import Data.Maybe (isNothing)

filterMaybe predicate optionalValue = case optionalValue of
    Nothing -> Nothing
    Just value -> if predicate value then Just value else Nothing

data Point = Point Float Float deriving (Eq, Show)

data Linear = Ray Point Point | Line Point Point | Segment Point Point deriving Show

toLine(Line point1 point2) = Line point1 point2
toLine(Ray point1 point2) = Line point1 point2
toLine(Segment point1 point2) = Line point1 point2

slope(Line (Point x1 y1) (Point x2 y2)) = (y2 - y1) / (x2 - x1)

yIntercept(Line (Point x1 y1) point2) = -(m * x1) + y1
    where m = slope (Line (Point x1 y1) point2)

isVertical(Line (Point x1 y1) (Point x2 y2)) = x1 == x2

isBetween value bound1 bound2 = (value > min bound1 bound2) && (value < max bound1 bound2)

isInBoundingBox (Point x1 y1) (Ray (Point x2 y2) (Point x3 y3)) = not(isBetween x2 x1 x3) && not(isBetween y2 y1 y3)

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
intersection line ray = filterMaybe (`isInBoundingBox` ray) (intersection line (toLine ray))

data Triangle = Triangle Point Point Point deriving Show

edges (Triangle vertex1 vertex2 vertex3) = [ Line vertex1 vertex2, Line vertex2 vertex3, Line vertex1 vertex3 ]

main = do
    print(intersection line1 line2)
    where
        line1 = Line (Point (-1) (-1)) (Point 1 1)
        line2 = Line (Point (-1) 1) (Point 1 (-1))
