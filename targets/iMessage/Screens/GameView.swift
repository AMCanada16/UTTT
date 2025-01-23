//
//  SwiftUIView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-08.
//

import SwiftUI
import FirebaseAuth

func getLength(width: CGFloat, height: CGFloat) -> CGFloat {
  if ((width - 90.0) < (height)) {
    return (width - 90.0)
  }
  return height
}

struct MainGame: View {
  @EnvironmentObject var currentMode: CurrentMode
  @EnvironmentObject var useGame: UseGame
  
  func goToAccount() {
    currentMode.previousMode = ViewType.game
    currentMode.mode = ViewType.account
  }

  func goToGameStats() {
    currentMode.mode = ViewType.gameStats
  }
  
  func goToHome() {
    currentMode.mode = ViewType.home
  }
  
  func makeMove() {
    switch useGame.currentGame {
    case .game(let currentGame):
      useGame.previousGameState = nil
      Task {
        // TODO adding some loading funcionality
        await Game().updateGame(game: currentGame)
      }
    default:
      return
    }
  }
  
  func goBack() {
    useGame.currentGame = .game(useGame.previousGameState!)
    useGame.previousGameState = nil
  }
  
  func isShowingGameOver(currentGame: gameState, previousGame: GameType?) -> Bool {
    if (previousGame != nil) {
      return false
    }
    if (Game().getGame(state: useGame.currentGame)?.gameOver != gridStateMode.open) {
      return true
    }
    return false
  }
  
  var body: some View {
    GeometryReader {geometry in
      let length = getLength(width: geometry.size.width, height: geometry.size.height - geometry.safeAreaInsets.bottom)
      let tileLength = (length - 10)/3
      VStack {
        if (geometry.size.height >= length * 1.5) {
          UTTTHeader()
        }
        if (!Game().isCurrentUsersTurn(game: Game().getGame(state: useGame.currentGame)!, uid: Auth.auth().currentUser?.uid ?? "") && useGame.previousGameState == nil) {
          WaitForPlayer()
        }
        HStack {
          VStack (spacing: 5) {
            HStack (spacing: 5) {
              TickTackToe(gridIndex: 0)
                .frame(width: tileLength, height: tileLength)
              TickTackToe(gridIndex: 1)
                .frame(width: tileLength, height: tileLength)
              TickTackToe(gridIndex: 2)
                .frame(width: tileLength, height: tileLength)
            }
            HStack (spacing: 5) {
              TickTackToe(gridIndex: 3)
                .frame(width: tileLength, height: tileLength)
              TickTackToe(gridIndex: 4)
                .frame(width: tileLength, height: tileLength)
              TickTackToe(gridIndex: 5)
                .frame(width: tileLength, height: tileLength)
            }
            HStack (spacing: 5) {
              TickTackToe(gridIndex: 6)
                .frame(width: tileLength, height: tileLength)
              TickTackToe(gridIndex: 7)
                .frame(width: tileLength, height: tileLength)
              TickTackToe(gridIndex: 8)
                .frame(width: tileLength, height: tileLength)
            }
          }.frame(width: length, height: length).background(Color.primary)
          VStack {
            if (useGame.previousGameState != nil) {
              Button(action: goBack) {
                Image(systemName: "xmark.circle.fill")
                  .resizable()
                  .frame(width: 50, height: 50)
                  .foregroundColor(.white)
                  .aspectRatio(contentMode: .fit)
              }
              
              Button(action: makeMove) {
                Image(systemName: "arrow.up.circle.fill")
                  .resizable()
                  .frame(width: 50, height: 50)
                  .foregroundColor(.white)
                  .aspectRatio(contentMode: .fit)
              }
            } else {
              Button(action: goToAccount) {
                Image(systemName: "person.crop.circle")
                  .resizable()
                  .frame(width: 50, height: 50)
                  .foregroundColor(.white)
                  .aspectRatio(contentMode: .fit)
              }
              Button(action: goToGameStats) {
                Image(systemName: "gamecontroller")
                  .resizable()
                  .aspectRatio(contentMode: .fit)
                  .frame(width: 50, height: 50)
                  .foregroundColor(.white)
              }
              Button(action: goToHome) {
                Image(systemName: "chevron.left.circle.fill")
                  .resizable()
                  .aspectRatio(contentMode: .fit)
                  .frame(width: 50, height: 50)
                  .foregroundColor(.white)
              }
            }
          }
        }
      }.frame(maxWidth: .infinity, maxHeight: .infinity)
        .onAppear() {
          guard let currentGame = Game().getGame(state: useGame.currentGame) else {
            return
          }
          if (currentGame.users.count < 2) {
            currentMode.mode = ViewType.waitToJoin
          }
          if (currentGame.gameOver != gridStateMode.open) {
            currentMode.mode = ViewType.gameOver
          }
        }.onChange(of: isShowingGameOver(currentGame: useGame.currentGame, previousGame: useGame.previousGameState)) { oldVal, newVal in
          if (newVal) {
            currentMode.mode = ViewType.gameOver
          }
        }
    }.background(Color.primary)
  }
}

struct WaitForPlayer: View {
  var body: some View {
    Text("Waiting for other player to move.")
      .foregroundStyle(.white)
  }
}

struct LoadingView: View {
  @EnvironmentObject var currentMode: CurrentMode
  
  func goBack() {
    currentMode.mode = ViewType.home
  }
  
  var body: some View {
    ZStack {
      VStack() {
        HStack {
          ProgressView()
            .tint(.white)
          Text("Loading Game...")
            .foregroundStyle(.white)
        }
      }.frame(maxWidth: .infinity, maxHeight: .infinity)
      .background(Color.primary)
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
}

struct GameView: View {
  @EnvironmentObject var useGame: UseGame
  let addMessage: AddMessageType
  
	var body: some View {
    switch useGame.currentGame {
    case .error:
      Text("Something went wrong")
    case .loading:
      LoadingView()
    case .game(let currentGame):
      MainGame()
    }
	}
}

extension Color {
    static let primary = Color("primary")
}
