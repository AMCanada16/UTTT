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
              Image(systemName: "chevron.left")
                .resizable()
                .foregroundColor(.white)
                .aspectRatio(contentMode: .fit)
            }
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
          }
          Image(systemName: "person.crop.circle")
          Text(username)
          HStack {
            VStack {
              
            }.frame(width: (geometry.size.width-45)/2, height: (geometry.size.height - 100)/2).background(Color.white)
            VStack {
              
            }.frame(width: (geometry.size.width-45)/2, height: (geometry.size.height - 100)/2).background(Color.white)
          }
          HStack {
            VStack {
              
            }.frame(width: (geometry.size.width-45)/2, height: (geometry.size.height - 100)/2).background(Color.white)
            VStack {
              
            }.frame(width: (geometry.size.width-45)/2, height: (geometry.size.height - 100)/2).background(Color.white)
          }
        }.frame(width: geometry.size.width, height: geometry.size.height)
      }
    }
    .frame(maxWidth: .infinity, maxHeight: .infinity)
    .background(Color.primary)
    .onAppear() {
      Task {
        await loadAccount()
      }
    }
  }
}
