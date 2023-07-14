
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    boosts: [],
    achievements: [],
    plans: [],
}



export const buyBoostFromWallet = createAsyncThunk(
    'store/wallet/purchaseBoost',
    async (boostId, data, thunkAPI) => {
        const response = await axios.post(`v3/wallet/buy-boosts/${boostId}`, data)
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


export const StoreSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        fetchAchievements: (state, action) => {
            state.achievements = action.payload.achievements;
        },
    }
});

export const { fetchAchievements } = StoreSlice.actions

export default StoreSlice.reducer