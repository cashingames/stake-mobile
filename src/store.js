import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './features/Auth/AuthSlice'
import CommonSlice from './features/CommonSlice'
import GameSlice from './features/Games/GameSlice'
import AchievementSlice from './features/Profile/AchievementSlice'
import StoreSlice from './features/Store/StoreSlice'

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        store: StoreSlice,
        common: CommonSlice,
        game: GameSlice,
        achievementSlice: AchievementSlice
    },
})

export default store