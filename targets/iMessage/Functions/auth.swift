//
//  Keychain.swift
//  ArchGithHubStatus
//
//  Created by Andrew Mainella on 2024-01-05.
//

import Foundation
import Security
import FirebaseAuth

class KeychainService {
    func save(_ secret: String, for id: String) {
      let query = [kSecClass: kSecClassGenericPassword,
                    kSecUseDataProtectionKeychain: true,
                    kSecValueData: Data(secret.utf8)] as CFDictionary
      let result = self.retriveSecret(id: id)
      if (result == nil) {
        let status = SecItemAdd(query as CFDictionary, nil)
        guard status == errSecSuccess else { return print("save error")}
      } else {
        let attributesToUpdate = [
          kSecValueData:Data(secret.utf8)
        ] as CFDictionary
        let status = SecItemUpdate(query as CFDictionary, attributesToUpdate)
        guard status == errSecSuccess else { return print("save error")}
      }
    }
    func retriveSecret(id: String) -> String? {
      let query: [String: Any] = [kSecClass as String: kSecClassGenericPassword,
                                  kSecMatchLimit as String: kSecMatchLimitOne,
                                  kSecReturnData as String: true]
        
        
        var retrivedData: AnyObject? = nil
        let error = SecItemCopyMatching(query as CFDictionary, &retrivedData)
        
        guard let data = retrivedData as? Data else {return nil}
        return String(data: data, encoding: String.Encoding.utf8)
    }
}

struct TokenManager: Codable {
  var refreshToken: String
  var accessToken: String
  var expirationTime: Int
}

struct PersistanceResponse: Codable {
  var uid: String
  var emailVerified: Bool
  var isAnonymous: Bool
  //var providerData: [String: Any]
  var stsTokenManager: TokenManager
  var createdAt: String
  var apiKey: String
  var appName: String
}

func getPersistance() async {
  let apiKey = "AIzaSyCCAWNKF8eHsynUew6iUSbj1RVW4IjTk8Q"
  // If this is not working check Expo-secure-store add `kSecAttrAccessGroup as String: "SYV2CK2N9N.Archimedes4.UTTT"` to query
  guard let resultOne = KeychainService().retriveSecret(id: "firebaseauthUserAIzaSyCCAWNKF8eHsynUew6iUSbj1RVW4IjTk8QDEFAULT".replacing(/[:\[\]]/, with: "")) else {
    return
  }
  print(resultOne)
  let data = resultOne.data(using: .utf8)!
  let decoder = JSONDecoder()

  do {
    let jsonPetitions = try decoder.decode(PersistanceResponse.self, from: data)
    //let signInRes = try await Auth.auth().signIn(withCustomToken: jsonPetitions.stsTokenManager.refreshToken)
    //print(signInRes.user.displayName)
    let cred = OAuthProvider.credential(providerID: .apple, accessToken: jsonPetitions.stsTokenManager.accessToken)
    let tempUser = try await Auth.auth().signIn(with: cred)
    print(tempUser)
  } catch let error {
    print("Error \(error.localizedDescription)")
  }
}
