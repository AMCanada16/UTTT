
//
//  InfoView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-09.
//

import SwiftUI

struct BackButton: View {
  let goBack: () -> Void
  
  var body: some View {
    VStack {
      HStack {
        Button(action: goBack) {
          Image(systemName: "arrowshape.backward.circle")
            .resizable()
            .frame(width: 40, height: 40)
            .foregroundStyle(.white)
        }
        .padding(.leading, 15)
        .padding(.top, 15)
        Spacer()
      }
      Spacer()
    }
  }
}
