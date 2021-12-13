
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    boosts: [],
    achievements: [],
    plans: [],
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