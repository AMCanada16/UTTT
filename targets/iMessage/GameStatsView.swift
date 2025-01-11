//
//  GameStatsView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-12.
//

import SwiftUI

struct GameStatsView: View {
    @Binding var mode: ViewType
    
    func goHome() {
        mode = ViewType.game
    }
    
    var body: some View {
      VStack {
        GeometryReader { geometry in
          VStack {
              Button(action: goHome) {
                  Text("Back")
              }
            Text("Game Id: " + "456789")
          }.frame(width: geometry.size.width, height: geometry.size.height)
        }
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    }
}
