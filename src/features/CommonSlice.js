
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
        const response = await axios.get('v3/wallet/banks')
        return response.data
    }
)

export const fetchFaqAndAnswers = createAsyncThunk(
    'common/faq/get',
    async () => {
        const response = await axios.get('v3/faq/fetch');
        return response.data.data
    }
)

export const logActionToServer = createAsyncThunk(
    'common/logActionToServer',
    async (data) => {
        const response = await axios.post('v3/log/frontend-info', data)
        return response.data
    }
)

export const userNewTransactions = createAsyncThunk(
    'common/userNewTransactions',
    async (data, thunkAPI) => {
        const response = await axios.get(`v3/wallet/transactions/${data.walletType}?page=${data.pageNo}`)
        return response.data;
    }
)


export const getUserNotifications = createAsyncThunk(
    'common/getUserNotifications',
    async () => {
        const response = await axios.get('v3/notifications')
        return response.data;
    }
)

export const markNotificationRead = createAsyncThunk(
    'common/markNotificationRead',
    async (data) => {
        const response = await axios.post(`v3/notifications/read/${data}`, data)
        return response.data;
    }
)
export const sendUserFeedback = createAsyncThunk(
    'common/sendUserFeedback',
    async (data) => {
        const response = await axios.post('v3/client/feedback', data)
        return response.data;
    }
)

export const withdrawWinnings = async (data) => {
    return axios.post('v3/winnings/withdraw', data);
}

export const fetchUserTransactions = createAsyncThunk(
    'common/fetchUserTransactions',
    async (data, thunkAPI) => {
        const response = await axios.get(`v3/wallet/transactions/${data.wallet_type}?page=${data.pageNo}`)
        return response.data;
    }
)

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
    minVersionCode: '',
    minVersionForce: false,
    userChallenges: [],
    userNotifications: [],
    userTransactions: [],
    newTransactions:[],
    loadMoreTransactions: true,
    maximumExhibitionStakeAmount: 0,
    minimumExhibitionStakeAmount: 0,
    maximumChallengeStakeAmount: 0,
    minimumChallengeStakeAmount: 0,
    minimumWalletFundableAmount: 0,
    minimumWithdrawableAmount: 0,
    minimumBoostScore:0,
    periodBeforeChallengeStakingExpiry: '',
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
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getCommonData.fulfilled, (state, action) => {
                const data = action.payload.data;
                state.boosts = data.boosts;
                state.achievements = data.achievements;
                state.plans = data.plans;
                state.gameTypes = data.gameTypes;
                state.gameModes = [...data.gameModes, stakingGameMode];
                state.gameCategories = data.gameCategories;
                state.minVersionCode = data.minVersionCode;
                state.minVersionForce = data.minVersionForce;
                state.maximumExhibitionStakeAmount = data.maximumExhibitionStakeAmount;
                state.minimumExhibitionStakeAmount = data.minimumExhibitionStakeAmount;
                state.maximumChallengeStakeAmount = data.maximumChallengeStakeAmount;
                state.minimumChallengeStakeAmount = data.minimumChallengeStakeAmount;
                state.minimumWalletFundableAmount = data.minimumWalletFundableAmount;
                state.minimumWithdrawableAmount = data.minimumWithdrawableAmount;
                state.periodBeforeChallengeStakingExpiry = data.periodBeforeChallengeStakingExpiry;
                state.minimumBoostScore = data.minimumBoostScore;
            })
            .addCase(getBankData.fulfilled, (state, action) => {
                const banks = action.payload.data.map((bank, i)=> {
                     return {
                        key: i,
                        value: bank.name
                    }
                });
                state.banks = banks;
            })
            .addCase(fetchFaqAndAnswers.fulfilled, (state, action) => {
                state.faqAndAnswers = action.payload
            })
            .addCase(getUserNotifications.fulfilled, (state, action) => {
                state.userNotifications = action.payload.data.data;
            })
            .addCase(fetchUserTransactions.fulfilled, (state, action) => {
                state.userTransactions = action.payload;
            })
            .addCase(userNewTransactions.fulfilled, (state, action) => {
                // state.loadMoreTransactions = action.payload.length >= 10;
                // state.newTransactions = action.payload;
                state.newTransactions = state.newTransactions.concat(action.payload);
            })
    },
});

export const { initialLoadingComplete } = CommonSlice.actions

export default CommonSlice.reducer