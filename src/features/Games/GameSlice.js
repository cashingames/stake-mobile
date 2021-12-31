import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'


const initialState = {
    gameMode: 1,
    gameCategoryId: 102,
    gameType: 1,
   
}

export const GameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {

    },
})
export default GameSlice.reducer