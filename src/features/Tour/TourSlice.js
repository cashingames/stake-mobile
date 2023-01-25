
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios';

const initialState = {
    isTourActive: false,
}

export const TourSlice = createSlice({
    name: 'tour',
    initialState,
    reducers: {
        toggleAppTour: (state, payload) => {
            state.isTourActive = payload;
        },
        clearTour: (state, payload) => {
            state.isTourActive = false;
        },
    },
});

export const { toggleAppTour, clearTour } = TourSlice.actions

export default TourSlice.reducer