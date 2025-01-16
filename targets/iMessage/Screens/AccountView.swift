//
//  AccountView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-10.
//

import SwiftUI
import Firebase
import FirebaseAuth

struct AccountView: View {
  @Binding var mode: ViewType
  @State var isLoading: Bool = false
  @State var username: String = ""
  @State var onlineStats: OnlineStatsType? = nil
  
  func loadAccount() async {
    guard let currentUser = Auth.auth().currentUser else {
      return
    }
    let db = Firestore.firestore()
    let docRef = db.collection("Users").document(currentUser.uid)
    do {
      let document = try await docRef.getDocument()
      if document.exists {
        let data = document.data()
        username = (data?["username"] as? String) ?? ""
        print("Document data: \(username)")
      } else {
        print("Document does not exist")
      }
    } catch {
      print("Error getting document: \(error)")
    }
  }
  
  func goBack() {
    mode = ViewType.game
  }
  
  var body: some View {
    VStack {
      GeometryReader { geometry in
        VStack {
          HStack {
            Spacer()
            Button(action: goBack) {
              Image(systemName: "arrowshape.backward.circle")
                .resizable()
                .frame(width: 40, height: 40)
                .foregroundStyle(.white)
            }
            Spacer()
            Image("Logo")
              .resizable()
              .frame(width: 35, height: 35)
              .padding([.trailing], 5)
            ZStack {
              Text("Ultimate")
                .font(.custom("Ultimate", size: 35))
                .offset(x: -2, y: -1)
                .foregroundColor(Color(UIColor(hex: "#00fffcff")!))
              Text("Ultimate")
                .font(.custom("Ultimate", size: 35))
                .offset(x: -2, y: 2)
                .foregroundColor(Color(UIColor(hex: "#fc00ffff")!))//Pink
              Text("Ultimate")
                .font(.custom("Ultimate", size: 35))
                .offset(x: 1, y: 2)
                .foregroundColor(Color(UIColor(hex: "#fffc00ff")!)) //Yello
              Text("Ultimate")
                .font(.custom("Ultimate", size: 35))
              Spacer()
            }
            Text("Tic")
              .font(.custom("RussoOne", size: 30))
              .shadow(color: Color(UIColor(hex: "#FF5757ff")!), radius: 25)
              .foregroundColor(Color(UIColor(hex: "#ff9c9cff")!))
            Text("Tac")
              .font(Font.custom("RussoOne", size: 30))
              .shadow(color: Color(UIColor(hex: "#5CE1E6ff")!), radius: 25)
              .foregroundColor(Color(UIColor(hex: "#a0f4f7ff")!))
            Text("Toe")
              .font(Font.custom("RussoOne", size: 30))
              .shadow(color: Color(UIColor(hex: "#FF5757ff")!), radius: 25)
              .foregroundColor(Color(UIColor(hex: "#ff9c9cff")!))
            Spacer()
          }
          HStack {
            Image(systemName: "person.crop.circle")
              .foregroundStyle(.white)
            Text(username)
              .font(.custom("RussoOne", size: 25))
              .foregroundStyle(.white)
          }
          let containerHeight = (geometry.size.height - (100 + geometry.safeAreaInsets.bottom))/2
          HStack {
            HStack {
              if (onlineStats == nil) {
                ProgressView()
              } else {
                Image("controller")
                  .resizable()
                  .aspectRatio(contentMode: .fit)
                  .padding(.vertical)
                Text(onlineStats!.gamesPlayed.description)
                  .padding(.leading, 5)
                  .padding(.vertical)
                  .font(.custom("Ultimate", size: 25))
              }
            }.frame(width: (geometry.size.width-45)/2, height: containerHeight)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 5))
            .overlay(
                RoundedRectangle(cornerRadius: 5)
                    .stroke(.black, lineWidth: 1)
            )
            HStack {
              if (onlineStats == nil) {
                ProgressView()
              } else {
                Image("crown")
                  .resizable()
                  .aspectRatio(contentMode: .fit)
                  .padding(.vertical)
                Text(onlineStats!.gamesWon.description)
                  .padding(.leading, 5)
                  .padding(.vertical)
                  .font(.custom("Ultimate", size: 25))
              }
            }.frame(width: (geometry.size.width-45)/2, height: containerHeight)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 5))
            .overlay(
                RoundedRectangle(cornerRadius: 5)
                    .stroke(.black, lineWidth: 1)
            )
          }
          HStack {
            HStack {
              if (onlineStats == nil) {
                ProgressView()
              } else {
                Image("skull")
                  .resizable()
                  .aspectRatio(contentMode: .fit)
                  .padding(.vertical)
                Text(onlineStats!.gamesLost.description)
                  .padding(.leading, 5)
                  .padding(.vertical)
                  .font(.custom("Ultimate", size: 25))
              }
            }.frame(width: (geometry.size.width-45)/2, height: containerHeight)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 5))
            .overlay(
                RoundedRectangle(cornerRadius: 5)
                    .stroke(.black, lineWidth: 1)
            )
            HStack {
              if (onlineStats == nil) {
                ProgressView()
              } else {
                Image("activity")
                  .resizable()
                  .aspectRatio(contentMode: .fit)
                  .padding(.vertical)
                Text(onlineStats!.activeGames.description)
                  .padding(.leading, 5)
                  .padding(.vertical)
                  .font(.custom("Ultimate", size: 25))
              }
            }.frame(width: (geometry.size.width-45)/2, height: containerHeight)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 5))
            .overlay(
                RoundedRectangle(cornerRadius: 5)
                    .stroke(.black, lineWidth: 1)
            )
          }.padding(.bottom, geometry.safeAreaInsets.bottom)
        }.frame(width: geometry.size.width, height: geometry.size.height)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(Color.primary)
    .onAppear() {
      Task {
        await loadAccount()
      }
      Task {
        onlineStats = await Users().getOnlineGameStats()
      }
    }
  }
}
