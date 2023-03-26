import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const startChallengeRequest = createAsyncThunk(
    'game/createRealTimeChallenge',
    async (data, thunkAPI) => {
        console.log(data, 'this is the challenge data')
        const response = await axios.post('v3/challenges/create', data)
        return response.data
    }
)

//This is to store the currently ongoing active game
let initialState = {
    questions: [],
    documentId: ''
}

export const TriviaChallengeStakeGameSlice = createSlice({
    name: 'triviaChallengeGame',
    initialState,
    reducers: {
        setQuestions: (state, action) => {
            state.questions = action.payload;
        },
    },

    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
        builder

            .addCase(startChallengeRequest.fulfilled, (state, action) => {
                state.documentId = action.payload.data.challengeRequestId;
            })


    },
})

export const { setQuestions } = TriviaChallengeStakeGameSlice.actions


export default TriviaChallengeStakeGameSlice.reducer
