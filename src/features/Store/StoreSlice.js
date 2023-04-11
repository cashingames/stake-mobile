
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    boosts: [],
    achievements: [],
    plans: [],
}



export const buyBoostFromWallet = createAsyncThunk(
    'store/wallet/purchaseBoost',
    async (boostId, thunkAPI) => {
        const response = await axios.post(`v2/wallet/buy-boosts/${boostId}`)
        // .then(value => {
        //     console.log("success")
        //     console.log(value);
        // }).catch(err => {
        //     console.log("error");
        //     console.log(err.toJSON());
        // })
        return response.data;
    }
)

export const buyPlanFromWallet = createAsyncThunk(
    'store/wallet/purchaseGamePlan',
    async (planId, thunkAPI) => {
        const response = await axios.post(`v2/plan/subscribe/${planId}`)
        return response.data;
    }
)

export const buyItemFromStore = createAsyncThunk(
    'store/inapp/buyItemFromStore',
    async (payload, thunkAPI) => {
        const response = await axios.post(`v3/purchased/item`, payload)
        return response.data;
    }
)

export const buyItemFromStoreRaw = async (payload) => {
    const response = await axios.post(`v3/purchased/item`, payload)
    return response.data;
}

export const StoreSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        fetchAchievements: (state, action) => {
            state.achievements = action.payload.achievements;
        },
        fetchPlans: (state, action) => {
            state.plans = action.payload.plans;
        },
    }
});

export const { fetchAchievements, fetchPlans } = StoreSlice.actions

export default StoreSlice.reducer