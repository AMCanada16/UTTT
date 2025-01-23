//
//  TileButtonPress.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-13.
//

import Foundation
import FirebaseAuth

/**
 * A function that checks to see if the game of tic tac toe has been won or lost
 * @remarks This does not check if the game is draw.
 * @param gridState The current state of the game
 * @param playerMode The current gridStateMode of the player (This would be x or o)
 * @param firstIndex The row of where the change has been made in the tic tac toe game
 * @param secondIndex The column of where the change has been made in the tic tac toe game
 * @returns a gridStateMode of the tic tac toe game at the provided row and column
 */

enum tileButtonPressError: Error {
	case errorGettingUID
	case gameAlreadyOver
}

func setGameOver(gridState: gridStateMode, original: GameType) throws -> GameType {
	var newOriginal = original
	newOriginal.gameOver = gridState
	guard let userID = Auth.auth().currentUser?.uid else { throw tileButtonPressError.errorGettingUID }
	newOriginal.userWon = userID
	return newOriginal
}

func setCurrentTurn(gridState: gridStateMode, original: GameType) -> GameType {
	var newOriginal = original
	newOriginal.currentTurn = gridState
	return newOriginal
}

func checkIfGameOver(gridState: [[gridStateMode]], playerMode: gridStateMode, firstIndex: Int, secondIndex: Int) -> gridStateMode {
  var change: Bool = false
  for index in 0...2 {//Check Horizontal
    if (gridState[firstIndex][index].rawValue == playerMode.rawValue){
      if (index == 2){
        //It's A Match
        change = true
      }
    } else {
      break
    }
  }
  for index in 0...2{//Check Vertical
    if (gridState[index][secondIndex] == playerMode) {
      if (index == 2){
        change = true
      }
    } else {
      break
    }
  }
  for index in 0...2 {//Check Diagnal Left Right
    if (gridState[index][index] == playerMode) {
      if (index == 2){
        change = true
      }
    } else {
      break
    }
  }
  for index in 0...2 {//Check Diagnal Right Left
    if (gridState[2-index][index] == playerMode) {
      if (index == 2){
        change = true
      }
    } else {
      break
    }
  }
  
  if (change) {
    return playerMode
  }
  return gridStateMode.open
}

func setGameTile(original: GameType, index: Int) ->GameType {
	var newOriginal = original
	newOriginal.data.inner[index] = original.currentTurn
  return newOriginal
}

//TODO what is this used for does not work
func setActive(original: GameType, firstIndex: Int, secondIndex: Int, active: ActiveType?) -> GameType {
  var newOriginal = original
  newOriginal.data.active.append(ActiveType(xOne: 0, xTwo: 0, yOne: 0, yTwo: 0, gridIndex: 0))
  return newOriginal
}

func setSelectedGrid(original: GameType, tileIndex: Int) -> GameType {
	var newOriginal = original
	if (newOriginal.data.value[tileIndex] != gridStateMode.open) {
		newOriginal.selectedGrid = 0
	} else {
		newOriginal.selectedGrid = tileIndex + 1
	}
	return newOriginal
}

/*
 Only call this function from the buttonPress func. This is because the user can make invalid moves if pressing this function.
 If not doing this, somethings to note:
 1. the user needs to be able to make a move (the square is not full)
 2. the user needs to be able to move (it is the users turn)
 */
func TileButtonPress(
  index: Int,
	tileIndex: Int,
	gridIndex: Int,
  game: GameType
) throws -> GameType {
	do {
		var newGame = game
		// check if the game is current
		if (game.gameOver != gridStateMode.open) {
			throw tileButtonPressError.gameAlreadyOver
		}
    
		// define the default variables used
		let currentTurn = game.currentTurn

		//update the data
		if (currentTurn == gridStateMode.x || currentTurn == gridStateMode.o){
			newGame = setGameTile(original: newGame, index: index)
			
			// A boolean if a square has become x or o (if so we need to check for win)
			var change: Bool = false
			
			//Check Horizontal
			for x in 0...2 {
				let baseIndex = index - (index % 3)
				let check = newGame.data.inner[baseIndex]
				if (newGame.data.inner[baseIndex + x] != check) {
					break
				}
				if (x == 2) {
					change = true
					let secondIndex: Int = Int(floor(Double(index)/27.0))
					let y: Int = Int(floor(Double(index)/9.0)) - (secondIndex * 3)

					newGame.data.value[gridIndex] = currentTurn
					newGame.data.active.append(
						ActiveType(
							xOne: 0,
							xTwo: 2,
							yOne: y,
							yTwo: y,
              gridIndex: gridIndex
						))
					// TODO handle active
				}
			}
			
			//Check Vertical
			for y in 0...2{
				//		The index - Anything above it in it's row
				let baseIndex = index - (Int(floor(Double(index % 27)/9.0)) * 9)
				let check = newGame.data.inner[baseIndex]
				// TODO fit bottom
				if (newGame.data.inner[baseIndex + (y * 9)] != check) {
					break
				}
				if (y == 2) {
					// TODO handle active
					change = true
					let secondIndex: Int = Int(floor(Double(index)/27.0))
					let xPos: Int = (index % 3)

					newGame.data.value[gridIndex] = currentTurn
					newGame.data.active.append(
						ActiveType(
							xOne: xPos,
							xTwo: xPos,
							yOne: 0,
							yTwo: 2,
              gridIndex: gridIndex
						))
				}
			}
			
			//Check Diagnal Right Left
			let lrBaseIndex = getLRBaseIndex(index: index)
			if (newGame.data.inner[lrBaseIndex] == newGame.data.inner[lrBaseIndex + 10] && newGame.data.inner[lrBaseIndex + 10] == newGame.data.inner[lrBaseIndex + 20] && newGame.data.inner[lrBaseIndex] != gridStateMode.open) {
				change = true
				newGame.data.value[gridIndex] = currentTurn
				newGame.data.active.append(
					ActiveType(
						xOne: 0,
						xTwo: 2,
						yOne: 0,
						yTwo: 2,
            gridIndex: gridIndex
					))
			}
			
			//Check Diagnal Left Right
			let rlBaseIndex = getLRBaseIndex(index: index) + 2
			if (newGame.data.inner[rlBaseIndex] == newGame.data.inner[rlBaseIndex + 8] && newGame.data.inner[rlBaseIndex + 8] == newGame.data.inner[rlBaseIndex + 16] && newGame.data.inner[rlBaseIndex] != gridStateMode.open) {
				change = true
				newGame.data.value[gridIndex] = currentTurn
				print("Set value right left")
				newGame.data.active.append(
					ActiveType(
						xOne: 2,
						xTwo: 0,
						yOne: 2,
						yTwo: 0,
            gridIndex: gridIndex
					))
			}
			if (!change){
				//Checks if the sqaure is full meaning the tic tac toe has ended in a draw
				var full = true
				// This is the index in the top left of the square
				let lrIndex = getLRBaseIndex(index: index)
				for x in 0..<2 {
					for y in 0..<2 {
						if (newGame.data.inner[(lrIndex + x) + (y * 9)] == gridStateMode.open) {
							full = false
							break
						}
					}
					if !full {
						break
					}
				}
				if (full) {
					newGame.data.value[tileIndex - 1] = gridStateMode.full
					change = true
				}
			}
			if (change) {
				print("Running game over check")
				var isGameOver = false
				/*
					GridIndex
					| 0 1 2 | rowIndex 0
					| 3 4 5 | rowIndex 1
					| 6 7 8 | rowIndex 2
					--------
						0 1 2
				 Columns
				 
				*/
				let rowIndex = Int(floor(Double(gridIndex)/3.0))
				print("This is row \(rowIndex)")
				let columnIndex = gridIndex % 3
				
				// Check full game horizontal
        for x in 1...2 {
          print(newGame.data.value[(rowIndex * 3) + x])
          print(newGame.data.value[(rowIndex * 3)])
					if (newGame.data.value[(rowIndex * 3) + x] != newGame.data.value[(rowIndex * 3)]) {
						break
					}
					if x == 2 {
						print("Setting game over hor")
						isGameOver = true
					}
				}
				
				// Check full game vert
        for y in 1...2 {
          print(columnIndex)
          if newGame.data.value[(y * 3) + columnIndex] != newGame.data.value[columnIndex] {
						break
					}
					if y == 2 {
						print("Setting game over vert")
						isGameOver = true
					}
				}
				
				// Check full game left right
				if newGame.data.value[0] == newGame.data.value[4] && newGame.data.value[4] == newGame.data.value[8] && newGame.data.value[8] != gridStateMode.open {
					print("Setting game over lr")
					isGameOver = true
				}
				
				// Check full game right left
				if newGame.data.value[2] == newGame.data.value[4] && newGame.data.value[4] == newGame.data.value[6] && newGame.data.value[6] != gridStateMode.open {
					print("Setting game over rl")
					isGameOver = true
				}
				
				// is full game full?
				var full = true
        for x in 0...2 {
          for y in 0...2 {
						if newGame.data.value[x + (y * 3)] == gridStateMode.open {
							full = false
							break
						}
					}
					if !full {
						break
					}
				}
				
				if (full) {
					newGame.gameOver = gridStateMode.full
				}
				
				if (isGameOver) {
					newGame = try setGameOver(gridState: currentTurn, original: newGame)
				}
			}
		}
		
		newGame = setSelectedGrid(original: newGame, tileIndex: tileIndex)

		// Set the new plater mode
		if (currentTurn == gridStateMode.o){
			newGame = setCurrentTurn(gridState: gridStateMode.x, original: newGame)
		} else if (currentTurn == gridStateMode.x) {
			newGame = setCurrentTurn(gridState: gridStateMode.o, original: newGame)
		}
		return newGame
	} catch {
		throw tileButtonPressError.errorGettingUID
	}
}

func getLRBaseIndex(index: Int) -> Int {
	return index - (index % 27) + (Int(floor(Double(index % 9)/3.0)) * 3)
}
