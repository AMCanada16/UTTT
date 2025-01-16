
//
//  ViewController.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-09.
//

import SwiftUI
import Firebase
import FirebaseAuth

struct WaitToJoin: View {
  @EnvironmentObject var useGame: UseGame
  @Binding var mode: ViewType
  let addMessage: () -> Void
  
  func copyGameId() {
    UIPasteboard.general.string = Game().getGame(state: useGame.currentGame)?.gameId ?? "No Game"
  }
  
  func sendMessage() {
    addMessage()
  }
  
  func goBack() {
    mode = ViewType.home
  }
  
  func getUserCount(currentGame: gameState) -> Int {
    guard let game: GameType = Game().getGame(state: currentGame) else {
      return 0
    }
    return game.users.count
  }
  
  var body: some View {
    VStack {
      UTTTHeader()
      HStack {
        Button(action: goBack) {
          Image(systemName: "arrowshape.backward.circle.fill")
            .resizable()
            .frame(width: 25, height: 25)
        }
        Button(action: copyGameId) {
          Text("Copy")
        }
      }
      Text(Game().getGame(state: useGame.currentGame)?.gameId ?? "No Game")
      Button(action: sendMessage) {
        Image(systemName: "message.circle.fill")
          .resizable()
          .frame(width: 25, height: 25)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    .onChange(of: getUserCount(currentGame: useGame.currentGame), initial: true) { oldCount, newCount in
      print("onChange Called \(newCount)")
      if (newCount >= 2) {
        mode = ViewType.game
      }
    }
  }
}
