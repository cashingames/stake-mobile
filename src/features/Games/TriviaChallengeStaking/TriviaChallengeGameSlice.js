import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios'

export const startChallengeRequest = createAsyncThunk(
    'game/createRealTimeChallenge',
    async (data, _thunkAPI) => {
        const response = await axios.post('v3/challenges/create', data)
        return response.data
    }
)

export const startPracticeChallengeRequest = createAsyncThunk(
    'game/createPracticeChallenge',
    async (data, _thunkAPI) => {
        const response = await axios.post('v3/challenges/practice/create', data)
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
            consumed_boosts: state.consumedBoosts
        }
        const response = await axios.post('v3/challenges/submit', data);
        return response.data
    }
)

export const submitPracticeGameSession = createAsyncThunk(
    'game/submitPracticeGameSession',
    async (_data, { getState }) => {
        const state = getState().triviaChallenge;
        const data = {
            challenge_request_id: state.challengeDetails.challenge_request_id,
            selected_options: state.selectedOptions,
        }
        const response = await axios.post('v3/challenges/practice/submit', data);
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
    totalQuestions: 10,
    countdownFrozen: false,
    consumedBoosts: [],
    activeBoost: [],
    gameDuration: 60,
    countdownKey: 0,
    challengeDetails: {},
    isEnded: false,
}

export const TriviaChallengeStakeGameSlice = createSlice({
    name: 'triviaChallengeGame',
    initialState,
    reducers: {
        setChallengeDetails: (state, action) => {
            state.challengeDetails = action.payload;
            state.questions = state.challengeDetails.questions;
            // state.totalQuestions = state.questions.length;
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
        consumeBoost: (state, action) => {
            state.consumedBoosts = [...state.consumedBoosts,
            {
                boost: action.payload
            }];
            state.activeBoost = action.payload;
        },
        pauseGame: (state, action) => {
            state.countdownFrozen = action.payload
        },
        // bombOptions: (state) => {
        //     const correctOption = state.currentQuestion.options.find(option => option.is_correct === '1')
        //     const falseOptions = state.currentQuestion.options.filter(option => option.is_correct === '0')
        //     const randomWrongOption = falseOptions[Math.floor(Math.random() * falseOptions.length)];
        //     state.currentQuestion.options = shuffleArray([correctOption, randomWrongOption]);
        // },
        skipQuestion: (state) => {
            const q = state.questions.filter(x => x.id !== state.currentQuestion.id);
            state.questions = q,
                state.currentQuestion = state.questions[state.currentQuestionIndex]
            state.currentQuestion.options
        },
        boostReleased: (state) => {
            state.activeBoost = {}
        },
        setGameDuration: (state, action) => {
            state.gameDuration = action.payload;
        },
        incrementCountdownResetIndex: (state) => {
            state.countdownKey += 1;
        },
        clearSession: (state) => {
            state.questions = [];
            state.documentId = '';
            state.currentQuestion = {};
            state.selectedOptions = [];
            state.currentQuestionIndex = 0;
            state.countdownFrozen = false;
            state.consumedBoosts = [];
            state.activeBoost = [];
            state.challengeDetails = {};
            state.totalQuestions = 10
            state.isEnded = false;
        },
        setIsEnded: (state, action) => {
            state.isEnded = action.payload;
        }
    },

    extraReducers: (builder) => {
        builder
            .addCase(startChallengeRequest.fulfilled, (state, action) => {
                state.documentId = action.payload.data.challenge_request_id;
            })
            .addCase(startPracticeChallengeRequest.fulfilled, (state, action) => {
                state.documentId = action.payload.data.challenge_request_id;
            })
    },
})

export const { getNextQuestion, selectedOption, setGameDuration, pauseGame, incrementCountdownResetIndex, setChallengeDetails, clearSession, setIsEnded,
    consumeBoost, boostReleased, skipQuestion } = TriviaChallengeStakeGameSlice.actions

export default TriviaChallengeStakeGameSlice.reducer

