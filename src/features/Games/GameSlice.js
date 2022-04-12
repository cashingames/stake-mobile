import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

var base64 = require('base-64');

const shuffleArray = array => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    return array;
}

export const startGame = createAsyncThunk(
    'game/startGame',
    async (data, thunkAPI) => {
        // console.log(data)
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
        return response.data;
    }
)
export const getTriviaData = createAsyncThunk(
    'game/getTriviaData',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.get(`v3/trivia/leaders/${data}`);
        // console.log(response.data);
        // console.log(data, 'marttttttttttt');
        return response.data;
    }
)

export const sendFriendInvite = createAsyncThunk(
    'game/sendFriendInvite',
    async (data, thunkAPI) => {
        console.log('before invite');
        //make a network request to the server
        const response = await axios.post('v2/game/challenge/invite', data)
        console.log('invite sent');
        return response;
    }
)


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
    countdownFrozen: false,
    chosenOptions: [],
    consumedBoosts: [],
    activeBoost: [],
    pointsGained: 0,
    isEnded: true,
    displayedOptions: [],
    displayedQuestion: {},
    selectedFriend: '',
    isPlayingTrivia: false,
    triviaLeaders: [],
    triviaPosition: 0,
    triviaCategory: '',
    triviaType: '',
    triviaMode: '',
    triviaId: ''

}


export const GameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        setGameType: (state, action) => {
            state.gameType = action.payload;
            state.gameCategory = null;
        },
        setGameCategory: (state, action) => {
            console.log("seeting")
            state.gameCategory = action.payload;
        },
        setGameMode: (state, action) => {
            console.log("here")
            state.gameMode = action.payload;
        },
        setSelectedFriend: (state, action) => {
            console.log("main")
            state.selectedFriend = action.payload;
        },
        setPointsGained: (state, action) => {
            state.pointsGained = action.payload;
        },
        setIsPlayingTrivia: (state, action) => {
            state.isPlayingTrivia = action.payload;
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
        incrementCountdownResetIndex: (state) => {
            state.countdownKey += 1;
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
        skipQuestion: (state) => {
            const q = state.questions.filter(x => x.id !== state.displayedQuestion.id);
            state.questions = q,
                state.displayedQuestion = state.questions[state.currentQuestionPosition]
            state.displayedOptions = state.displayedQuestion.options
        },
        bombOptions: (state) => {
            const correctOption = state.displayedOptions.find(option => base64.decode(option.is_correct) === '1')
            const falseOptions = state.displayedOptions.filter(option => base64.decode(option.is_correct) === '0')
            const randomWrongOption = falseOptions[Math.floor(Math.random() * falseOptions.length)];
            state.displayedOptions = shuffleArray([correctOption, randomWrongOption]);
        },
        boostReleased: (state) => {
            state.activeBoost = {}
        },
        resetGameStats : (state) => {
            state.chosenOptions = [];
            state.pointsGained = 0;
            state.consumedBoosts = [];
            state.currentQuestionPosition = 0;
            state.isLastQuestion = false;
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
                state.isEnded = false
            })
            .addCase(endGame.fulfilled, (state, action) => {
                state.isEnded = true;
                state.pointsGained = action.payload.data.points_gained;
            })
            .addCase(getTriviaData.fulfilled, (state, action) => {
                state.triviaLeaders = action.payload.data.leaders;
                state.triviaPosition = action.payload.data.position;
            })

    },
})

export const { setGameType, setGameMode, setGameCategory,
    setPointsGained, questionAnswered, nextQuestion,
    incrementCountdownResetIndex, consumeBoost, pauseGame, skipQuestion, boostReleased, bombOptions,
    resetGameStats, setSelectedFriend, setIsPlayingTrivia,
 } = GameSlice.actions


export default GameSlice.reducer