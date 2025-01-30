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
  @State var isCopied: Bool = false
  
  func copyGameId() {
    UIPasteboard.general.string = Game().getGame(state: useGame.currentGame)?.gameId ?? "No Game"
    isCopied = true
  }
  
  func getOpponentUsername(game: GameType) {
    Task {
      guard let uid = Auth.auth().currentUser?.uid else {
        return
      }
      guard let opp = game.users.first(where: {$0.userId != uid}) else {
        return
      }
      guard let result = await Users().getUsername(uid: opp.userId) else {
        return
      }
      opponentUsername = result;
    }
  }
  
  func goHome() {
    currentMode.mode = ViewType.game
  }
  
  var body: some View {
    switch useGame.currentGame {
    case .game(let game):
      ZStack {
        GeometryReader { geometry in
          VStack {
            UTTTHeader()
            VStack {
              HStack{
                Text("Game ID:")
                Button(action: copyGameId) {
                  Image(systemName: isCopied ? "document.on.document.fill":"document.on.document")
                    .resizable()
                    .aspectRatio(contentMode: .fit)
                    .frame(width: 25, height: 25)
                    .foregroundStyle(.black)
                  
                }
                Text(Game().getGame(state: useGame.currentGame)?.gameId ?? "No Game")
                  .font(.headline)
              }
            }
            .padding()
            .frame(width: geometry.size.width * 0.6)
            .background(.white)
            .clipShape(RoundedRectangle(cornerRadius: 8))
            .overlay( /// apply a rounded border
              RoundedRectangle(cornerRadius: 8)
                .stroke(.black, lineWidth: 1)
            )
            if (Users().getPlayer(game: game) == gridStateMode.x) {
              Text("Player X: You")
                .foregroundStyle(.white)
              Text("Player O: \(opponentUsername)")
                .foregroundStyle(.white)
            } else {
              Text("Player X: \(opponentUsername)")
                .foregroundStyle(.white)
              Text("Player O: You")
                .foregroundStyle(.white)
            }
          }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        }
        BackButton(goBack: {
          currentMode.mode = ViewType.game
        })
      }.onAppear() {
        getOpponentUsername(game: game)
      }
    default:
      VStack {}.onAppear() {
        currentMode.mode = ViewType.game
      }
    }
  }
}
