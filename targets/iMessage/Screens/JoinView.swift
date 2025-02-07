//
//  JoinView.swift
//  UTTT
//
//  Created by Andrew Mainella on 2025-02-07.
//
import SwiftUI
import FirebaseAuth

struct JoinView: View {
  @EnvironmentObject var currentMode: CurrentMode
  @EnvironmentObject var useGame: UseGame
  
  func joinGame() {
    Task {
      if (useGame.joinId == "") {
        return
      }
      useGame.currentJoinGameState = joinGameState.loading
      useGame.currentGame = gameState.loading
      useGame.updateGameId(gameId: useGame.joinId)
      guard let uid = Auth.auth().currentUser?.uid else {
        currentMode.mode = ViewType.login
        return
      }
      let result = await Game().joinGame(gameId: useGame.joinId, uid: uid)
      useGame.currentJoinGameState = result
      if (result == joinGameState.success) {
        currentMode.mode = ViewType.game
      }
    }
  }
  
  func goToHome() {
    currentMode.mode = ViewType.home
  }
  
  var body: some View {
    switch (useGame.currentJoinGameState){
    case .failed:
      ZStack {
        VStack {
          UTTTHeader()
          HStack {
            Text("Something went wrong!")
              .foregroundStyle(.white)
          }.padding(.top, 5)
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        BackButton(goBack: {
          currentMode.mode = ViewType.home
        })
      }
    case .loading:
      VStack {
        UTTTHeader()
        HStack {
          ProgressView()
            .tint(.white)
          Text("Joining Game")
            .foregroundStyle(.white)
        }.padding(.top, 5)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    case .success:
      VStack {
        UTTTHeader()
        Text("Successfully joined the game.")
          .foregroundStyle(.white)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    case .gameFull:
      ZStack {
        VStack {
          UTTTHeader()
          Text("The Game is full!")
            .foregroundStyle(.white)
            .padding(.top, 5)
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        BackButton(goBack: {
          currentMode.mode = ViewType.home
        })
      }
    case .accept:
      ZStack {
        GeometryReader { geometry in
          VStack {
            UTTTHeader()
            Text("Do you want to join the game?")
              .foregroundStyle(.white)
              .padding(.top, 5)
            Button(action: joinGame) {
              HStack {
                Image(systemName: "info.circle")
                  .resizable()
                  .foregroundStyle(.black)
                  .aspectRatio(contentMode: .fit)
                  .frame(maxHeight: 25)
                Text("Join the game!")
                  .foregroundStyle(.black)
                  .lineLimit(1)
                  .minimumScaleFactor(0.5)
              }
              .padding()
              .frame(width: geometry.size.width - 50, height: 50)
              .background(Color.white)
              .clipShape(.rect(cornerRadius: 8))
              .overlay( /// apply a rounded border
                RoundedRectangle(cornerRadius: 8)
                  .stroke(.black, lineWidth: 1)
              )
            }
            Button(action: goToHome) {
              HStack {
                Image(systemName: "info.circle")
                  .resizable()
                  .foregroundStyle(.black)
                  .aspectRatio(contentMode: .fit)
                  .frame(maxHeight: 25)
                Text("Go Back")
                  .foregroundStyle(.black)
                  .lineLimit(1)
                  .minimumScaleFactor(0.5)
              }
              .padding()
              .frame(width: geometry.size.width - 50, height: 50)
              .background(Color.white)
              .clipShape(.rect(cornerRadius: 8))
              .overlay( /// apply a rounded border
                RoundedRectangle(cornerRadius: 8)
                  .stroke(.black, lineWidth: 1)
              )
            }
          }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        }
        BackButton(goBack: {
          currentMode.mode = ViewType.home
        })
      }
        
    case .noGame:
      ZStack {
        VStack {
          UTTTHeader()
          Text("The game does not exist!")
            .foregroundStyle(.white)
            .padding(.top, 5)
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        BackButton(goBack: {
          currentMode.mode = ViewType.home
        })
      }
    }
  }
}
