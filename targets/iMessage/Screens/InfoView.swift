//
//  InfoView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-09.
//

import SwiftUI
import Firebase
import FirebaseAuth

struct InfoView: View {
  @EnvironmentObject var currentMode: CurrentMode
  
  func goBack() {
    currentMode.mode = ViewType.home
  }
  
  var body: some View {
    ZStack {
      GeometryReader { geometry in
        VStack {
          UTTTHeader()
          Text("Info about the game")
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
      }
      BackButton(goBack: {
        currentMode.mode = ViewType.home
      })
    }
  }
}
