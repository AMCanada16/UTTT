export default function getIndex(tileIndex: number, gridIndex: number): number {
  let upperCount: number = Math.floor(((gridIndex/3))) * 27
  let yCount: number = Math.floor(tileIndex/3) * 9
  let xCount: number = tileIndex % 3
  let xOffset: number = (gridIndex % 3) * 3
  return upperCount + yCount + xOffset + xCount
}