//
//  CreateGameView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-10.
//

import SwiftUI

struct CreateGameView: View {
  @Binding var mode: ViewType
  @EnvironmentObject var currentGame: UseGame
  @State var input: String = ""
  
  func createGame() {
    mode = ViewType.game
  }
  
  func joinGame() {
    currentGame.currentGame = gameState.loading
    currentGame.updateGameId(gameId: input)
    mode = ViewType.game
  }
  
  var body: some View {
    VStack {
      HStack{
        Image("Logo")
          .resizable()
          .aspectRatio(contentMode: .fit)
          .frame(width: 100, height: 100)
        VStack (spacing: 5){
          ZStack {
            Text("Ultimate")
              .font(.custom("Ultimate", size: 55))
              .offset(x: -2, y: -1)
              .foregroundColor(Color(UIColor(hex: "#00fffcff")!))
            Text("Ultimate")
              .font(.custom("Ultimate", size: 55))
              .offset(x: -2, y: 2)
              .foregroundColor(Color(UIColor(hex: "#fc00ffff")!))//Pink
            Text("Ultimate")
              .font(.custom("Ultimate", size: 55))
              .offset(x: 1, y: 2)
              .foregroundColor(Color(UIColor(hex: "#fffc00ff")!)) //Yellow
            Text("Ultimate")
              .font(.custom("Ultimate", size: 55))
          }
          HStack (spacing: 0) {
            Text("Tic")
              .font(.custom("RussoOne", size: 40))
              .shadow(color: Color(UIColor(hex: "#FF5757ff")!), radius: 25)
              .foregroundColor(Color(UIColor(hex: "#ff9c9cff")!))
            Text("Tac")
              .font(Font.custom("RussoOne", size: 40))
              .shadow(color: Color(UIColor(hex: "#5CE1E6ff")!), radius: 25)
              .foregroundColor(Color(UIColor(hex: "#a0f4f7ff")!))
            Text("Toe")
              .font(Font.custom("RussoOne", size: 40))
              .shadow(color: Color(UIColor(hex: "#FF5757ff")!), radius: 25)
              .foregroundColor(Color(UIColor(hex: "#ff9c9cff")!))
          }
        }
      }
      TextEditor(text: $input)
        .lineLimit(1)
        .padding(.horizontal)
      HStack {
        Button(action: joinGame) {
          HStack {
            Image(systemName: "gamecontroller")
              .resizable()
            Text("Join Game")
          }
        }
        Button(action: createGame) {
          HStack {
            Text("Create Game")
          }.padding().background(Color.white).border(Color.black)
        }
      }
      
    }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
  }
}

