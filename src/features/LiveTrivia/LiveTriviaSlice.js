
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    data: null
}

export const getLiveTriviaStatus = createAsyncThunk(
    'liveTrivia/status',
    async () => {
        const response = await axios.get(`v3/live-trivia/status`)
        return response.data;
    }
)

export const LiveTriviaSlice = createSlice({
    name: 'liveTrivia',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getLiveTriviaStatus.fulfilled, (state, action) => {
                state.data = action.payload;
            })
    },
});

export const { } = LiveTriviaSlice.actions

export default LiveTriviaSlice.reducer