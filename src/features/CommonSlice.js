
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getData } from '../utils/ApiHelper'

export const getCommonData = createAsyncThunk(
    'common/get',
    async (thunkAPI) => {
        const response = await getData('v3/game/common')
        return response.data

    }
)

const initialState = {
    boosts: [],
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
                state.gameTypes = action.payload.gameTypes;
                console.log(state.boosts)
            })
    },
});

export default CommonSlice.reducer