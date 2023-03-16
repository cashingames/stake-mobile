import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './features/Auth/AuthSlice'
import CommonSlice from './features/CommonSlice'
import GameSlice from './features/Games/GameSlice'
import InAppPurchaseSlice from './features/InAppPurchaseSlice'
import LiveTriviaSlice from './features/LiveTrivia/LiveTriviaSlice'
import AchievementSlice from './features/Profile/AchievementSlice'
import StoreSlice from './features/Store/StoreSlice'
import TourSlice from './features/Tour/TourSlice'

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        store: StoreSlice,
        common: CommonSlice,
        game: GameSlice,
        liveTrivia: LiveTriviaSlice,
        tourSlice: TourSlice,
        achievementSlice: AchievementSlice,
        inAppPurchase: InAppPurchaseSlice
    },
})

export default store