main = do
    print(solve 999)

solve 0 = 0
solve upperBound = if mod upperBound 3 == 0 || mod upperBound 5 == 0 then upperBound + solve(upperBound - 1) else solve(upperBound - 1)
