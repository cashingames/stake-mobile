import { configureStore } from '@reduxjs/toolkit'
import AuthSlice from './features/Auth/AuthSlice'
import CommonSlice from './features/CommonSlice'
import GameSlice from './features/Games/GameSlice'
import TriviaChallengeGameSlice from './features/Games/TriviaChallengeStaking/TriviaChallengeGameSlice'
import AchievementSlice from './features/Profile/AchievementSlice'
import StoreSlice from './features/Store/StoreSlice'

const store = configureStore({
    reducer: {
        auth: AuthSlice,
        store: StoreSlice,
        common: CommonSlice,
        game: GameSlice,
        achievementSlice: AchievementSlice,
        triviaChallenge: TriviaChallengeGameSlice
    },
})

export default store