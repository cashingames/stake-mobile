import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './features/Auth/AuthSlice'
import CommonSlice from './features/CommonSlice'
import StoreSlice from './features/Store/StoreSlice'
import WalletSlice from './features/WalletSlice'

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        store: StoreSlice,
        common: CommonSlice,
        wallet:WalletSlice,
    },
})

export default store