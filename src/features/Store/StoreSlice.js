
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    getCommonData,
} from '../../utils/ApiHelper';


export const getStoreData = createAsyncThunk(
    'store/get',
    async ( thunkAPI) => {
        const response = await getCommonData();
        return response.data

    }
)


const initialState = {
    boosts: [],
    achievements: [],
    plans: [],
}

export const StoreSlice = createSlice({
    name: 'store',
    initialState,
    reducers: {
        fetchBoosts: (state, action) => {
            state.boosts = action.payload;
        },
        fetchAchievements: (state, action) => {
            state.achievements = action.payload.achievements;
        },
        fetchPlans: (state, action) => {
            state.plans = action.payload.plans;
        },
    },
});

export const { fetchBoosts, fetchAchievements, fetchPlans } = StoreSlice.actions

export default StoreSlice.reducer