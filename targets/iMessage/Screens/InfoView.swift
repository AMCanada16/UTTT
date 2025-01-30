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
  @Environment(\.openURL) var openURL
  
  func goBack() {
    currentMode.mode = ViewType.home
  }
  
  func goToApp() {
    if let url = URL(string: "Archimedes4.UTTT://home") {
      openURL(url)
    }
  }
  
  var body: some View {
    ZStack {
      GeometryReader { geometry in
        VStack {
          UTTTHeader()
          Text("This is the iMessage app of Ultimate Tic Tac Toe. It easy to play with your friends go to the app for more information!")
            .foregroundStyle(.white)
            .padding(.horizontal, 25)
          Button(action: goToApp) {
            HStack {
              Image(systemName: "info.circle")
                .resizable()
                .foregroundStyle(.black)
                .aspectRatio(contentMode: .fit)
                .frame(maxHeight: 25)
              Text("Open Ultimate Tic Tac Toe")
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
  }
}
