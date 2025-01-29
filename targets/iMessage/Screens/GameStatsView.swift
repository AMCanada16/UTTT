//
//  GameStatsView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-12.
//

import SwiftUI
import FirebaseAuth

struct GameStatsView: View {
  @EnvironmentObject var currentMode: CurrentMode
  @EnvironmentObject var useGame: UseGame
  @State var opponentUsername: String = ""
  
  func getOpponentUsername() {
    
  }
  
  func goHome() {
    currentMode.mode = ViewType.game
  }
  
  var body: some View {
    switch useGame.currentGame {
    case .game(let game):
      ZStack {
        VStack {
          UTTTHeader()
          Text("Game ID: \(game.gameId)")
          if (Users().getPlayer(game: game) == gridStateMode.x) {
            Text("Player X: You")
          } else {
            Text("Player Y: You")
          }
          Text("Player Two")
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        BackButton(goBack: {
          currentMode.mode = ViewType.game
        })
      }
    default:
      VStack {}.onAppear() {
        currentMode.mode = ViewType.game
      }
    }
  }
}
