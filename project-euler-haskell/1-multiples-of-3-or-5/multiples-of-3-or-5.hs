main = do
    print(solve 999)

divides a b = mod b a == 0
solve upperBound = sum(filter (\n -> divides 3 n || divides 5 n) [1 .. upperBound])
