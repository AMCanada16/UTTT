import SwiftUI
import FirebaseFirestore

class Users {
  func jsonToUsers(json: [String: Any]) throws -> [compressedUserType] {
    let decoder = JSONDecoder()

    guard let tempUsers = try? decoder.decode([compressedUserTypeRaw].self, from:  try! JSONSerialization.data(withJSONObject: json["users"]!, options: [])) else {
      throw GeneralError.main("The json was not decoded correctly")
    }
    var users: [compressedUserType] = []
    for user in tempUsers {
      users.append(compressedUserType(userId: user.userId, player: gridStateMode(rawValue: user.player)!))
    }
    return users
  }
  func usersToJson(users: [compressedUserType]) -> [[String: Any]] {
    var result: [[String: Any]] = []
    for user in users {
      result.append(["userId":user.userId, "player":user.player.rawValue])
    }
    return result
  }
}

class Game {
  func jsonToDimentionalType(json: [String: Any]) throws -> DimentionalType {
    var gameData = DimentionalType(inner: emptyGame, value: [gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open], active: [])
    guard let rawActive = json["active"] as? [[String: Any]] else {
      throw GeneralError.main("Active is not present")
    }
    var active: [ActiveType] = []
    for x in rawActive {
      active.append(ActiveType(xOne: x["xOne"] as! Int, xTwo: x["xTwo"] as! Int, yOne: x["yOne"] as! Int, yTwo: x["yTwo"] as! Int, firstIndex: x["firstIndex"] as! Int, secondIndex: x["secondIndex"] as! Int))
    }
    guard let rawInner = json["inner"] as? [Int] else {
      print("inner Error")
      throw GeneralError.main("Inner is not present")
    }
    let inner: [gridStateMode] = rawInner.map({return gridStateMode(rawValue: $0)!})
    guard let rawValue = json["value"] as? [Int] else {
      print("value Error")
      throw GeneralError.main("Value is not present")
    }
    let value: [gridStateMode] = rawValue.map({return gridStateMode(rawValue: $0)!})
    gameData.active = active
    gameData.inner = inner
    gameData.value = value
    return gameData
  }
  
  func dimentionalTypeToJson(json: [String: Any]) throws -> DimentionalType {
    var gameData = DimentionalType(inner: emptyGame, value: [gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open], active: [])
    guard let rawActive = json["active"] as? [[String: Any]] else {
      throw GeneralError.main("Active is not present")
    }
    var active: [ActiveType] = []
    for x in rawActive {
      active.append(ActiveType(xOne: x["xOne"] as! Int, xTwo: x["xTwo"] as! Int, yOne: x["yOne"] as! Int, yTwo: x["yTwo"] as! Int, firstIndex: x["firstIndex"] as! Int, secondIndex: x["secondIndex"] as! Int))
    }
    guard let rawInner = json["inner"] as? [Int] else {
      print("inner Error")
      throw GeneralError.main("Inner is not present")
    }
    let inner: [gridStateMode] = rawInner.map({return gridStateMode(rawValue: $0)!})
    guard let rawValue = json["value"] as? [Int] else {
      print("value Error")
      throw GeneralError.main("Value is not present")
    }
    let value: [gridStateMode] = rawValue.map({return gridStateMode(rawValue: $0)!})
    gameData.active = active
    gameData.inner = inner
    gameData.value = value
    return gameData
  }
  
  /**
   * A function to add the user to the players. Will fail if two players are already in the game
   * @param gameId The id of the game to join
   * @param currentUserId The uid of the joining user
   * @returns a boolean on the result
   */
  func joinGame(gameId: String, uid: String) async -> joinGameState {
    if (gameId == "") {
      return joinGameState.noGame
    }
    var added: joinGameState = joinGameState.failed
    do {
      let db = Firestore.firestore()
      try await db.runTransaction({(transaction, errorPointer) -> Any? in
        guard let result = try? transaction.getDocument(db.collection("Games").document(gameId)) else {
          return
        }
        if (result.exists){
          guard let data = result.data() else {
            added = joinGameState.failed
            return
          }
          guard var users = try? Users().jsonToUsers(json: data) else {
            added = joinGameState.failed
            return
          }
          if (users.contains(where: {$0.userId == uid})) {
            added = joinGameState.success
            return
          }
          if (users.count < 2){
            users.append(compressedUserType(userId: uid, player: gridStateMode.o))
            transaction.updateData([
              "users":Users().usersToJson(users: users)
            ], forDocument: db.collection("Games").document(gameId))
            added = joinGameState.success
          } else {
            added = joinGameState.gameFull
          }
        } else {
          added = joinGameState.notStarted
        }
        return
      })
    } catch {
      return joinGameState.failed
    }
    return added
  }
  
  func isCurrentUsersTurn(game: GameType, uid: String) -> Bool {
    let playingUser = game.users.first(where: {$0.userId == uid})
    if (playingUser?.player == game.currentTurn) {
      return true
    }
    return false
  }
  
  func updateGame(game: GameType) -> loadingState {
    var data: [String: Any] = [:]
    data["currentTurn"] = game.currentTurn.rawValue
    data["gameOver"] = game.gameOver.rawValue
    data["data"] = [:]
    data["users"] = Users().usersToJson(users: game.users)
    data["selectedGrid"] = game.selectedGrid
    
    return loadingState.failed
  }
}
