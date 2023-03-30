import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const startChallengeRequest = createAsyncThunk(
    'game/createRealTimeChallenge',
    async (data, _thunkAPI) => {
        const response = await axios.post('v3/challenges/create', data)
        // console.log(response, 'this is the challenge data')
        return response.data
    }
)

export const submitGameSession = createAsyncThunk(
    'game/submitGameSession',
    async (thunkAPI) => {
        const state = thunkAPI.getState().triviaChallengeGame;

        // process selected options and send
        const data = {
            challenge_request_id: state.challengeDetails.challenge_request_id,
            selected_options: state.questions.reduce((filtered, question) => {
                const option = question.options.find(x => x.active);
                option && filtered.push({
                    question_id: option.question_id,
                    option_id: option.id
                })
                return filtered;
            })
        }

        const response = await axios.post('v3/challenges/submit', data)
        return response.data
    }
)

//This is to store the currently ongoing active game
let initialState = {
    questions: [],
    documentId: '',
    currentQuestion: {},
    currentQuestionIndex: 0,
    totalQuestions: 0,
    countdownFrozen: false,
    gameDuration: 60,
    countdownKey: 0,
    challengeDetails: {}
}

export const TriviaChallengeStakeGameSlice = createSlice({
    name: 'triviaChallengeGame',
    initialState,
    reducers: {
        setChallengeDetails: (state, action) => {
            state.challengeDetails = action.payload;
            state.questions = state.challengeDetails.questions;
            state.totalQuestions = state.questions.length;
            state.currentQuestion = state.questions[state.currentQuestionIndex];
        },
        getNextQuestion: (state) => {
            state.currentQuestionIndex += 1;
            state.currentQuestion = state.questions[state.currentQuestionIndex];
        },
        selectedOption: (state, action) => {
            state.currentQuestion.options.map(x => x.active = x.id === action.payload.id)
        },
        pauseGame: (state, action) => {
            state.countdownFrozen = action.payload
        },
        setGameDuration: (state, action) => {
            state.gameDuration = action.payload;
        },
        incrementCountdownResetIndex: (state) => {
            state.countdownKey += 1;
        },
    },

    extraReducers: (builder) => {
        builder

            .addCase(startChallengeRequest.fulfilled, (state, action) => {
                state.documentId = action.payload.data.challenge_request_id;
                // console.log(state.documentId, 'document id')
            })


    },
})

export const { getNextQuestion, selectedOption, setGameDuration, pauseGame, incrementCountdownResetIndex, setChallengeDetails } = TriviaChallengeStakeGameSlice.actions

export default TriviaChallengeStakeGameSlice.reducer
