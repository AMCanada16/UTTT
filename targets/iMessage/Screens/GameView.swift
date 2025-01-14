//
//  SwiftUIView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-08.
//

import SwiftUI

func getLength(width: CGFloat, height: CGFloat) -> CGFloat {
  if ((width - 30.0) < (height)) {
    return (width - 30.0)
  }
  return height
}

struct GameView: View {
  @Binding var mode: ViewType
  @EnvironmentObject var currentGame: UseGame
  let addMessage: () -> Void
  
  func goToAccount() {
    mode = ViewType.account
  }

  func goToGameStats() {
    mode = ViewType.gameStats
  }
	
	func goToHome() {
		mode = ViewType.createGame
	}
  
	var body: some View {
		GeometryReader {geometry in
			let length = getLength(width: geometry.size.width, height: geometry.size.height - geometry.safeAreaInsets.bottom)
			let tileLength = (length - 10)/3
			VStack {
				HStack {
					VStack (spacing: 5) {
						HStack (spacing: 5) {
							TickTackToe(currentGame: currentGame, gridIndex: 0)
								.frame(width: tileLength, height: tileLength)
							TickTackToe(currentGame: currentGame, gridIndex: 1)
								.frame(width: tileLength, height: tileLength)
							TickTackToe(currentGame: currentGame, gridIndex: 2)
								.frame(width: tileLength, height: tileLength)
						}
						HStack (spacing: 5) {
							TickTackToe(currentGame: currentGame, gridIndex: 3)
								.frame(width: tileLength, height: tileLength)
							TickTackToe(currentGame: currentGame, gridIndex: 4)
								.frame(width: tileLength, height: tileLength)
							TickTackToe(currentGame: currentGame, gridIndex: 5)
								.frame(width: tileLength, height: tileLength)
						}
						HStack (spacing: 5) {
							TickTackToe(currentGame: currentGame, gridIndex: 6)
								.frame(width: tileLength, height: tileLength)
							TickTackToe(currentGame: currentGame, gridIndex: 7)
								.frame(width: tileLength, height: tileLength)
							TickTackToe(currentGame: currentGame, gridIndex: 8)
								.frame(width: tileLength, height: tileLength)
						}
					}.frame(width: length, height: length).background(Color.primary)
					VStack {
            if (currentGame.madeMove) {
              Button(action: goToAccount) {
                Image(systemName: "xmark.circle.fill")
                  .resizable()
                  .frame(width: 50, height: 50)
                  .foregroundColor(.white)
                  .aspectRatio(contentMode: .fit)
              }
              
              Button(action: goToAccount) {
                Image(systemName: "arrow.up.circle.fill")
                  .resizable()
                  .frame(width: 50, height: 50)
                  .foregroundColor(.white)
                  .aspectRatio(contentMode: .fit)
              }
            } else {
              Button(action: goToAccount) {
                Image(systemName: "person.crop.circle")
                  .resizable()
                  .frame(width: 50, height: 50)
                  .foregroundColor(.white)
                  .aspectRatio(contentMode: .fit)
              }
              Button(action: goToGameStats) {
                Image(systemName: "gamecontroller")
                  .resizable()
                  .aspectRatio(contentMode: .fit)
                  .frame(width: 50, height: 50)
                  .foregroundColor(.white)
              }
              Button(action: goToHome) {
                Image(systemName: "chevron.left.circle.fill")
                  .resizable()
                  .aspectRatio(contentMode: .fit)
                  .frame(width: 50, height: 50)
                  .foregroundColor(.white)
              }
            }
					}
				}
			}.frame(maxWidth: .infinity, maxHeight: .infinity)
		}.background(Color.primary)
	}
}

extension Color {
    static let primary = Color("primary")
}
