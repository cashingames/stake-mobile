import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    all: [],
    mine: [],
}


export const getAchievements = createAsyncThunk(
    'achievements/get',
    async () => {
        const response = await axios.get(`v3/achievement-badges`)
        return response.data;
    }
)

export const AchievementSlice = createSlice({
    name: 'achievements',
    initialState,
    reducers: {
    },
    extraReducers: (builder) => {
        builder
            .addCase(getAchievements.fulfilled, (state, action) => {
                // console.log(Object.keys(action.payload.data), "action.payload")
                state.all = action?.payload?.data?.allAchievementBadges|| action?.payload?.allAchievementBadges || [];
                state.mine = action?.payload?.data?.myAchievementBadges|| action?.payload?.myAchievementBadges || [];
            })
    },
});

export const { } = AchievementSlice.actions

export default AchievementSlice.reducer