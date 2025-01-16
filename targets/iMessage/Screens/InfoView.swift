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
  @Binding var mode: ViewType
  
  func goBack() {
    mode = ViewType.home
  }
  
  var body: some View {
    VStack {
      Button(action: goBack) {
        Image(systemName: "arrowshape.backward.circle")
          .resizable()
      }
      
    }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
  }
}
