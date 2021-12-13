import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './features/Auth/AuthSlice'
import CommonSlice from './features/CommonSlice'
import StoreSlice from './features/Store/StoreSlice'

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        store: StoreSlice,
        common: CommonSlice
    },
})

export default store