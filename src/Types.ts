//Enums
export enum gridStateMode{
  Open,
  X,
  O,
  Full
}

//Types
declare global{
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