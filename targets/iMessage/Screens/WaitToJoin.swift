
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
  @EnvironmentObject var currentMode: CurrentMode
  let addMessage: AddMessageType
  @State var isCopied: Bool = false
  
  func copyGameId() {
    UIPasteboard.general.string = Game().getGame(state: useGame.currentGame)?.gameId ?? "No Game"
    isCopied = true
  }
  
  func sendMessage() {
    addMessage("Do you want to join the game?")
  }
  
  func goBack() {
    currentMode.mode = ViewType.home
  }
  
  func getUserCount(currentGame: gameState) -> Int {
    guard let game: GameType = Game().getGame(state: currentGame) else {
      return 0
    }
    return game.users.count
  }
  
  var body: some View {
    ZStack {
      GeometryReader { geometry in
        VStack {
          UTTTHeader()
          Text("Wait for other players to join. Invite more people!")
            .font(.headline)
            .foregroundStyle(.white)
          HStack(spacing: 0) {
            VStack{}.frame(width: geometry.size.width * 0.1 + 25)
            Spacer()
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
            Spacer()
            Button(action: sendMessage) {
              Image(systemName: "message.circle.fill")
                .resizable()
                .frame(width: geometry.size.width * 0.1, height: geometry.size.width * 0.1)
                .foregroundStyle(.white)
            }
            .padding(.trailing, 25)
          }
        }
        .frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        .onChange(of: getUserCount(currentGame: useGame.currentGame), initial: true) { oldCount, newCount in
          if (newCount >= 2) {
            currentMode.mode = ViewType.game
          }
        }
      }
    }
    VStack {
      HStack {
        Button(action: goBack) {
          Image(systemName: "arrowshape.backward.circle")
            .resizable()
            .frame(width: 40, height: 40)
            .foregroundStyle(.white)
        }
        .padding(.leading, 15)
        .padding(.top, 15)
        Spacer()
      }
      Spacer()
    }
  }
}
