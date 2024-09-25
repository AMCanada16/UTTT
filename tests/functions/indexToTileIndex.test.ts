import indexToTileIndex from "../../src/functions/indexToTileIndex"

/*
  0  1  2  | 3  4  5  | 6  7  8
  9  10 11 | 12 13 14 | 15 16 17
  18 19 20 | 21 22 23 | 24 25 26
  ------------------------------
  27 28 29 | 30 31 32 | 33 34 35
  36 37 38 | 39 40 41 | 42 43 44
  45 46 47 | 48 49 50 | 51 52 53
  ------------------------------
  54 55 56 | 57 58 59 | 60 61 62
  63 64 65 | 66 67 68 | 69 70 71
  72 73 74 | 75 76 77 | 78 79 80
  ->
  0 1 2 | 0 1 2 | 0 1 2
  3 4 5 | 3 4 5 | 3 4 5
  6 7 8 | 6 7 8 | 6 7 8
  ---------------------
  0 1 2 | 0 1 2 | 0 1 2
  3 4 5 | 3 4 5 | 3 4 5
  6 7 8 | 6 7 8 | 6 7 8
  ---------------------
  0 1 2 | 0 1 2 | 0 1 2
  3 4 5 | 3 4 5 | 3 4 5
  6 7 8 | 6 7 8 | 6 7 8
*/

test("That the index is converted to tile index correctly", () => {
  expect(indexToTileIndex(0)).toBe(0)
  expect(indexToTileIndex(1)).toBe(1)
  expect(indexToTileIndex(2)).toBe(2)
  expect(indexToTileIndex(3)).toBe(0)
  expect(indexToTileIndex(4)).toBe(1)
  expect(indexToTileIndex(5)).toBe(2)
  expect(indexToTileIndex(6)).toBe(0)
  expect(indexToTileIndex(7)).toBe(1)
  expect(indexToTileIndex(8)).toBe(2)
  expect(indexToTileIndex(9)).toBe(3)
  expect(indexToTileIndex(10)).toBe(4)
  expect(indexToTileIndex(11)).toBe(5)
  expect(indexToTileIndex(12)).toBe(3)
  expect(indexToTileIndex(13)).toBe(4)
  expect(indexToTileIndex(14)).toBe(5)
  expect(indexToTileIndex(15)).toBe(3)
  expect(indexToTileIndex(16)).toBe(4)
  expect(indexToTileIndex(17)).toBe(5)
  expect(indexToTileIndex(18)).toBe(6)
  expect(indexToTileIndex(19)).toBe(7)
  expect(indexToTileIndex(20)).toBe(8)
  expect(indexToTileIndex(21)).toBe(6)
  expect(indexToTileIndex(22)).toBe(7)
  expect(indexToTileIndex(23)).toBe(8)
  expect(indexToTileIndex(24)).toBe(6)
  expect(indexToTileIndex(25)).toBe(7)
  expect(indexToTileIndex(26)).toBe(8)
})