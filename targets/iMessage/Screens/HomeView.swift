//
//  Home.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-10.
//

import SwiftUI
import FirebaseAuth

struct HomeView: View {
  @Binding var mode: ViewType
  @EnvironmentObject var currentGame: UseGame
  @State var input: String = ""
  @State var cJoinGameState: joinGameState = joinGameState.notStarted
  @State var createGameState: loadingState = loadingState.notStarted
  
  func goToInformation() {
    
  }
  
  func goToAccount() {
    mode = ViewType.account
  }
  
  func goToApp() {
    
  }
  
  func createGame() {
    mode = ViewType.game
  }
  
  func joinGame() {
    Task {
      cJoinGameState = joinGameState.loading
      currentGame.currentGame = gameState.loading
      currentGame.updateGameId(gameId: input)
      guard let uid = Auth.auth().currentUser?.uid else {
        mode = ViewType.login
        return
      }
      let result = await Game().joinGame(gameId: input, uid: uid)
      cJoinGameState = result
      if (result == joinGameState.success) {
        mode = ViewType.game
      }
    }
  }
  
  var body: some View {
    if (cJoinGameState == joinGameState.failed) {
      VStack {
        Text("Something Went Wrong")
          .foregroundStyle(.white)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    } else if (cJoinGameState == joinGameState.loading) {
      VStack {
        Text("Joining Game")
          .foregroundStyle(.white)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    } else if (cJoinGameState == joinGameState.success) {
      VStack {
        Text("Successfully joined the game.")
          .foregroundStyle(.white)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    } else if (cJoinGameState == joinGameState.gameFull) {
      VStack {
        Text("The Game id Full!")
          .foregroundStyle(.white)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    } else if (createGameState == loadingState.loading) {
      VStack {
        Text("Creating the game!")
          .foregroundStyle(.white)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    } else {
      GeometryReader { geometry in
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
          HStack(spacing: 0) {
            VStack {
              TextField("Game ID", text: $input)
                .lineLimit(1)
                .padding(.horizontal)
                .frame(height: 50)
                .disableAutocorrection(true)
                .background(.white)
                .clipShape(.rect(cornerRadius: 8))
                .overlay( /// apply a rounded border
                    RoundedRectangle(cornerRadius: 8)
                        .stroke(.black, lineWidth: 1)
                )
              HStack(spacing: 0) {
                if (input.count != 0) {
                  Button(action: joinGame) {
                    HStack {
                      Image(systemName: "gamecontroller")
                        .resizable()
                        .foregroundStyle(.black)
                        .aspectRatio(contentMode: .fit)
                        .frame(maxHeight: 25)
                      Text("Join Game")
                        .foregroundStyle(.black)
                        .lineLimit(1)
                        .minimumScaleFactor(0.5)
                    }
                    .padding()
                    .background(Color.white)
                    .frame(width: ((geometry.size.width - 90) * 0.5) - 2.5)
                    .clipShape(.rect(cornerRadius: 8))
                    .overlay( /// apply a rounded border
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(.black, lineWidth: 1)
                    )
                  }
                  Spacer()
                }
                Button(action: createGame) {
                  HStack {
                    Image(systemName: "plus")
                      .resizable()
                      .foregroundStyle(.black)
                      .aspectRatio(contentMode: .fit)
                      .frame(maxHeight: 25)
                    Text("Create Game")
                      .foregroundStyle(.black)
                      .lineLimit(1)
                      .minimumScaleFactor(0.5)
                  }
                  .padding()
                  .frame(width: ((geometry.size.width - 90) * (input.count != 0 ? 0.45:1)) - (input.count != 0 ? 2.5:0))
                  .background(Color.white)
                  .clipShape(.rect(cornerRadius: 8))
                  .overlay( /// apply a rounded border
                      RoundedRectangle(cornerRadius: 8)
                          .stroke(.black, lineWidth: 1)
                  )
                }
              }
            }
            VStack {
              Button(action: goToInformation) {
                Image(systemName: "info.circle")
                  .resizable()
                  .frame(width: 25, height: 25)
                  .foregroundStyle(.white)
              }
              Button(action: goToInformation) {
                Image(systemName: "person.crop.circle")
                  .resizable()
                  .frame(width: 25, height: 25)
                  .foregroundStyle(.white)
              }
              Button(action: goToApp) {
                Image(systemName: "arrow.up.forward.app")
                  .resizable()
                  .frame(width: 25, height: 25)
                  .foregroundStyle(.white)
              }
            }
            .frame(width: 25)
            .padding(.horizontal, 20)
          }.padding(.leading, 25)
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
      }
    }
  }
}

