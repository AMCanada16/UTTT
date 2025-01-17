//
//  ViewController.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-09.
//

import SwiftUI
import Firebase
import FirebaseAuth

struct ViewController: View {
  @EnvironmentObject var currentMode: CurrentMode
  @StateObject var currentGame = UseGame()
  let addMessage: AddMessageType
  var body: some View {
    ZStack {
      if (currentMode.mode == ViewType.login) {
        LoginView()
      } else if (currentMode.mode == ViewType.game) {
        GameView(addMessage: addMessage)
          .environmentObject(currentGame)
      } else if (currentMode.mode == ViewType.account) {
        AccountView()
      } else if (currentMode.mode == ViewType.gameOver) {
        GameOverView()
      } else if (currentMode.mode == ViewType.home) {
        HomeView()
          .environmentObject(currentGame)
      } else if (currentMode.mode == ViewType.gameStats) {
        GameStatsView()
          .environmentObject(currentGame)
      } else if (currentMode.mode == ViewType.waitToJoin) {
        WaitToJoin(addMessage: addMessage)
          .environmentObject(currentGame)
      } else if (currentMode.mode == ViewType.info) {
        InfoView()
      }
    }.onAppear() {
      Auth.auth().addStateDidChangeListener { auth, user in
        if (user != nil && currentMode.mode == ViewType.login) {
          currentMode.mode = ViewType.home
        } else if (user == nil) {
          currentMode.mode = ViewType.login
        }
      }
    }
  }
}
