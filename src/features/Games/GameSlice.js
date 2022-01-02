import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const startGame = createAsyncThunk(
    'game/startGame',
    async (data, thunkAPI) => {
        console.log(data)
        const response = await axios.post('v2/game/start/single-player', data)
        return response.data
    }
)


//This is to store the currently ongoing active game
const initialState = {
    gameMode: {},
    gameCategory: {},
    gameType: {},
    questions: [],

}

export const GameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        // setGameParameters: (state, action) => {
        //     state.gameMode = action.payload.gameMode;
        //     state.gameCategory = action.payload.gameCategory;
        //     state.gameType = action.payload.gameType;
        // },
        setGameMode: (state, action) => {
            state.gameMode = action.payload;
        },
        setGameType: (state, action) => {
            console.log("setting game type", action.payload)
            state.gameType = action.payload;
        },
        setGameCategory: (state, action) => {
            state.gameCategory = action.payload;
        },
    },

    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
        builder
            .addCase(startGame.fulfilled, (state, action) => {
                state.questions = action.payload.data.questions;
            })

    },
})

export const { setGameType, setGameMode, setGameCategory } = GameSlice.actions

export default GameSlice.reducer