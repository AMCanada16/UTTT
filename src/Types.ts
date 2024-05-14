//Enums
export enum gridStateMode{
  Open,
  X,
  O,
  Full
}

export enum loadingState {
  loading,
  success,
  failed,
  exists,
  notStarted
}

export const joinRulesArray = ["public", "friends", "invitation"] as const

//Types
declare global{
  type gameUserType = compressedUserType & {
    username: string
  }
  type invitationUserType = {
    uid: string;
    username: string;
    isFriend: boolean;
  }
  type friendType = {
    username: string;
    uid: string;
    isFriend: boolean;
    isRequested: boolean;
    isRequesting: boolean;
  }
  type compressedUserType = {
    userId: string,
    player: gridStateMode
  }
  type joinRules = typeof joinRulesArray[number]
  type gameTypes =  | {
    gameType: "online",
    users: compressedUserType[], // The first user is the owner 
    joinRule: joinRules
    invitations: string[]// An array of uids of who has been invited
    owner: string
    userWon?: string
  } | {
    gameType: "ai",
    users?: never
    joinRule?: never
  } | {
    gameType: "friend",
    users?: never
    joinRule?: never
  }
  type GameTypeBase = {
    currentTurn: gridStateMode,
    date: string,
    gameOver: boolean
    data: DimentionalType,
    selectedGrid: number,
    gameId: string
  }
  type GameType = GameTypeBase & gameTypes

  type DimentionalType = {
    inner: RootType[][]
    value: gridStateMode[][]
    active?: {
      xOne: number,
      xTwo: number,
      yOne: number,
      yTwo: number
    }
  }
  
  type RootType = {
    value: gridStateMode[][] //represents grid. in 
    active?: {
      xOne: number,
      xTwo: number,
      yOne: number,
      yTwo: number
    }
  }

  type OnlineStatsType = {
    gamesPlayed: number,
    activeGames: number,
    gamesWon: number
  }
}

//Constants
export const emptyGame: DimentionalType = {
  inner: [[{
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }], [{
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }], [{
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }, {
    value: [  [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],   [gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
  }]],
  value: [[gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],[gridStateMode.Open, gridStateMode.Open, gridStateMode.Open],[gridStateMode.Open, gridStateMode.Open, gridStateMode.Open]]
}