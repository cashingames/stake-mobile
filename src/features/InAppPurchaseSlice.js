import { createSlice } from "@reduxjs/toolkit"

const initialState = {
    items:[]
}

export const InAppPurchases = createSlice({
    name: 'inAppPurchase',
    initialState,
    reducers:{
        setItems: (state, action) => {
            state.items = action.payload;
        }
    }
});

export const { setItems } = InAppPurchases.actions

export default InAppPurchases.reducer