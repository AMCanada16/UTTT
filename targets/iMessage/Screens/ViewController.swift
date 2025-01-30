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
  @ObservedObject var currentMode: CurrentMode
  @ObservedObject var useGame: UseGame
  @State var gettingPresistance: Bool = true;
  let addMessage: AddMessageType
  
  var body: some View {
    ZStack {
      if (currentMode.mode == ViewType.login) {
        if (gettingPresistance) {
          VStack {
            UTTTHeader()
            HStack {
              ProgressView()
                .tint(.white)
              Text("Loading...")
                .foregroundStyle(.white)
            }.padding(.top, 5)
          }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        } else {
          LoginView()
            .environmentObject(currentMode)
        }
      } else if (currentMode.mode == ViewType.game) {
        GameView(addMessage: addMessage)
          .environmentObject(useGame)
          .environmentObject(currentMode)
      } else if (currentMode.mode == ViewType.account) {
        AccountView()
          .environmentObject(currentMode)
      } else if (currentMode.mode == ViewType.gameOver) {
        GameOverView()
          .environmentObject(useGame)
          .environmentObject(currentMode)
      } else if (currentMode.mode == ViewType.home) {
        HomeView()
          .environmentObject(useGame)
          .environmentObject(currentMode)
      } else if (currentMode.mode == ViewType.gameStats) {
        GameStatsView()
          .environmentObject(useGame)
          .environmentObject(currentMode)
      } else if (currentMode.mode == ViewType.waitToJoin) {
        WaitToJoin(addMessage: addMessage)
          .environmentObject(useGame)
          .environmentObject(currentMode)
      } else if (currentMode.mode == ViewType.info) {
        InfoView()
          .environmentObject(currentMode)
      }
    }.onAppear() {
      Task {
        gettingPresistance = true
        await getPersistance()
        gettingPresistance = false
      }
      let _ = Auth.auth().addStateDidChangeListener { auth, user in
        if (user != nil && currentMode.mode == ViewType.login) {
          currentMode.mode = ViewType.home
        } else if (user == nil) {
          currentMode.mode = ViewType.login
        }
      }
    }
  }
}
