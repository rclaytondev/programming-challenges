import qualified Data.Map as Map
a `divides` b = b `mod` a == 0

minListEntry [x] f = x
minListEntry (x:xs) f = if f(snd x) <= f (snd previousMinEntry) then x else previousMinEntry
    where previousMinEntry = minListEntry xs f

minEntry mapObj = minListEntry (Map.toList mapObj)

setInPermutation (indexPossibilities, valuePossibilities) index value = (newIndexPossibilities, newValuePossibilities)
    where
        newIndexPossibilities = Map.delete index (Map.map (filter (/= value)) indexPossibilities)
        newValuePossibilities = Map.delete value (Map.map (filter (/= index)) valuePossibilities)

nextStates state@(indexPossibilities, valuePossibilities)
    | length nextIndexPossibilities < length nextValuePossibilities = map (setInPermutation state nextIndex) nextIndexPossibilities
    | otherwise = map (\index -> setInPermutation state index nextValue) nextValuePossibilities
    where
        (nextIndex, nextIndexPossibilities) = minEntry indexPossibilities length
        (nextValue, nextValuePossibilities) = minEntry valuePossibilities length

initialIndexPossibilities size first = Map.fromList (map (\i -> (i, filter (i `divides`) range)) [1 .. size])
    where range = [first .. first + size - 1]

initialValuePossibilities size first = Map.fromList (map (\v -> (v, filter (`divides` v) [1 .. size])) [first .. first + size - 1])

isDivisible size first = not(null (iterate (concatMap nextStates) [initialState] !! (size - 1)))
    where initialState = (initialIndexPossibilities size first, initialValuePossibilities size first)

divisibleRanges size = filter (isDivisible size) [1 ..]

main = do
    print(isDivisible 4 1)
    print(isDivisible 4 2)
    print(isDivisible 4 3)
    print(not (isDivisible 4 4))
    print(take 4 (divisibleRanges 4) == [1, 2, 3, 6])
    print(nextStates (exampleIndexPossibilities, example1ValuePossibilities) == [(expectedIndexPossibilties1, expectedValuePossibilties1)])


    print(take 15 (divisibleRanges 15))


    where
        exampleIndexPossibilities = Map.fromList [(1, [4, 5, 6, 7]), (2, [4, 6]), (3, [6]), (4, [4])]
        example1ValuePossibilities = Map.fromList [(4, [1, 2, 4]), (5, [1]), (6, [1, 2, 3]), (7, [1])]
        expectedIndexPossibilties1 = Map.fromList [(2, [4, 6]), (3, [6]), (4, [4])]
        expectedValuePossibilties1 = Map.fromList [(4, [2, 4]), (6, [2, 3]), (7, [])]

