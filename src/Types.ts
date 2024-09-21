//Enums
export enum gridStateMode{
  open,
  x,
  o,
  full
}

export enum loadingState {
  loading,
  success,
  failed,
  exists,
  notStarted
}

export enum Colors {
  main = "#5E17EB",
  pink = "#ff9c9c",
  blue = "#5ce1e6"
}

// Make sure to update these rules in the iMessage app.
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
    gameOver: gridStateMode,
    data: DimentionalType,
    selectedGrid: number,
    gameId: string
  }

  type GameType = GameTypeBase & gameTypes

  type activeType = {
    xOne: number,
    xTwo: number,
    yOne: number,
    yTwo: number,
    gridIndex: number
  }

  type DimentionalType = {
    inner: gridStateMode[]
    value: gridStateMode[]
    active: activeType[]
  }

  type OnlineStatsType = {
    gamesPlayed: number,
    activeGames: number,
    gamesWon: number
  }
}

//Constants
export const emptyGame: DimentionalType = {
  inner: [
    gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open,
    gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open,
    gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open,
    gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open,
    gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open,
    gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open,
    gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open,
    gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open,
    gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open
  ],
  value: [gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open, gridStateMode.open],
  active: []
}