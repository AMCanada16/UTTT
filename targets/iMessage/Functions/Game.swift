import SwiftUI
import FirebaseFirestore
import FirebaseAuth

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
  /**
   * Get the online stats of the logged in user
   * @returns A failed state or the online stats of the user
   */
  func getOnlineGameStats() async -> OnlineStatsType? {
    guard let uid = Auth.auth().currentUser?.uid else {
      return nil
    }
    do {
      let db = Firestore.firestore()
      let gamesPlayedQuery = db.collection("Games").whereField("users", arrayContainsAny: [[
        "player": gridStateMode.x.rawValue,
        "userId": uid
      ], [
        "player": gridStateMode.o.rawValue,
        "userId": uid
      ]]).count
      let gamesPlayedResult = try await gamesPlayedQuery.getAggregation(source: .server)
      let gamesPlayed = gamesPlayedResult.count
      let activeGamesQuery = db.collection("Games").whereFilter(Filter.andFilter([
        Filter.whereField("gameOver", isEqualTo: gridStateMode.open.rawValue),
        Filter.whereField("users", arrayContainsAny: [
          [
            "player":gridStateMode.x.rawValue,
            "userId":uid
          ],
          [
            "player":gridStateMode.o.rawValue,
            "userId":uid
          ]
        ])
      ])).count
      let activePlayedResult = try await activeGamesQuery.getAggregation(source: .server)
      let activeGames = activePlayedResult.count
      let wonGamesQuery = db.collection("Games").whereField("userWon", isEqualTo: uid).count
      let wonGamesResult = try await wonGamesQuery.getAggregation(source: .server)
      let gamesWon = wonGamesResult.count
      return OnlineStatsType(gamesPlayed: gamesPlayed.intValue, activeGames: activeGames.intValue, gamesWon: gamesWon.intValue, gamesLost: gamesPlayed.intValue - gamesWon.intValue)
    } catch {
      return nil
    }
  }
  
  /**
   This gets the players grid state mode
   */
  func getPlayer(game: GameType) -> gridStateMode? {
    guard let uid = Auth.auth().currentUser?.uid else {
      return nil
    }
    guard let player: compressedUserType = game.users.first(where: {$0.userId == uid}) else {
      return nil
    }
    return player.player
  }
  
  func getUsername(uid: String) async -> String? {
    do {
      let db = Firestore.firestore()
      let userRef = db.collection("Users").document(uid)
      let doc = try await userRef.getDocument()
      if (doc.exists) {
        let data = doc.data()
        guard let username = data?["username"] as? String else {
          return nil
        }
        return username
      }
      return nil
    } catch {
      return nil
    }
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
      active.append(ActiveType(xOne: x["xOne"] as! Int, xTwo: x["xTwo"] as! Int, yOne: x["yOne"] as! Int, yTwo: x["yTwo"] as! Int, gridIndex: x["gridIndex"] as! Int))
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
  
  func dimentionalTypeToJson(dimentionalType: DimentionalType) throws -> [String:Any] {
    var rawActive: [[String:Any]] = []
    for x in dimentionalType.active {
      rawActive.append(["xOne":x.xOne,
                     "xTwo":x.xTwo,
                     "yOne":x.yOne,
                     "yTwo":x.yTwo,
                     "gridIndex":x.gridIndex])
    }
    
    let rawInner: [Int] = dimentionalType.inner.map({return $0.rawValue})
    let rawValue: [Int] = dimentionalType.value.map({return $0.rawValue})
  
    return [
      "active":rawActive,
      "inner":rawInner,
      "value":rawValue
    ]
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
      try await db.runTransaction({(transaction, errorPointer) -> Void in
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
          added = joinGameState.noGame
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
  
  func updateGame(game: GameType) async -> loadingState {
    var data: [String: Any] = [:]
    data["currentTurn"] = game.currentTurn.rawValue
    data["gameOver"] = game.gameOver.rawValue
    data["users"] = Users().usersToJson(users: game.users)
    data["selectedGrid"] = game.selectedGrid
    let db = Firestore.firestore()
    do {
      data["data"] = try Game().dimentionalTypeToJson(dimentionalType: game.data)
      try await db.collection("Games").document(game.gameId).updateData(data)
      return loadingState.success
    } catch {
      return loadingState.failed
    }
  }
  
  func getGame(state: gameState) -> GameType? {
    switch state {
    case .game(let currentGame):
      return currentGame
    default:
      return nil
    }
  }
  
  func createGame(uid: String) async -> String? {
    let db = Firestore.firestore()
    let date = Date();
    let randomId = Int(floor(Double(1000000 + Double.random(in: 0...1) * 9000000)))
    let playerMode = gridStateMode.x.rawValue
    let emptyDimension = DimentionalType(inner: emptyGame, value: [gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open], active: [])
    do {
      try await db.runTransaction({(transaction, errorPointer) -> Any? in
        do {
          let result = try transaction.getDocument(db.collection("Games").document(randomId.description))
          if (!result.exists){
            transaction.setData([
              "currentTurn": playerMode,
              "date": date.ISO8601Format(),
              "gameOver": gridStateMode.open.rawValue,
              "data": try self.dimentionalTypeToJson(dimentionalType: emptyDimension),
              "users": [[
                "userId": uid,
                "player": playerMode
              ]],
              "gameId": randomId.description,
              "gameType": "online",
              "selectedGrid": 0,
              "joinRule": "friends",
              "invitations": [],
              "owner": uid
            ], forDocument: db.collection("Games").document(randomId.description))
          }
          print("Game created")
          return
        } catch {
          return
        }
      })
      return randomId.description
    } catch {
      return nil
    }
  }
}
