
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getData, postData } from '../utils/ApiHelper'

export const getCommonData = createAsyncThunk(
    'common/get',
    async (thunkAPI) => {
        const response = await getData('v3/game/common')
        return response.data
    }
)

export const getAchievements = createAsyncThunk(
    'common/achievements/get',
    async (thunkAPI) => {
        const response = await getData('v2/achievements')
        return response.data
    }
)

const initialState = {
    boosts: [],
    achievements: [],
    gameTypes: [],
}

export const CommonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
        builder
            .addCase(getCommonData.fulfilled, (state, action) => {
                console.log("logging general boosts")
                state.boosts = action.payload.boosts;
                state.achievements = action.payload.achievements;
                state.gameTypes = action.payload.gameTypes;
                console.log( JSON.stringify(state.boosts) + 'then' + JSON.stringify(state.achievements))
                console.log(state.achievements)
            })
    },
});

export default CommonSlice.reducer