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
  @State var mode: ViewType = ViewType.game;
  @StateObject var currentGame = UseGame()
  let addMessage: AddMessageType
  var body: some View {
    ZStack {
      if (mode == ViewType.login) {
        LoginView()
      } else if (mode == ViewType.game) {
        GameView(mode: $mode, addMessage: addMessage)
          .environmentObject(currentGame)
      } else if (mode == ViewType.account) {
        AccountView(mode: $mode)
      } else if (mode == ViewType.gameOver) {
        
      } else if (mode == ViewType.home) {
        HomeView(mode: $mode)
          .environmentObject(currentGame)
      } else if (mode == ViewType.gameStats) {
        GameStatsView(mode: $mode)
          .environmentObject(currentGame)
      } else if (mode == ViewType.waitToJoin) {
        WaitToJoin(mode: $mode, addMessage: addMessage)
          .environmentObject(currentGame)
      } else if (mode == ViewType.info) {
        InfoView(mode: $mode)
      }
    }.onAppear() {
      Auth.auth().addStateDidChangeListener { auth, user in
        if (user != nil && mode == ViewType.login) {
          mode = ViewType.home
        } else if (user == nil) {
          mode = ViewType.login
        }
      }
    }
  }
}
