
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

export const getGlobalLeadersByDate = createAsyncThunk(
    'common/globalLeadersByDate/get',
    async (data, thunkAPI) => {
        const response = await axios.get(`v2/leaders/global/${data.startDate}/${data.endDate}`);
        console.log(response.data);
        return response.data
    }
)
export const getCategoryLeaders = createAsyncThunk(
    'common/categoryLeaders/get',
    async (thunkAPI) => {
        const response = await axios.get('v2/leaders/categories');
        return response.data
    }
)

export const getCategoryLeadersByDate = createAsyncThunk(
    'common/categoryLeadersByDate/get',
    async (data, thunkAPI) => {
        const response = await axios.get(`v2/leaders/categories/${data.startDate}/${data.endDate}`);
        console.log(response.data);
        return response.data
    }
)

export const fetchFaqAndAnswers = createAsyncThunk(
    'common/faq/get',
    async (thunkAPI) => {
        const response = await axios.get('v2/faq/fetch');
        return response.data.data
    }
)

export const fetchTrivia = createAsyncThunk(
    'common/fetchTrivia',
    async (data, thunkAPI) => {
        //make a network request to the server
        const response = await axios.get('v3/fetch/trivia', data)
        console.log('trivia started');
        return response.data;
    }
)


const initialState = {
    boosts: [],
    achievements: [],
    gameTypes: [],
    gameModes: [],
    gameCategories:[],
    plans: [],
    banks: [],
    categoryLeaders: [],
    globalLeaders: [],
    faqAndAnswers: [],
    hasLiveTrivia: false,
    trivia: []
}

export const CommonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        setGlobalLeadersByDate: (state, action) => {
            state.globalLeaders = action.payload.data;
        },
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
                state.gameCategories = action.payload.gameCategories;
                state.hasLiveTrivia= action.payload.hasLiveTrivia;

            })
            .addCase(getBankData.fulfilled, (state, action) => {
                state.banks = action.payload;
            })
            .addCase(getGlobalLeaders.fulfilled, (state, action) => {
                state.globalLeaders = action.payload.data
            })
            .addCase(getGlobalLeadersByDate.fulfilled, (state, action) => {
                state.globalLeaders = action.payload.data
            })
            .addCase(getCategoryLeaders.fulfilled, (state, action) => {
                state.categoryLeaders = action.payload.data
            })
            .addCase(getCategoryLeadersByDate.fulfilled, (state, action) => {
                state.categoryLeaders = action.payload.data
            })
            .addCase(fetchFaqAndAnswers.fulfilled, (state, action) => {
                state.faqAndAnswers = action.payload
            })
            .addCase(fetchTrivia.fulfilled, (state, action) => {
                state.trivia = action.payload.data;
            })
    },
});

export default CommonSlice.reducer