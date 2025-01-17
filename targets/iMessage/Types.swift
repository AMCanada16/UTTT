//
//  Types.swift
//  UTTT Messages MessagesExtension
//
//  Created by Andrew Mainella on 2024-07-12.
//

import Foundation

enum gridStateMode: Int, Codable {
  case open, x, o, full
}

struct ActiveType {
	var xOne: Int
	var xTwo: Int
	var yOne: Int
	var yTwo: Int
	var gridIndex: Int
}

struct RootType {
  var value: [[gridStateMode]] //represents grid. in
  var active: ActiveType?
}

struct DimentionalType {
  var inner: [gridStateMode]
  var value: [gridStateMode]
  var active: [ActiveType]
}

struct compressedUserType {
  var userId: String
  var player: gridStateMode
}

enum joinRules: String {
  case `public`
  case friends
  case invitation
}

struct OnlineStatsType {
  var gamesPlayed: Int
  var activeGames: Int
  var gamesWon: Int
  var gamesLost: Int
}

struct GameType {
  var currentTurn: gridStateMode
  var date: String
  var gameOver: gridStateMode
  var data: DimentionalType
  var selectedGrid: Int
  var gameId: String
  var users: [compressedUserType] // The first user is the owner
  var joinRule: joinRules
  var invitations: [String]// An array of uids of who has been invited
  var owner: String
  var userWon: String?
}

enum joinGameState {
  case notStarted, success, failed, noGame, loading, gameFull
}

enum loadingState {
  case notStarted, success, failed, loading
}

enum GeneralError: Error {
    case main(String)
}

enum ViewType {
  case login, game, home, account, gameStats, gameOver, waitToJoin, info
}

typealias AddMessageType = (String) -> Void
