
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getData, postData } from '../utils/ApiHelper'

export const getCommonData = createAsyncThunk(
    'common/get',
    async (thunkAPI) => {
        const response = await getData('v3/game/common')
        return response.data
    }
)

export const getBankData = createAsyncThunk(
        'common/bank/get',
        async (thunkAPI) => {
            const response = await getData('v2/wallet/banks')
            // console.log(response.data)
            return response.data
        }
    )
    


const initialState = {
    boosts: [],
    achievements: [],
    gameTypes: [],
    gameModes: [],
    banks: [],
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
                state.boosts = action.payload.boosts;
                state.achievements = action.payload.achievements;
                state.gameTypes = action.payload.gameTypes;
                state.gameModes = action.payload.gameModes;
            })
            .addCase(getBankData.fulfilled, (state, action) => {
                state.banks = action.payload;
            })
    },
});

export default CommonSlice.reducer