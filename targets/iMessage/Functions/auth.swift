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
                                  kSecAttrGeneric as String: id,
                                  kSecAttrAccount as String: id,
                                  kSecReturnData as String: true]
        
        
      var retrivedData: AnyObject? = nil
      SecItemCopyMatching(query as CFDictionary, &retrivedData)

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

struct PersistanceApiResponse: Codable {
  var response: String
  var token: String?
}

struct RevokerApiResponse: Codable {
  var response: String
}

func getPersistance() async {
  let API_KEY = "AIzaSyCCAWNKF8eHsynUew6iUSbj1RVW4IjTk8Q"
  // If this is not working check Expo-secure-store add `kSecAttrAccessGroup as String: "SYV2CK2N9N.Archimedes4.UTTT"` to query
  guard let keychainResult = KeychainService().retriveSecret(id: "firebaseauthUser\(API_KEY)DEFAULT".replacing(/[:\[\]]/, with: "")) else {
    return
  }

  let data = keychainResult.data(using: .utf8)!
  let decoder = JSONDecoder()

  do {
    let jsonPetitions = try decoder.decode(PersistanceResponse.self, from: data)
    
    guard let url = URL(string: "https://us-central1-archimedes4-games.cloudfunctions.net/exchangeToken") else {
        return
    }
    // Parameters for x-www-form-urlencoded body
    let parameters = [
      "refresh_token": jsonPetitions.stsTokenManager.refreshToken
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
    let result = try JSONDecoder().decode(PersistanceApiResponse.self, from: data)
    if (result.response != "success") {
      return
    }
    guard let token = result.token else {
      return
    }
    try await Auth.auth().signIn(withCustomToken: token)
  } catch let error {
    print("Error \(error)")
  }
}
