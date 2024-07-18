main = do
    print(solve 4000000 0 1)

solve :: Int -> Int -> Int -> Int
solve upperBound fib1 fib2
    | next >= upperBound       = 0
    | even next                = next + solve upperBound fib2 next
    | otherwise                = solve upperBound fib2 next
    where next = fib1 + fib2
