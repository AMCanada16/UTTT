//
//  JoinView.swift
//  UTTT
//
//  Created by Andrew Mainella on 2025-02-07.
//
import SwiftUI


struct JoinView: View {
  @EnvironmentObject var currentMode: CurrentMode
  @EnvironmentObject var currentGame: UseGame
  @State var cJoinGameState: joinGameState = joinGameState.notStarted
  var body: some View {
    if (cJoinGameState == joinGameState.failed) {
      ZStack {
        VStack {
          UTTTHeader()
          HStack {
            Text("Something went wrong!")
              .foregroundStyle(.white)
          }.padding(.top, 5)
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        BackButton(goBack: {
          currentMode.mode = ViewType.home
        })
      }
    } else if (cJoinGameState == joinGameState.loading) {
      VStack {
        UTTTHeader()
        HStack {
          ProgressView()
            .tint(.white)
          Text("Joining Game")
            .foregroundStyle(.white)
        }.padding(.top, 5)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    } else if (cJoinGameState == joinGameState.success) {
      VStack {
        UTTTHeader()
        Text("Successfully joined the game.")
          .foregroundStyle(.white)
      }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
    } else if (cJoinGameState == joinGameState.gameFull) {
      ZStack {
        VStack {
          UTTTHeader()
          Text("The Game is full!")
            .foregroundStyle(.white)
            .padding(.top, 5)
        }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
        BackButton(goBack: {
          cJoinGameState = joinGameState.notStarted
        })
      }
    }
  }
}
