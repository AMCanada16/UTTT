//
//  CreateGameView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-10.
//

import SwiftUI

struct CreateGameView: View {
    @Binding var mode: ViewType
    
    func goToMain() {
      mode = ViewType.game
    }
    
    var body: some View {
      VStack {
        Button(action: goToMain) {
            HStack {
                Text("Create Game")
            }.padding().background(Color.white).border(Color.black)
        }
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    }
}

