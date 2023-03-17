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

function getAllIndexes(arr, val) {
    var indexes = [], i;
    for (i = 0; i < arr.length; i++)
        if (arr[i] === val)
            indexes.push(i);
    return indexes;
}

export const startGame = createAsyncThunk(
    'game/startGame',
    async (data, thunkAPI) => {
        try {
            const response = await axios.post('v2/game/start/single-player', data);
            console.log(data.staking_amount, 'stake amount');
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const startChallengeGame = createAsyncThunk(
    'game/startChallengeGame',
    async (data, thunkAPI) => {
        const response = await axios.post('v3/challenge/start/game', data)
        return response.data
    }

)

export const challengeEndGame = createAsyncThunk(
    'game/challengeEndGame',
    async (data, thunkAPI) => {
        const response = await axios.post('v3/challenge/end/game', data)
        return response.data
    }
)

export const endGame = createAsyncThunk(
    'game/endGame',
    async (data, thunkAPI) => {
        //log if question_count exist more than once in the array
        data.chosenOptions.forEach(x => {
            // console.log("loggind submitted question id", x.question_id);
        });

        //make a network request to the server
        const response = await axios.post('v2/game/end/single-player', data)
        console.log(response)
        return response.data;
    }
)
export const getLiveTriviaLeaders = createAsyncThunk(
    'game/getTriviaData',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.get(`v3/live-trivia/${data}/leaderboard`);
        return response.data;
    }
)
export const challengeTopLeaders = createAsyncThunk(
    'game/challengeTopLeaders',
    async (data, sthunkAPI) => {
        //make a network request to the server
        const response = await axios.post('v3/challenge/leaders/global');
        // console.log(response.data, 'this is response')
        return response.data;
    }
)

export const sendFriendInvite = createAsyncThunk(
    'game/sendFriendInvite',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.post('v3/challenge/send-invite', data)
        return response.data;
    }
)

export const getChallengeDetails = createAsyncThunk(
    'game/getChallengeDetails',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.get(`v3/challenge/${data}/details`)
        return response.data;
    }
)

export const acceptDeclineChallengeInivite = createAsyncThunk(
    'game/acceptChallengeInivite ',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.post('v3/challenge/invite/respond', data)
        return response.data;
    }
)

export const getGameStakes = createAsyncThunk(
    'game/getGameStakes',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.get('v3/odds/standard', data)
        // console.log(response.data)
        return response.data;
    }
)


//This is to store the currently ongoing active game
let initialState = {
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
    amountWon: null,
    amountStaked: null,
    isEnded: true,
    displayedOptions: [],
    displayedQuestion: {},
    selectedFriend: null,
    isPlayingTrivia: false,
    triviaLeaders: [],
    challengeLeaders: [],
    triviaPosition: '',
    triviaCategory: '',
    triviaType: '',
    triviaMode: '',
    triviaId: '',
    hasPlayedTrivia: false,
    gameDuration: 60,
    challengeDetails: {},
    gameStakes: [],
    withStaking: false,
    endedWithoutStaking:null,
    correctCount: 0,
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
            // console.log("seeting")
            state.gameCategory = action.payload;
        },
        setGameMode: (state, action) => {
            // console.log("here")
            state.gameMode = action.payload;
        },
        setSelectedFriend: (state, action) => {
            // console.log("seeting")
            state.selectedFriend = action.payload;
        },
        unselectFriend: (state) => {
            state.selectedFriend = null;
        },
        // showStakingPopup: (state) => {
        //     state.endedWithoutStaking = true;
        // },
        setGameDuration: (state, action) => {
            state.gameDuration = action.payload;
        },
        setQuestionsCount: (state, action) => {
            state.totalQuestionCount = action.payload;
        },
        setPointsGained: (state, action) => {
            state.pointsGained = action.payload;
        },
        setAmountWon: (state, action) => {
            state.amountWon = action.payload;
        },
        setAmountStaked: (state, action) => {
            state.amountStaked = action.payload;
        },
        setWithStaking: (state, action) => {
            state.withStaking = action.payload;
        },
        setCorrectCount: (state, action) => {
            state.correctCount = action.payload;
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
            });

            //find if this question id exist in the chosenOption
            const existingIndex = state.chosenOptions.findIndex(x => x.question_id === action.payload.question_id);

            //if it exists, replace it
            if (existingIndex !== -1)
                state.chosenOptions[existingIndex] = action.payload;
            else
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
        // resetGameStats: (state) => {
        //     state.chosenOptions = [];
        //     state.pointsGained = 0;
        //     state.consumedBoosts = [];
        //     state.currentQuestionPosition = 0;
        //     state.isLastQuestion = false;
        //     state.totalQuestionCount = 10;
        //     state.gameDuration = 60;
        // }
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
                state.pointsGained = 0;
            })
            .addCase(endGame.fulfilled, (state, action) => {
                state.isEnded = true;
                state.pointsGained = action.payload.data.points_gained;
                state.amountWon = action.payload.data.amount_won;
                state.withStaking = action.payload.data.with_staking ?? false;
                state.amountStaked = action.payload.data.amount_staked;
                state.correctCount = action.payload.data.correct_count;
                resetState(state)
            })
            .addCase(getLiveTriviaLeaders.fulfilled, (state, action) => {
                state.triviaLeaders = action.payload;
            })
            .addCase(challengeTopLeaders.fulfilled, (state, action) => {
                state.challengeLeaders = action.payload;
            })
            .addCase(getChallengeDetails.fulfilled, (state, action) => {
                state.challengeDetails = action.payload;
                state.gameMode = {
                    name: action.payload.gameModeName,
                    id: action.payload.gameModeId,
                };
                state.gameCategory = {
                    id: action.payload.categoryId
                };
                state.gameType = {
                    id: 2
                }
            })
            .addCase(startChallengeGame.fulfilled, (state, action) => {
                state.questions = action.payload.data.questions;
                state.displayedQuestion = state.questions[state.currentQuestionPosition]
                state.displayedOptions = state.displayedQuestion.options
                state.gameSessionToken = action.payload.data.game.token
                state.isEnded = false
            })
            .addCase(challengeEndGame.fulfilled, (state, action) => {
                state.isEnded = true;
                state.pointsGained = action.payload.data.points_gained;
                resetState(state)
            })
            .addCase(getGameStakes.fulfilled, (state, action) => {
                state.gameStakes = action.payload.data;
            })
        // .addCase(canStake.rejected, (state, payload) => {
        //     console.log(state, payload)
        // })

    },
})

export const { setGameType, setGameMode, setGameCategory,
    setPointsGained, setAmountWon, setCorrectCount, setAmountStaked, questionAnswered, nextQuestion, setSelectedFriend,
    incrementCountdownResetIndex, consumeBoost, pauseGame, skipQuestion, boostReleased, bombOptions,
    setIsPlayingTrivia, setHasPlayedTrivia, setGameDuration, setQuestionsCount, unselectFriend, setWithStaking,showStakingPopup
} = GameSlice.actions


export default GameSlice.reducer


function resetState(state) {


    //Because we need it for replay
    // state.gameMode = {};
    // state.gameCategory = {};
    // state.gameType = {};

    state.gameSessionToken = '';
    state.questions = [];
    state.currentQuestionPosition = 0;
    state.totalQuestionCount = 10;
    state.isLastQuestion = false;
    state.countdownKey = 0;
    state.countdownFrozen = false;
    state.chosenOptions = [];
    state.consumedBoosts = [];
    state.activeBoost = [];
    state.displayedOptions = [];
    state.displayedQuestion = {};
    state.selectedFriend = null;
    state.isPlayingTrivia = false;
    state.triviaLeaders = [];
    state.triviaPosition = '';
    state.triviaCategory = '';
    state.triviaType = '';
    state.triviaMode = '';
    state.triviaId = '';
    state.hasPlayedTrivia = false;
    state.gameDuration = 60;
    state.challengeDetails = {};
    state.userChallenges = [];
    state.challengeScores = {};

    return state;
}