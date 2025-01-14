
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
  @Binding var mode: ViewType
  
  var body: some View {
    VStack {
      
    }.onAppear() {
      switch useGame.currentGame {
        case .game(let game):
        if (game.users.count >= 2) {
          mode = ViewType.game
        }
        default:
          break
      }
    }
  }
}
