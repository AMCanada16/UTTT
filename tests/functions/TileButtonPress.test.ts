import { gridStateMode } from "../../src/Types";
//import { twoDtoOneDValue } from "../../src/functions/Ai/common";
import { checkIfGameOver } from "../../src/functions/TileButtonPressFunctions";

// test('Converts a value two dimentional array to one dimension correctly', () => {
//   expect(twoDtoOneDValue([
//     [1,0,0],
//     [1,1,0],
//     [2,0,2]
//   ])).toEqual([1,1,2,0,1,0,0,0,2])
// });

test('Checks if the game is over', () => {
  expect(checkIfGameOver([
    [gridStateMode.X,gridStateMode.X,gridStateMode.O],
    [gridStateMode.X,gridStateMode.X,0],
    [gridStateMode.O,0,gridStateMode.X]
  ], gridStateMode.X, 0, 0)).toEqual(gridStateMode.X)
  expect(checkIfGameOver([
    [gridStateMode.X,gridStateMode.X,gridStateMode.O],
    [gridStateMode.X,gridStateMode.O,gridStateMode.Open],
    [gridStateMode.O,gridStateMode.Open,gridStateMode.X]
  ], gridStateMode.O, 0, 0)).toEqual(gridStateMode.O)
  expect(checkIfGameOver([
    [gridStateMode.X,gridStateMode.X,gridStateMode.O],
    [gridStateMode.X,gridStateMode.O,gridStateMode.X],
    [gridStateMode.O,gridStateMode.X,gridStateMode.X]
  ], gridStateMode.O, 0, 0)).toEqual(gridStateMode.O)
  expect(checkIfGameOver([
    [gridStateMode.X,gridStateMode.O,gridStateMode.X],
    [gridStateMode.O,gridStateMode.O,gridStateMode.O],
    [gridStateMode.O,gridStateMode.X,gridStateMode.X]
  ], gridStateMode.O, 1, 1)).toEqual(gridStateMode.O)
})