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

export const endGame = createAsyncThunk(
    'game/endGame',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.post('v2/game/end/single-player', data)
        console.log('game ended');
        return response.data

        //return true;
    }
)

// export const resetGame = createAsyncThunk(
//     'game/reset',
//     async (thunkAPI) => {
//         return initialState;
//     }
// )


//This is to store the currently ongoing active game
const initialState = {
    gameMode: {},
    gameCategory: {},
    gameType: {},
    gameSessionToken: '',
    questions: [],
    currentQuestionPosition: 0,
    totalQuestionCount: 10,
    isLastQuestion: false,
    countdownKey: 0,
    chosenOptions: [],
    consumedBoosts: [],
    pointsGained: 0,
    isEnded: true,
    displayedOptions: [],
    displayedQuestion: {}
}


export const GameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameMode: (state, action) => {
            state.gameMode = action.payload;
        },
        setGameType: (state, action) => {
            state.gameType = action.payload;
        },
        setGameCategory: (state, action) => {
            state.gameCategory = action.payload;
        },
        setPointsGained: (state, action) => {
            state.pointsGained = action.payload;
        },
        questionAnswered: (state, action) => {
            state.displayedOptions.map(x => {
                x.isSelected = x.id === action.payload.id
                return x;
            })
            state.chosenOptions.push(action.payload)
        },
        nextQuestion: (state) => {
            state.currentQuestionPosition += 1;
            state.displayedQuestion = state.questions[state.currentQuestionPosition]
            state.displayedOptions = state.displayedQuestion.options
            state.isLastQuestion = state.currentQuestionPosition === state.totalQuestionCount - 1
        },
        startGameReplay: (state) => {
            state.countdownKey += 1;
            state.pointsGained = 0;
        }
    },

    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
        builder
            .addCase(startGame.fulfilled, (state, action) => {
                state.questions = action.payload.data.questions;
                state.displayedQuestion = state.questions[state.currentQuestionPosition]
                state.displayedOptions = state.displayedQuestion.options
                state.gameSessionToken = action.payload.data.game.token
                state.pointsGained = 0
            })
            .addCase(endGame.fulfilled, (state, action) => {
                state.isEnded = true;
                state.pointsGained = action.payload.data.points_gained;
                state.currentQuestionPosition = 0;
                state.isLastQuestion = false;
            })

    },
})

export const { setGameType, setGameMode, setGameCategory, setPointsGained, questionAnswered, nextQuestion,startGameReplay } = GameSlice.actions

export default GameSlice.reducer