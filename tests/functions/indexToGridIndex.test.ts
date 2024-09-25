import indexToGridIndex from "../../src/functions/indexToGridIndex"


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
  0 | 1 | 2
  ---------
  3 | 4 | 5
  ---------
  6 | 7 | 8
*/

test("That the index is converted to grid index correctly", () => {
  expect(indexToGridIndex(0)).toBe(0)
  expect(indexToGridIndex(3)).toBe(1)
  expect(indexToGridIndex(6)).toBe(2)
  expect(indexToGridIndex(27)).toBe(3)
  expect(indexToGridIndex(30)).toBe(4)
  expect(indexToGridIndex(33)).toBe(5)
  expect(indexToGridIndex(54)).toBe(6)
  expect(indexToGridIndex(57)).toBe(7)
  expect(indexToGridIndex(77)).toBe(7)
  expect(indexToGridIndex(60)).toBe(8)
  expect(indexToGridIndex(78)).toBe(8)
})