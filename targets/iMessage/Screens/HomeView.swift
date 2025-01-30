//
//  Home.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-10.
//

import SwiftUI
import FirebaseAuth

struct HomeView: View {
  @EnvironmentObject var currentMode: CurrentMode
  @EnvironmentObject var currentGame: UseGame
  @State var input: String = ""
  @State var cJoinGameState: joinGameState = joinGameState.notStarted
  @State var createGameState: loadingState = loadingState.notStarted
  @Environment(\.openURL) var openURL
  
  func clearJoinGameState() {
    cJoinGameState = joinGameState.notStarted
  }
  
  func goToInformation() {
    currentMode.mode = ViewType.info
  }
  
  func goToAccount() {
    currentMode.mode = ViewType.account
    currentMode.previousMode = ViewType.home
  }
  
  func goToApp() {
    if let url = URL(string: "Archimedes4.UTTT://home") {
      openURL(url)
    }
  }
  
  func clearInput() {
    input = ""
  }
  
  func createGame() {
    createGameState = loadingState.loading
    currentGame.currentGame = gameState.loading
    Task {
      guard let uid = Auth.auth().currentUser?.uid else {
        currentMode.mode = ViewType.login
        return
      }
      guard let result = await Game().createGame(uid: uid) else {
        createGameState = loadingState.failed
        return
      }
      createGameState = loadingState.success
      currentGame.updateGameId(gameId: result)
      currentMode.mode = ViewType.waitToJoin
    }
  }
  
  func joinGame() {
    Task {
      if (input == "") {
        return
      }
      cJoinGameState = joinGameState.loading
      currentGame.currentGame = gameState.loading
      currentGame.updateGameId(gameId: input)
      guard let uid = Auth.auth().currentUser?.uid else {
        currentMode.mode = ViewType.login
        return
      }
      let result = await Game().joinGame(gameId: input, uid: uid)
      cJoinGameState = result
      if (result == joinGameState.success) {
        currentMode.mode = ViewType.game
      }
    }
  }
  
  var body: some View {
    if (cJoinGameState == joinGameState.failed) {
      ZStack {
        VStack {
          UTTTHeader()
          HStack {
            Text("Something went wrong!")
              .foregroundStyle(.white)
          }.padding(.top, 5)
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        BackButton(goBack: {
          cJoinGameState = joinGameState.notStarted
        })
      }
    } else if (cJoinGameState == joinGameState.loading) {
      VStack {
        UTTTHeader()
        HStack {
          ProgressView()
            .tint(.white)
          Text("Joining Game")
            .foregroundStyle(.white)
        }.padding(.top, 5)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    } else if (cJoinGameState == joinGameState.success) {
      VStack {
        Text("Successfully joined the game.")
          .foregroundStyle(.white)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    } else if (cJoinGameState == joinGameState.gameFull) {
      ZStack {
        VStack {
          UTTTHeader()
          Text("The Game is full!")
            .foregroundStyle(.white)
            .padding(.top, 5)
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        BackButton(goBack: {
          cJoinGameState = joinGameState.notStarted
        })
      }
    } else if (createGameState == loadingState.loading) {
      VStack {
        UTTTHeader()
        HStack {
          ProgressView()
            .tint(.white)
          Text("Creating the Game!")
            .foregroundStyle(.white)
        }.padding(.top, 5)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    } else {
      GeometryReader { geometry in
        VStack {
          UTTTHeader()
          HStack(spacing: 0) {
            VStack {
              HStack {
                TextField("Game ID", text: $input)
                  .lineLimit(1)
                  .disableAutocorrection(true)
                  .frame(height: 30)
                if (input != "") {
                  Button(action: clearInput) {
                    Image(systemName: "xmark.circle.fill")
                      .resizable()
                      .frame(width: 30, height: 30)
                      .foregroundStyle(.black)
                  }
                }
              }
              .padding()
              .background(.white)
              .frame(height: 50)
              .clipShape(.rect(cornerRadius: 8))
              .overlay(
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
                    .frame(width: ((geometry.size.width - 90) * 0.5) - 5, height: 50)
                    .background(Color.white)
                    .clipShape(.rect(cornerRadius: 8))
                    .overlay( /// apply a rounded border
                        RoundedRectangle(cornerRadius: 8)
                            .stroke(.black, lineWidth: 1)
                    )
                    .padding(.trailing, 10)
                  }
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
                  .frame(width: ((geometry.size.width - 90) * (input.count != 0 ? 0.5:1)) - (input.count != 0 ? 5:0), height: 50)
                  .background(Color.white)
                  .clipShape(.rect(cornerRadius: 8))
                  .overlay( /// apply a rounded border
                      RoundedRectangle(cornerRadius: 8)
                          .stroke(.black, lineWidth: 1)
                  )
                }
              }.frame(width:(geometry.size.width - 90))
            }.frame(width:(geometry.size.width - 90))
            VStack {
              Button(action: goToInformation) {
                Image(systemName: "info.circle")
                  .resizable()
                  .frame(width: 25, height: 25)
                  .foregroundStyle(.white)
              }
              Button(action: goToAccount) {
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

