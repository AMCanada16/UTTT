//
//  TickTackToe.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-09.
//

import SwiftUI
import Foundation

struct TicTacToeTile: View {
	let tileIndex: Int
	let gridIndex: Int
	var length: CGFloat
  @EnvironmentObject var useGame: UseGame
	
	/*
		| 0 1 2    | 3 4 5    | 6 7 8    |
		| 9 10 11  | 12 13 14 | 15 16 17 |
		| 18 19 20 | 21 22 23 | 24 25 26 |
		----------------------------------
		| 27 28 29 | 30 31 32 | 33 34 35 |
		| 36 37 38 | 39 40 41 | 42 43 44 |
		| 45 46 47 | 48 49 50 | 51 52 53 |
		----------------------------------
		| 54 55 56 | 57 58 59 | 60 61 62 |
		| 63 64 65 | 66 67 68 | 69 70 71 |
		| 72 73 74 | 75 76 77 | 78 79 80 |
	 
		If getting 67 the (0 -53 = 54) is the upper y count is (54 - 62 = 9).
		The xOffset is (63 - 65 = 3) and the xCount is (66 = 1). Thefore an index of 67 is produced.
	 */
	
	func getIndex(tileIndex: Int) -> Int {
		let upperCount: Int = Int(floor(Double((gridIndex/3))) * 27)
		let yCount: Int = Int(floor(Double(tileIndex)/3)) * 9
		let xCount: Int = Int(tileIndex % 3)
		let xOffset: Int = Int((gridIndex % 3) * 3)
		return upperCount + yCount + xOffset + xCount
	}
	
	func buttonPress(tileIndex: Int) {
    let game = Game().getGame(state: useGame.currentGame)!
		let index = getIndex(tileIndex: tileIndex)
    if game.data.inner[index] != gridStateMode.open || (game.selectedGrid != 0 && game.selectedGrid != (gridIndex + 1)) {
			return
		}
		do {
      useGame.previousGameState = Game().getGame(state: useGame.currentGame)
      useGame.currentGame = try gameState.game(TileButtonPress(index: index, tileIndex: tileIndex, gridIndex: gridIndex, game: game))
		} catch {
			// TODO something went wrong
		}
	}
	
	var body: some View {
		let index = getIndex(tileIndex: tileIndex)
		Button {
			buttonPress(tileIndex: tileIndex)
		} label: {
			VStack {
        if Game().getGame(state: useGame.currentGame)!.data.inner[index] == gridStateMode.o {
					Text("O")
            .foregroundColor(Color(UIColor(hex: "#ff9c9cff")!))
				} else if Game().getGame(state: useGame.currentGame)!.data.inner[index] == gridStateMode.x {
					Text("X")
            .foregroundColor(Color(UIColor(hex: "#a0f4f7ff")!))
				}
			}.frame(width: length, height: length).background(Color.primary)
		}
	}
}

struct TicTacToeCore: View {
	let gridIndex: Int
  @EnvironmentObject var useGame: UseGame
	
	func calculateHeight(height: CGFloat, active: ActiveType) -> CGFloat {
		if (active.yOne == active.yTwo) {
			if (active.yOne == 0) {
				return -(height/3)
			}
			if (active.yOne == 2) {
				return (height/3)
			}
		}
		return 0
	}
	
	func calculateRotation(active: ActiveType) -> Double {
		if (active.xOne == active.xTwo) {
			// Vertical
			return 0
		} else if (active.yOne == active.yTwo) {
			// Horizontal
			return 90
		} else if (active.xOne == 0 && active.xTwo == 2) {
			// Angle left right
			return 45
		} else {
			// Angle right left
			return -45
		}
	}
	
	func calculateWidth(width: CGFloat, active: ActiveType) -> Double {
		if (active.xOne == 0 && active.xTwo == 0) {
			return -(width/3)
		}
		if (active.xOne == 2 && active.xTwo == 2) {
			return (width/3)
		}
		return 0
	}
	
	func calculateLength(width: CGFloat, active: ActiveType) -> Double {
		if (active.xOne == 0 && active.xTwo == 2) || (active.xOne == 2 && active.xTwo == 0) {
			return sqrt(2 * width * width) - 35
		}
		return width - 15.0
	}
	
	var body: some View {
		GeometryReader{ geometry in
			let length = (geometry.size.width - 2)/3
			ZStack {
				VStack (spacing: 1) {
					HStack (spacing: 1){
						TicTacToeTile(tileIndex: 0, gridIndex: gridIndex, length: length)
						TicTacToeTile(tileIndex: 1, gridIndex: gridIndex, length: length)
						TicTacToeTile(tileIndex: 2, gridIndex: gridIndex, length: length)
					}.padding(0)
					HStack (spacing: 1) {
						TicTacToeTile(tileIndex: 3, gridIndex: gridIndex, length: length)
						TicTacToeTile(tileIndex: 4, gridIndex: gridIndex, length: length)
						TicTacToeTile(tileIndex: 5, gridIndex: gridIndex, length: length)
					}
					HStack (spacing: 1) {
						TicTacToeTile(tileIndex: 6, gridIndex: gridIndex, length: length)
						TicTacToeTile(tileIndex: 7, gridIndex: gridIndex, length: length)
						TicTacToeTile(tileIndex: 8, gridIndex: gridIndex, length: length)
					}
				}.background(Color.black)
        let active = Game().getGame(state: useGame.currentGame)!.data.active.first(where: {$0.gridIndex == gridIndex})
				if active != nil {
					RoundedRectangle(cornerRadius: 25)
						.fill(.yellow)
						.frame(width: 5, height: calculateLength(width: geometry.size.width, active: active!))
						.rotationEffect(.degrees(calculateRotation(active: active!)))
						.offset(CGSize(width: calculateWidth(width: geometry.size.width, active: active!), height: calculateHeight(height: geometry.size.height, active: active!)))
				}
			}
		}
	}
}


struct TickTackToe: View {
  @EnvironmentObject var currentGame: UseGame
	let gridIndex: Int
	
  var body: some View {
		switch currentGame.currentGame {
		case .loading:
      if (gridIndex == 4) {
        Text("Loading")
      }
		case .game(let game):
      if (game.users.count >= 2) {
        TicTacToeCore(gridIndex: gridIndex)
      } else if (gridIndex == 4) {
        Text("Waiting for another player to join.")
      }
		default:
      if (gridIndex == 4) {
        Text("Something went wrong")
      }
		}
    
  }
}
