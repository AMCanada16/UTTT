//
//  AccountView.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-10.
//

import SwiftUI
import Firebase
import FirebaseAuth



struct SignOutButtonView: View {
  @State var geometry: GeometryProxy
  
  init (for metrics: GeometryProxy) {
    self.geometry = metrics
  }
  
  func signOut() {
    Task {
      do {
        let idToken = try await Auth.auth().currentUser?.getIDToken()
        guard let url = URL(string: "https://us-central1-archimedes4-games.cloudfunctions.net/revokeTokens") else {
            return
        }
        // Parameters for x-www-form-urlencoded body
        let parameters = [
          "id_token": idToken
        ]

        // Convert parameters to x-www-form-urlencoded string
        let bodyString = parameters.map { "\($0.key)=\($0.value)" }.joined(separator: "&")
        guard let bodyData = bodyString.data(using: .utf8) else {
            return
        }

        // Create a URLRequest and set its properties
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.httpBody = bodyData
        request.setValue("application/x-www-form-urlencoded", forHTTPHeaderField: "Content-Type")
        
        let (data, _) = try await URLSession.shared.data(for: request)
        let result = try JSONDecoder().decode(RevokerApiResponse.self, from: data)
        print(result)
        if (result.response != "success") {
          return
        }
        try Auth.auth().signOut()
      } catch {
        print("something went wrong")
      }
    }
  }
  
  var body: some View {
    Button(action: signOut) {
      HStack {
        Image(systemName: "rectangle.portrait.and.arrow.right")
          .resizable()
          .foregroundStyle(.black)
          .aspectRatio(contentMode: .fit)
          .frame(maxHeight: 25)
        Text("Sign Out")
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
  }
}

struct AccountView: View {
  @EnvironmentObject var currentMode: CurrentMode
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
    if (currentMode.previousMode == ViewType.game) {
      currentMode.mode = ViewType.game
    } else {
      currentMode.mode = ViewType.home
    }
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
          Spacer()
          HStack {
            Image(systemName: "person.crop.circle")
              .resizable()
              .frame(width: 30, height: 30)
              .foregroundStyle(.white)
            Text(username)
              .font(.custom("RussoOne", size: 25))
              .foregroundStyle(.white)
          }
          Spacer()
          let containerHeight = min((geometry.size.height - (100 + geometry.safeAreaInsets.bottom))/2, 50)
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
            }.frame(width: (geometry.size.width-55)/2, height: containerHeight)
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
            }.frame(width: (geometry.size.width-55)/2, height: containerHeight)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 5))
            .overlay(
                RoundedRectangle(cornerRadius: 5)
                    .stroke(.black, lineWidth: 1)
            )
          }
          .padding(.horizontal, 25)
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
            }.frame(width: (geometry.size.width-55)/2, height: containerHeight)
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
            }.frame(width: (geometry.size.width-55)/2, height: containerHeight)
            .background(Color.white)
            .clipShape(RoundedRectangle(cornerRadius: 5))
            .overlay(
                RoundedRectangle(cornerRadius: 5)
                    .stroke(.black, lineWidth: 1)
            )
          }
          .padding(.horizontal, 25)
          SignOutButtonView(for: geometry)
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
