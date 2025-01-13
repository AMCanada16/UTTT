//
//  ViewController.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-09.
//

import SwiftUI
import Firebase
import FirebaseAuth

enum ViewType {
  case login, game, createGame, account, gameStats, gameOver
}

struct ViewController: View {
  @State var mode: ViewType = ViewType.game;
  @StateObject var currentGame = UseGame()
  var body: some View {
    ZStack {
      if (mode == ViewType.login) {
        LoginView()
      } else if (mode == ViewType.game) {
        GameView(mode: $mode)
          .environmentObject(currentGame)
      } else if (mode == ViewType.account) {
        AccountView(mode: $mode)
      } else if (mode == ViewType.gameOver) {
        
      } else if (mode == ViewType.createGame) {
        CreateGameView(mode: $mode)
          .environmentObject(currentGame)
      } else if (mode == ViewType.gameStats) {
        GameStatsView(mode: $mode)
          .environmentObject(currentGame)
      }
    }.onAppear() {
      Auth.auth().addStateDidChangeListener { auth, user in
        if (user != nil && mode == ViewType.login) {
          mode = ViewType.createGame
        } else if (user == nil) {
          mode = ViewType.login
        }
      }
    }
  }
}

#Preview {
    ViewController()
}
