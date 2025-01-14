//
//  GameStatsView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-12.
//

import SwiftUI
import FirebaseAuth

struct GameStatsView: View {
  @Binding var mode: ViewType
  @EnvironmentObject var useGame: UseGame
  
  func goHome() {
    mode = ViewType.game
  }
  
  var body: some View {
    switch useGame.currentGame {
    case .game(let game):
      VStack {
        GeometryReader { geometry in
          VStack {
              Button(action: goHome) {
                  Text("Back")
              }
            Text("Game Id: \(game.gameId)")
              .foregroundStyle(.white)
            Text("Owner: \(game.owner)")
              .foregroundStyle(.white)
            Text("Current Turn: \(game.currentTurn)")
              .foregroundStyle(.white)
            Text("Signed in: \(Auth.auth().currentUser?.uid ?? "No User Signed In")")
              .foregroundStyle(.white)
            Text("\(game.userWon ?? "No User Has Won.")")
              .foregroundStyle(.white)
            Text("\(game.users.count)")
              .foregroundStyle(.white)
            if (game.users.count >= 2) {
              VStack {
                Text("\(game.users[0].userId)")
                  .foregroundStyle(.white)
                Text("\(game.users[0].player)")
                  .foregroundStyle(.white)
              }.padding()
              VStack {
                Text("\(game.users[1].userId)")
                  .foregroundStyle(.white)
                Text("\(game.users[1].player)")
                  .foregroundStyle(.white)
              }.padding()
            } else {
              Text("The game does not have two players.")
            }
            
          }.frame(width: geometry.size.width, height: geometry.size.height)
        }
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    default:
      VStack {}.onAppear() {
        mode = ViewType.game
      }
    }
  }
}
