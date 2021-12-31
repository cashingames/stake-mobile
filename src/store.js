import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './features/Auth/AuthSlice'
import CommonSlice from './features/CommonSlice'
import GameSlice from './features/Games/GameSlice'
import StoreSlice from './features/Store/StoreSlice'

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        store: StoreSlice,
        common: CommonSlice,
        game: GameSlice,
    },
})

export default store