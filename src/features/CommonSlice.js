
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const getCommonData = createAsyncThunk(
    'common/get',
    async () => {
        // console.log("fetching common data");
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
        // console.log("getting global leaders")
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

export const logActionToServer = createAsyncThunk(
    'common/logActionToServer',
    async (data, thunkAPI) => {
        const response = await axios.post('v3/log/frontend-info', data)
        return response.data
    }
)

export const fetchRecentLiveTrivia = createAsyncThunk(
    'common/fetchRecentLiveTrivia',
    async (data, thunkAPI) => {
        const response = await axios.get('v3/live-trivia/recent', data)
        return response.data;
    }
)

export const fetchUserFriends = createAsyncThunk(
    'common/fetchUserFriends',
    async (thunkAPI) => {
        const response = await axios.get('v3/user/search/friends')
        return response.data;
    }
)

export const searchUserFriends = createAsyncThunk(
    'common/searchUserFriends',
    async (data, thunkAPI) => {
        const response = await axios.get(`v3/user/search/friends?search=${data}`)
        return response.data;
    }
)

export const fetchFeatureFlags = createAsyncThunk(
    'common/fetchFeatureFlags',
    async () => {
        const response = await axios.get(`v3/feature-flags`)
        return response.data;
    }
)


export const withdrawWinnings = async (data) => {
    console.log(data, 'dataaaaaa')
    return axios.post('v3/winnings/withdraw', data);

}

export const isFeatureEnabled = async(feature, features={}) => {

    return features.hasOwnProperty(feature) && features[feature].enabled === true
}

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
    trivias: [],
    minVersionCode: '',
    minVersionForce: false,
    userFriends: [],
    featureFlags: []
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
            .addCase(fetchRecentLiveTrivia.fulfilled, (state, action) => {
                state.trivias = action.payload
            })
            .addCase(fetchUserFriends.fulfilled, (state, action) => {
                state.userFriends = action.payload
            })
            .addCase(searchUserFriends.fulfilled, (state, action) => {
                state.userFriends = action.payload
            })
            .addCase(fetchFeatureFlags.fulfilled, (state, action) => {
                state.featureFlags = action.payload.data
            })
    },
});

export const { initialLoadingComplete } = CommonSlice.actions

export default CommonSlice.reducer