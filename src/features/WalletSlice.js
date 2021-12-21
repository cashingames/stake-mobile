
// import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
// import { getData, postData } from '../utils/ApiHelper'

// export const getBankData = createAsyncThunk(
//     'wallet/bank/get',
//     async (thunkAPI) => {
//         const response = await getData('v2/wallet/banks')
//         return response.data
//     }
// )


// const initialState = {
//     banks: [],
// }

// export const WalletSlice = createSlice({
//     name: 'wallet',
//     initialState,
//     reducers: {

//     },
//     extraReducers: (builder) => {
//         // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
//         builder
//             .addCase(getBankData.fulfilled, (state, action) => {
//                 state.banks = action.payload.banks;
//             })
//     },
// });

// export default WalletSlice.reducer