//Enums
export enum gridStateMode{
  Open,
  X,
  O,
  Full
}

//Types
declare global{
  type userType = compressedUserType & {
    username: string
  }
  type compressedUserType = {
    userId: string,
    player: gridStateMode
  }
  type gameTypes =  | {
    gameType: "online",
    users: compressedUserType[]
  } | {
    gameType: "ai",
    users?: never
  } | {
    gameType: "friend",
    users?: never
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