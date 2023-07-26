
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    boosts: [],
    achievements: [],
    plans: [],
}

export const buyBoost = createAsyncThunk(
    'store/wallet/buyBoost',
    async (data) => {
        const response =  await axios.post(`v3/boosts/${data.id}/buy`, data);
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