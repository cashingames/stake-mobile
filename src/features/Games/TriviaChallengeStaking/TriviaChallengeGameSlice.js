import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
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
    async (_data, { getState }) => {
        const state = getState().triviaChallenge;
        const data = {
            challenge_request_id: state.challengeDetails.challenge_request_id,
            selected_options: state.selectedOptions,
        }
        const response = await axios.post('v3/challenges/submit', data);
        return response.data
    }
)

//This is to store the currently ongoing active game
let initialState = {
    questions: [],
    documentId: '',
    currentQuestion: {},
    selectedOptions: [],
    currentQuestionIndex: 0,
    totalQuestions: 0,
    countdownFrozen: false,
    gameDuration: 300,
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
            const data = {
                question_id: state.currentQuestion.id,
                option_id: action.payload.id
            }
            const currentIndex = state.selectedOptions.findIndex(x => x.question_id === state.currentQuestion.id);
            if (currentIndex === -1) {
                state.selectedOptions.push(data);
            } else {
                state.selectedOptions[currentIndex] = data;
            }
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
