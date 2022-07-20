import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'
import { Base64 } from 'js-base64';

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

export const startChallengeGame = createAsyncThunk(
    'game/startChallengeGame',
    async (data, thunkAPI) => {
        // console.log(data)
        const response = await axios.post('v3/challenge/start/game', data)
        console.log('challenge started');
        return response.data
    }
)

export const challengeEndGame = createAsyncThunk(
    'game/challengeEndGame',
    async (data, thunkAPI) => {
        // console.log(data)
        const response = await axios.post('v3/challenge/end/game', data)
        console.log('challenge ended');
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
export const getLiveTriviaLeaders = createAsyncThunk(
    'game/getTriviaData',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.get(`v3/live-trivia/${data}/leaderboard`);
        // console.log(response.data);
        return response.data;
    }
)

export const sendFriendInvite = createAsyncThunk(
    'game/sendFriendInvite',
    async (data, thunkAPI) => {
        console.log('before invite');
        //make a network request to the server
        const response = await axios.post('v3/challenge/send-invite', data)
        console.log('invite sent');
        return response.data;
    }
)

export const getChallengeDetails = createAsyncThunk(
    'game/getChallengeDetails',
    async (data, thunkAPI) => {
        console.log('before details');
        //make a network request to the server
        const response = await axios.get(`v3/challenge/${data}/details`)
        console.log(response.data);
        return response.data;
    }
)

export const acceptDeclineChallengeInivite = createAsyncThunk(
    'game/acceptChallengeInivite ',
    async (data, thunkAPI) => {
        console.log('accept');
        //make a network request to the server
        const response = await axios.post('v3/challenge/invite/respond', data)
        console.log(response.data);
        return response.data;
    }
)

export const getUserChallenges = createAsyncThunk(
    'game/getUserChallenges  ',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.get('v3/user/challenges', data)
        return response.data;
    }
)

export const getChallengeScores = createAsyncThunk(
    'game/getChallengeScores',
    async (data, thunkAPI) => {
        //make a network request to the server
        console.log('getting challenge score');
        const response = await axios.get(`v3/challenge/${data}/leaderboard`);
        console.log(response.data);
        return response.data;
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
    selectedFriend: null,
    isPlayingTrivia: false,
    triviaLeaders: [],
    triviaPosition: '',
    triviaCategory: '',
    triviaType: '',
    triviaMode: '',
    triviaId: '',
    hasPlayedTrivia: false,
    gameDuration: 60,
    challengeDetails: {},
    userChallenges: [],
    challengeScores: {}
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
            console.log("seeting")
            state.selectedFriend = action.payload;
        },
        unselectFriend: (state) => {
            state.selectedFriend = null;
        },
        setGameDuration: (state, action) => {
            state.gameDuration = action.payload;
        },
        setQuestionsCount: (state, action) => {
            state.totalQuestionCount = action.payload;
        },
        setPointsGained: (state, action) => {
            state.pointsGained = action.payload;
        },
        setIsPlayingTrivia: (state, action) => {
            state.isPlayingTrivia = action.payload;
        },
        setHasPlayedTrivia: (state, action) => {
            state.hasPlayedTrivia = action.payload;
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
            const correctOption = state.displayedOptions.find(option => Base64.decode(option.is_correct) === '1')
            const falseOptions = state.displayedOptions.filter(option => Base64.decode(option.is_correct) === '0')
            const randomWrongOption = falseOptions[Math.floor(Math.random() * falseOptions.length)];
            state.displayedOptions = shuffleArray([correctOption, randomWrongOption]);
        },
        boostReleased: (state) => {
            state.activeBoost = {}
        },
        resetGameStats: (state) => {
            state.chosenOptions = [];
            state.pointsGained = 0;
            state.consumedBoosts = [];
            state.currentQuestionPosition = 0;
            state.isLastQuestion = false;
            state.totalQuestionCount = 10;
            state.gameDuration = 60;
        }
    },

    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
        builder
            .addCase(startGame.fulfilled, (state, action) => {
                console.log(action);
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
            .addCase(getLiveTriviaLeaders.fulfilled, (state, action) => {
                state.triviaLeaders = action.payload;
            })
            .addCase(getChallengeDetails.fulfilled, (state, action) => {
                state.challengeDetails = action.payload;
            })
            .addCase(startChallengeGame.fulfilled, (state, action) => {
                console.log(action);
                state.questions = action.payload.data.questions;
                state.displayedQuestion = state.questions[state.currentQuestionPosition]
                state.displayedOptions = state.displayedQuestion.options
                state.gameSessionToken = action.payload.data.game.token
                state.isEnded = false
            })
            .addCase(challengeEndGame.fulfilled, (state, action) => {
                state.isEnded = true;
                state.pointsGained = action.payload.data.points_gained;
            })
            .addCase(getUserChallenges.fulfilled, (state, action) => {
                state.userChallenges = action.payload;
            })

            .addCase(getChallengeScores.fulfilled, (state, action) => {
                state.challengeScores = action.payload;
            })


    },
})

export const { setGameType, setGameMode, setGameCategory,
    setPointsGained, questionAnswered, nextQuestion, setSelectedFriend,
    incrementCountdownResetIndex, consumeBoost, pauseGame, skipQuestion, boostReleased, bombOptions,
    resetGameStats, setIsPlayingTrivia, setHasPlayedTrivia, setGameDuration, setQuestionsCount, unselectFriend
} = GameSlice.actions


export default GameSlice.reducer