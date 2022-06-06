
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const getCommonData = createAsyncThunk(
    'common/get',
    async () => {
        console.log("fetching common data");
        const response = await axios.get('v3/game/common');
        return response.data
    }
)

export const getBankData = createAsyncThunk(
    'common/bank/get',
    async () => {
        const response = await axios.get('v2/wallet/banks')
        return response.data
    }
)



export const getGlobalLeaders = createAsyncThunk(
    'common/globalLeaders/get',
    async () => {
        console.log("getting global leaders")
        const response = await axios.post('v2/leaders/global');
        return response.data
    }
)

export const getGlobalLeadersByDate = createAsyncThunk(
    'common/globalLeadersByDate/get',
    async (data) => {
        const response = await axios.post('v2/leaders/global', data);
        return response.data
    }
)
export const getCategoryLeaders = createAsyncThunk(
    'common/categoryLeaders/get',
    async () => {
        const response = await axios.post('v2/leaders/categories');
        return response.data
    }
)

export const getCategoryLeadersByDate = createAsyncThunk(
    'common/categoryLeadersByDate/get',
    async (data) => {
        const response = await axios.post('v2/leaders/categories', data);
        return response.data
    }
)

export const fetchFaqAndAnswers = createAsyncThunk(
    'common/faq/get',
    async () => {
        const response = await axios.get('v2/faq/fetch');
        return response.data.data
    }
)

// export const fetchTrivia = createAsyncThunk(
//     'common/fetchTrivia',
//     async (data, thunkAPI) => {
//         //make a network request to the server
//         const response = await axios.get('v3/fetch/trivia', data)
//         console.log('trivia started');
//         return response.data;
//     }
// )


const initialState = {
    initialLoading: true,
    boosts: [],
    achievements: [],
    gameTypes: [],
    gameModes: [],
    gameCategories: [],
    plans: [],
    banks: [],
    categoryLeaders: [],
    globalLeaders: [],
    faqAndAnswers: [],
    trivia: [],
    minVersionCode: '',
    minVersionForce: false
}

export const CommonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        initialLoadingComplete: (state) => {
            state.initialLoading = false;
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
        builder
            .addCase(getCommonData.fulfilled, (state, action) => {
                var data = action.payload.data;
                state.boosts = data.boosts;
                state.achievements = data.achievements;
                state.plans = data.plans;
                state.gameTypes = data.gameTypes;
                state.gameModes = data.gameModes;
                state.gameCategories = data.gameCategories;
                state.minVersionCode = data.minVersionCode;
                state.minVersionForce = data.minVersionForce;
            })
            .addCase(getBankData.fulfilled, (state, action) => {
                state.banks = action.payload.data;
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
    },
});

export const { initialLoadingComplete } = CommonSlice.actions

export default CommonSlice.reducer