
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

export const getCommonData = createAsyncThunk(
    'common/get',
    async () => {
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
        const response = await axios.get(`v3/live-trivia/recent?page=${data}`)
        return response.data;
    }
)

export const fetchUserTransactions = createAsyncThunk(
    'common/fetchUserTransactions',
    async (data, thunkAPI) => {
        const response = await axios.get(`v2/wallet/me/transactions?page=${data}`)
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

export const getUserChallenges = createAsyncThunk(
    'common/getUserChallenges  ',
    async (data, thunkAPI) => {
        const response = await axios.get(`v3/user/challenges?page=${data}`)
        return response.data;
    }
)

export const getUserNotifications = createAsyncThunk(
    'common/getUserNotifications',
    async (data, thunkAPI) => {
        const response = await axios.get('v3/notifications')
        return response.data;
    }
)

export const markNotificationRead = createAsyncThunk(
    'common/markNotificationRead',
    async (data, thunkAPI) => {
        const response = await axios.post(`v3/notifications/read/${data}`, data)
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
    return axios.post('v3/winnings/withdraw', data);

}

export const isFeatureEnabled = async (feature, features = {}) => {

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
    globalLeadersbyDate: [],
    categoryLeadersbyDate: [],
    faqAndAnswers: [],
    trivias: [],
    minVersionCode: '',
    minVersionForce: false,
    userFriends: [],
    userChallenges: [],
    userNotifications: [],
    featureFlags: [],
    userTransactions: [],
    loadMoreTransactions: true,
    loadMoreChallenges: true,
    loadMoreLiveTrivias: true,
    maximumExhibitionStakeAmount: '',
    minimumExhibitionStakeAmount: '',
    maximumChallengeStakeAmount: '',
    minimumChallengeStakeAmount: '',
    minimumWalletFundableAmount: '',
    periodBeforeChallengeStakingExpiry: ''
}

const stakingGameMode =
{
    "icon": "icons/money-bag.png",
    "bgColor": "#EF2F55",
    "description": "Bet on your knowledge",
    "displayName": "Staking",
    "id": 1,
    "name": "STAKING",
};

export const CommonSlice = createSlice({
    name: 'common',
    initialState,
    reducers: {
        initialLoadingComplete: (state) => {
            state.initialLoading = false;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCommonData.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.boosts = data.boosts;
                state.achievements = data.achievements;
                state.plans = data.plans;
                state.gameTypes = data.gameTypes;
                state.gameModes = [stakingGameMode, ...data.gameModes];
                state.gameCategories = data.gameCategories;
                state.minVersionCode = data.minVersionCode;
                state.minVersionForce = data.minVersionForce;
                state.maximumExhibitionStakeAmount = data.maximumExhibitionStakeAmount;
                state.minimumExhibitionStakeAmount = data.minimumExhibitionStakeAmount;
                state.maximumChallengeStakeAmount = data.maximumChallengeStakeAmount;
                state.minimumChallengeStakeAmount = data.minimumChallengeStakeAmount;
                state.minimumWalletFundableAmount = data.minimumWalletFundableAmount;
                state.periodBeforeChallengeStakingExpiry = data.periodBeforeChallengeStakingExpiry
            })
            .addCase(getBankData.fulfilled, (state, action) => {
                state.banks = action.payload.data;
            })
            .addCase(getGlobalLeaders.fulfilled, (state, action) => {
                state.globalLeaders = action.payload.data
            })
            .addCase(getGlobalLeadersByDate.fulfilled, (state, action) => {
                state.globalLeadersbyDate = action.payload.data
            })
            .addCase(getCategoryLeaders.fulfilled, (state, action) => {
                state.categoryLeaders = action.payload.data
            })
            .addCase(getCategoryLeadersByDate.fulfilled, (state, action) => {
                state.categoryLeadersbyDate = action.payload.data
            })
            .addCase(fetchFaqAndAnswers.fulfilled, (state, action) => {
                state.faqAndAnswers = action.payload
            })
            .addCase(fetchRecentLiveTrivia.fulfilled, (state, action) => {
                state.loadMoreLiveTrivias = action.payload.length >= 10;
                state.trivias = state.trivias.concat(action.payload);
            })
            .addCase(fetchUserFriends.fulfilled, (state, action) => {
                state.userFriends = action.payload
            })
            .addCase(searchUserFriends.fulfilled, (state, action) => {
                state.userFriends = action.payload
            })
            .addCase(getUserChallenges.fulfilled, (state, action) => {
                state.loadMoreChallenges = action.payload.length >= 10;
                state.userChallenges = state.userChallenges.concat(action.payload);
            })
            .addCase(getUserNotifications.fulfilled, (state, action) => {
                state.userNotifications = action.payload.data.data;
            })
            .addCase(fetchUserTransactions.fulfilled, (state, action) => {
                state.loadMoreTransactions = action.payload.length >= 10;
                state.userTransactions = state.userTransactions.concat(action.payload);
            })
            .addCase(fetchFeatureFlags.fulfilled, (state, action) => {
                state.featureFlags = action.payload.data
            })
    },
});

export const { initialLoadingComplete } = CommonSlice.actions

export default CommonSlice.reducer