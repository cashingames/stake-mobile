import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './features/Auth/AuthSlice'
import StoreSlice from './features/Store/StoreSlice'

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        store: StoreSlice
    },
})

export default store