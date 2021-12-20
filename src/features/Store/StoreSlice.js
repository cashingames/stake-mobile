
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';
import { postData } from '../../utils/ApiHelper';

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
        // }).catch( err => {
        //     console.log("error");
        //     console.log(err.toJSON());
        // })
        return response.data;
    }
)

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