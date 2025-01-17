import { useEffect, useState } from "react"
import checkIfFilled from "@functions/checkIfFilled"

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
