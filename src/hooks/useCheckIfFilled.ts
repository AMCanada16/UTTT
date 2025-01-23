import { useEffect, useState } from "react"
import checkIfFilled from "@functions/checkIfFilled"

/**
 * Hook that checks if a cell is filled
 * @see checkIfFilled
 * @param game the current game
 * @param index the index of the tile
 * @param gridIndex 
 * @returns 
 */
export default function useCheckIfFilled(
  game: GameType,
  index: number,
  gridIndex: number
) {
  const [filled, setFilled] = useState<boolean>(false)
  useEffect(() => {
    setFilled(checkIfFilled(game, index, gridIndex))
  }, [game])
  return filled
}
