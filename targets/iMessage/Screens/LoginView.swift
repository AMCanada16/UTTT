//
//  Login.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-09.
//

import SwiftUI
import AuthenticationServices
import Firebase
import CryptoKit
import FirebaseAuth

func getNonce() -> String {
  var randomBytes = [UInt8](repeating: 0, count: 32)
  let errorCode = SecRandomCopyBytes(kSecRandomDefault, randomBytes.count, &randomBytes)
  if errorCode != errSecSuccess {
    fatalError(
      "Unable to generate nonce. SecRandomCopyBytes failed with OSStatus \(errorCode)"
    )
  }

  let charset: [Character] =
    Array("0123456789ABCDEFGHIJKLMNOPQRSTUVXYZabcdefghijklmnopqrstuvwxyz-._")

  let nonce = randomBytes.map { byte in
    // Pick a random character from the set, wrapping around if needed.
    charset[Int(byte) % charset.count]
  }

  return String(nonce)
}

func sha256(_ input: String) -> String {
  let inputData = Data(input.utf8)
  let hashedData = SHA256.hash(data: inputData)
  let hashString = hashedData.compactMap {
    String(format: "%02x", $0)
  }.joined()

  return hashString
}

// TODO implament function
func signInWithGoogle() {
  
  return
}

struct LoginView: View {
  @State var currentNonce: String = ""
  var body: some View {
    VStack {
      GeometryReader { geometry in
        VStack (){
          UTTTHeader()
          SignInWithAppleButton(.signIn) {request in
            let nonce = getNonce()
            currentNonce = nonce
            request.nonce = sha256(nonce)
            request.requestedScopes = [.fullName]
          } onCompletion: { result in
            switch result {
              case .success(let authResults):
                guard let credentials = authResults.credential as? ASAuthorizationAppleIDCredential, let identityToken = credentials.identityToken, let identityTokenString = String(data: identityToken, encoding: .utf8) else { return }
                let credential = OAuthProvider.appleCredential(withIDToken: identityTokenString, rawNonce: currentNonce, fullName: credentials.fullName)

                // Sign in with Firebase.
                Auth.auth().signIn(with: credential) { (authResult, error) in
                  if (error != nil) {
                    return
                  }
                }
              case .failure(let error):
                 print("Authorization failed: " + error.localizedDescription)
           }
          }
          .frame(height: 50)
          .padding([.leading, .trailing], 25)
          Button(action: signInWithGoogle) {
            HStack {
              Image("google-icon")
                .resizable()
                .aspectRatio(contentMode: .fit)
                .padding(.vertical, 5)
              Text("Sign in With Google")
                .foregroundStyle(.black)
            }
            .frame(width: geometry.size.width - 50, height: 50)
            .background(Color.white)
            .clipShape(.rect(cornerRadius: 4))
            .overlay( /// apply a rounded border
                RoundedRectangle(cornerRadius: 4)
                    .stroke(.black, lineWidth: 1)
            )
            .padding([.leading, .trailing], 25)
          }
        }.frame(width: geometry.size.width, height: geometry.size.height)
      }
    }.frame(maxWidth: .infinity, maxHeight: .infinity).background(Color.primary)
  }
}

extension UIColor {
    public convenience init?(hex: String) {
        let r, g, b, a: CGFloat

        if hex.hasPrefix("#") {
            let start = hex.index(hex.startIndex, offsetBy: 1)
            let hexColor = String(hex[start...])

            if hexColor.count == 8 {
                let scanner = Scanner(string: hexColor)
                var hexNumber: UInt64 = 0

                if scanner.scanHexInt64(&hexNumber) {
                    r = CGFloat((hexNumber & 0xff000000) >> 24) / 255
                    g = CGFloat((hexNumber & 0x00ff0000) >> 16) / 255
                    b = CGFloat((hexNumber & 0x0000ff00) >> 8) / 255
                    a = CGFloat(hexNumber & 0x000000ff) / 255

                    self.init(red: r, green: g, blue: b, alpha: a)
                    return
                }
            }
        }

        return nil
    }
}

