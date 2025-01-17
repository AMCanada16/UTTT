import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { gridStateMode } from '@types';

const initalState: GameType = {
  currentTurn: 0,
  date: new Date().toISOString(),
  gameOver: gridStateMode.open,
  data: {
    inner: [],
    value: [],
    active: []
  },
  selectedGrid: 0,
  gameType: 'ai',
  gameId: ''
}

export const gameSlice = createSlice({
  name: "game",
  initialState: initalState as GameType,
  reducers: {
    setGame: (_state, action: PayloadAction<GameType>) => {
      return action.payload
    },
    setSelectedGrid: (state, action: PayloadAction<number>) => {
      if (state.gameType === 'online') {
        return {
          currentTurn: state.currentTurn,
          date: new Date().toISOString(),
          gameOver: state.gameOver,
          data: state.data,
          selectedGrid: action.payload,
          gameType: state.gameType,
          gameId: state.gameId,
          users: state.users,
          joinRule: state.joinRule,
          userWon: state.userWon,
          invitations: state.invitations,
          owner: state.owner
        }
      }
      return {
        currentTurn: state.currentTurn,
        date: new Date().toISOString(),
        gameOver: state.gameOver,
        data: state.data,
        selectedGrid: action.payload,
        gameType: state.gameType,
        gameId: state.gameId,
        users: undefined
      }
    },
    setCurrentTurn: (state, action: PayloadAction<gridStateMode>) => {
      if (state.gameType === 'online') {
        return {
          currentTurn: action.payload,
          date: new Date().toISOString(),
          gameOver: state.gameOver,
          data: state.data,
          selectedGrid: state.selectedGrid,
          gameType: state.gameType,
          gameId: state.gameId,
          users: state.users,
          joinRule: state.joinRule,
          userWon: state.userWon,
          invitations: state.invitations,
          owner: state.owner
        }
      }
      return {
        currentTurn: action.payload,
        date: new Date().toISOString(),
        gameOver: state.gameOver,
        data: state.data,
        selectedGrid: state.selectedGrid,
        gameType: state.gameType,
        gameId: state.gameId
      }
    },
    setGameState: (state, action: PayloadAction<DimentionalType>) => {
      if (state.gameType === "online") {
        return {
          currentTurn: state.currentTurn,
          date: new Date().toISOString(),
          gameOver: state.gameOver,
          data: action.payload,
          selectedGrid: state.selectedGrid,
          gameType: state.gameType,
          gameId: state.gameId,
          users: state.users,
          userWon: state.userWon,
          joinRule: state.joinRule,
          invitations: state.invitations,
          owner: state.owner
        }
      }
      return {
        currentTurn: state.currentTurn,
        date: new Date().toISOString(),
        gameOver: state.gameOver,
        data: action.payload,
        selectedGrid: state.selectedGrid,
        gameType: state.gameType,
        gameId: state.gameId,
        users: undefined
      }
    },
    setGameOver: (state, action: PayloadAction<gridStateMode>) => {
      if (state.gameType === "online") {
        return {
          currentTurn: state.currentTurn,
          date: new Date().toISOString(),
          gameOver: action.payload,
          data: state.data,
          selectedGrid: state.selectedGrid,
          gameType: state.gameType,
          gameId: state.gameId,
          users: state.users,
          joinRule: state.joinRule,
          userWon: state.userWon,
          invitations: state.invitations,
          owner: state.owner
        }
      }
      return {
        currentTurn: state.currentTurn,
        date: new Date().toISOString(),
        gameOver: action.payload,
        data: state.data,
        selectedGrid: state.selectedGrid,
        gameType: state.gameType,
        gameId: state.gameId,
        users: undefined
      }
    }
  }
})

export default gameSlice.reducer