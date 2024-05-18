import { twoDtoOneDValue } from "../../src/functions/TileButtonPress";

test('Converts a value two dimentional array to one dimension correctly', () => {
  expect(twoDtoOneDValue([
    [1,0,0],
    [1,1,0],
    [2,0,2]
  ])).toEqual([1,1,2,0,1,0,0,0,2])
});