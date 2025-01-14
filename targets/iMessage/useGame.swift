//
//  useGame.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-12.
//

import Foundation
import FirebaseFirestore
import FirebaseAuth

enum gameState: Equatable {
	case loading
	case error
	case game (GameType)
	
	static func ==(lhs: gameState, rhs: gameState) -> Bool {
		switch (lhs, rhs) {
			case (let .game(_a1), let .game(_a2)):
				return true
			case (.error, .error):
				return true
			case (.loading, .loading):
				return true
			default:
				return false
			}
	}
}

struct innerValueActiveType: Codable {
  var xOne: Int
  var xTwo: Int
  var yOne: Int
  var yTwo: Int
  var firstIndex: Int
  var secondIndex: Int
}

struct compressedUserTypeRaw: Codable {
  var userId: String
  var player: Int
}
let emptyGame = [gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                
                // ---------
                
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                
                // ---------
                
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open,
                gridStateMode.open,gridStateMode.open,gridStateMode.open]

class UseGame: ObservableObject {
  @Published var currentGame: gameState = gameState.loading
  @Published var madeMove: Bool = false
  private var gameId: String = ""
  
  func followGame() {
    if (Auth.auth().currentUser == nil || gameId == "") {
      return
    }
    let db = Firestore.firestore()
    db.collection("Games").document(gameId).addSnapshotListener { [self] documentSnapshot, error in
      guard let document = documentSnapshot else {
        print("Error fetching document: \(error!)")
        return
      }
      if (document.exists) {
        guard let data = document.data() else {
          return
        }
        print("start")
        guard let currentTurnTemp = data["currentTurn"] as? Int, let currentTurn = gridStateMode(rawValue: currentTurnTemp) else {
          print("current Turn Error")
          return
        }
        guard let date = data["date"] as? String else {
          print("date Error")
          return
        }
        guard let gameOverTemp = data["gameOver"] as? Int, let gameOver = gridStateMode(rawValue: gameOverTemp) else {
          print("gameOver Error")
          return
        }
        guard let rawGameData = data["data"] as? [String:Any] else {
          print("gameDataError")
          return
        }
        guard let gameData = try? Game().jsonToDimentionalType(json: rawGameData) else {
          print("Game Error")
          return
        }
        guard let selectedGrid = data["selectedGrid"] as? Int else {
          print("selectedGrid Error")
          return
        }
        guard let gameId = data["gameId"] as? String else {
          print("gameId Error")
          return
        }
        
        let decoder = JSONDecoder()

        let tempUsers = try! decoder.decode([compressedUserTypeRaw].self, from:  try! JSONSerialization.data(withJSONObject: data["users"]!, options: []))
        var users: [compressedUserType] = []
        for user in tempUsers {
          users.append(compressedUserType(userId: user.userId, player: gridStateMode(rawValue: user.player)!))
        }
        guard let joinRuleTemp = data["joinRule"] as? String, let joinRule = joinRules(rawValue: joinRuleTemp) else {
          print("joinRule Turn Error")
          return
        }
        guard let invitations = data["invitations"] as? [String] else {
          print("invitations Turn Error")
          return
        }
        guard let owner = data["owner"] as? String else {
          print("owner Turn Error")
          return
        }
        currentGame = gameState.game(GameType(currentTurn: currentTurn, date: date, gameOver: gameOver, data: gameData, selectedGrid: selectedGrid, gameId: gameId, users: users, joinRule: joinRule, invitations: invitations, owner: owner))
        print("Decoded")
      } else {
        print("Document not found")
      }
    }
  }
  
  func updateGameId(gameId: String) {
    self.gameId = gameId
    followGame()
  }
  
  init() {
    followGame()
  }
  
}
