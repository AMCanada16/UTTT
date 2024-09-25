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
    [gridStateMode.x,gridStateMode.x,gridStateMode.o],
    [gridStateMode.x,gridStateMode.x,0],
    [gridStateMode.o,0,gridStateMode.x]
  ], gridStateMode.x, 0, 0)).toEqual(gridStateMode.x)
  expect(checkIfGameOver([
    [gridStateMode.x,gridStateMode.x,gridStateMode.o],
    [gridStateMode.x,gridStateMode.o,gridStateMode.open],
    [gridStateMode.o,gridStateMode.open,gridStateMode.x]
  ], gridStateMode.o, 0, 0)).toEqual(gridStateMode.o)
  expect(checkIfGameOver([
    [gridStateMode.x,gridStateMode.x,gridStateMode.o],
    [gridStateMode.x,gridStateMode.o,gridStateMode.x],
    [gridStateMode.o,gridStateMode.x,gridStateMode.x]
  ], gridStateMode.o, 0, 0)).toEqual(gridStateMode.o)
  expect(checkIfGameOver([
    [gridStateMode.x,gridStateMode.o,gridStateMode.x],
    [gridStateMode.o,gridStateMode.o,gridStateMode.o],
    [gridStateMode.o,gridStateMode.x,gridStateMode.x]
  ], gridStateMode.o, 1, 1)).toEqual(gridStateMode.o)
})