
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getData } from '../utils/ApiHelper'
import axios from 'axios';

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



export const getGlobalLeaders = createAsyncThunk(
    'common/globalLeaders/get',
    async (thunkAPI) => {
        const response = await axios.get('v2/leaders/global');
        return response.data
    }
)

export const fetchFaqAndAnswers = createAsyncThunk(
    'common/faq/get',
    async (thunkAPI) => {
        const response = await getData('v2/faq/fetch');
        return response.data
    }
)


const initialState = {
    boosts: [],
    achievements: [],
    gameTypes: [],
    gameModes: [],
    plans: [],
    banks: [],
    globalLeaders: [],
    faqAndAnswers:[]
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
                state.plans = action.payload.plans;
                state.gameTypes = action.payload.gameTypes;
                state.gameModes = action.payload.gameModes;

            })
            .addCase(getBankData.fulfilled, (state, action) => {
                state.banks = action.payload;
            })
            .addCase(getGlobalLeaders.fulfilled, (state, action) => {
                state.globalLeaders = action.payload.data
            })
            .addCase(fetchFaqAndAnswers.fulfilled,(state, action) => {
                state.faqAndAnswers = action.payload
            })
    },
});

export default CommonSlice.reducer