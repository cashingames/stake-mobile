import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import { useDispatch, useSelector } from 'react-redux';
import AuthSlice from './features/Auth/AuthSlice';
import CommonSlice from './features/CommonSlice';
import GameSlice from './features/Games/GameSlice';
import TriviaChallengeGameSlice from './features/Games/TriviaChallengeStaking/TriviaChallengeGameSlice';
import AchievementSlice from './features/Profile/AchievementSlice';
import StoreSlice from './features/Store/StoreSlice';
import { walletsApi } from './services/wallets-api';

export const store = configureStore({
    reducer: {
        auth: AuthSlice,
        store: StoreSlice,
        common: CommonSlice,
        game: GameSlice,
        achievementSlice: AchievementSlice,
        triviaChallenge: TriviaChallengeGameSlice,
        [walletsApi.reducerPath]: walletsApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(walletsApi.middleware),
})

export const useAppDispatch = () => useDispatch
export const useTypedSelector = () => useSelector
setupListeners(store.dispatch);