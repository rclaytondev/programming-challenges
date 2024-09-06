import Data.List (find)
import Data.Maybe (fromJust)
import qualified Data.Set as Set

-- ----------------- --
-- Utility Functions --
-- ----------------- --

divides a b = b `mod` a == 0

isPrime num = num >= 2 && not(any (`divides` num) [2 .. num - 1])

nextPrime prime = fromJust(find isPrime [prime + 1 ..])

primes = iterate nextPrime (2 :: Integer)

minEntry f [x] = (x, f x)
minEntry f (x:xs) = if value < minOutput then (x, value) else (minValue, minOutput)
    where
        value = f x
        (minValue, minOutput) = minEntry f xs

argmin f arr = fst(minEntry f arr)

minIndex [x] = 0
minIndex (x:xs) = if x < xs !! min then 0 else min + 1
    where min = minIndex xs

replace (x:xs) 0 value = value : xs
replace (x:xs) index value = x : replace xs (index - 1) value

replaceWith 0 f (x:xs) = f x : xs
replaceWith index f (x:xs) = x : replaceWith (index - 1) f xs

endWith array value = if last array == value then array else array ++ [value]

pop [] = []
pop [x] = []
pop (x:xs) = x : pop xs

insertBefore value 0 arr = value : arr
insertBefore value index (x:xs) = x : insertBefore value (index - 1) xs

-- -------------- --
-- Main Algorithm --
-- -------------- --

data FactorSet = FactorSet { numFactors :: Int, expExponent :: Int } deriving (Eq, Show)

lengthen FactorSet { numFactors = numFactors, expExponent = expExponent } = FactorSet { numFactors = numFactors + 1, expExponent = expExponent }

shorten FactorSet { numFactors = numFactors, expExponent = expExponent } = FactorSet { numFactors = numFactors - 1, expExponent = expExponent }

isEmpty factorSet = numFactors factorSet == 0

getMultiplier factorization index = prime ^ changeInExponent
    where
        prime = primes !! sum(map numFactors (take index factorization))
        changeInExponent = 2 ^ expExponent (factorization !! index)

endWith0 factorization = if expExponent(last factorization) == 0 then factorization else factorization ++ [FactorSet { numFactors = 1, expExponent = 0 }]

increment factorization index
    | index == 0 = FactorSet { numFactors = 1, expExponent = expExponent factorSet + 1 }
                 : FactorSet { numFactors = numFactors factorSet - 1, expExponent = expExponent factorSet }
                 : tail factorization
    | index == (length factorization - 1) = pop factorization
        ++ [FactorSet { numFactors = numFactors(last factorization) - 1, expExponent = expExponent(last factorization)}]
        ++ [FactorSet { numFactors = 1, expExponent = 0 }]
    | expExponent newFactorSet == expExponent previous = replaceWith (index - 1) lengthen shortened
    | otherwise = insertBefore newFactorSet index shortened
    where
        factorSet = factorization !! index
        previous = factorization !! (index - 1)
        shortened = replaceWith index shorten factorization
        newFactorSet = FactorSet { numFactors = 1, expExponent = expExponent factorSet + 1 }

simplify = filter (not . isEmpty)

nextFactorization factorization = simplify(increment factorization index)
    where index = minIndex (map (getMultiplier factorization) [0 .. length factorization - 1])

main = do
    print(nextPrime 13 == 17)
    print(take 5 primes == [2, 3, 5, 7, 11])
    print(replace [5, 4, 3, 2, 1] 2 100 == [5, 4, 100, 2, 1])
    print(getMultiplier example 0 == 2 ^ 4)
    print(getMultiplier example 1 == 11 ^ 2)
    print(getMultiplier example 2 == 19)
    print(simplify(increment example 0) == [ FactorSet { numFactors = 1, expExponent = 3 },
                                             FactorSet { numFactors = 3, expExponent = 2 },
                                             FactorSet { numFactors = 3, expExponent = 1 },
                                             FactorSet { numFactors = 1, expExponent = 0 }
                                           ])
    print(simplify(increment example 1) == [ FactorSet { numFactors = 5, expExponent = 2 },
                                             FactorSet { numFactors = 2, expExponent = 1 },
                                             FactorSet { numFactors = 1, expExponent = 0 }
                                           ])
    print(simplify(increment example 2) == [ FactorSet { numFactors = 4, expExponent = 2 },
                                             FactorSet { numFactors = 4, expExponent = 1 },
                                             FactorSet { numFactors = 1, expExponent = 0 }
                                           ])
    print(simplify(increment example 2))

    where example = [ FactorSet { numFactors = 4, expExponent = 2 },
                      FactorSet { numFactors = 3, expExponent = 1 },
                      FactorSet { numFactors = 1, expExponent = 0 }
                    ]
