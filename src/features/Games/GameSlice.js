
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    getGameBoosts as getGameBoostsApi,
    getData,
} from '../../utils/ApiHelper';


export const getGameBoosts = createAsyncThunk(
    'auth/getGameBoosts',
    async (data, thunkAPI) => {
        const response = await getGameBoostsApi(data);
        return response.data
    }
)

export const getUser = createAsyncThunk(
    'auth/user/get',
    async (data, thunkAPI) => {
        const response = await getData('v3/user/profile');
        return response.data
    }
)

const initialState = {
    token: "",
    showIntro: false,
    user: {},
}

export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.user = action.payload.user;
        },
        setToken: (state, action) => {
            state.token = action.payload;
            state.showIntro = false;
        },
        showLogin: (state) => {
            state.showIntro = false;
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                // Add user to the state array
                state.token = action.payload;
            })
            .addCase(getUser.fulfilled, (state, action) => {
                // Add user to the state array
                state.user = action.payload;
            })
            .addCase(isLoggedIn.fulfilled, (state, action) => {
                // Add user to the state array
                state.token = action.payload;
            })
            .addCase(shouldShowIntro.fulfilled, (state, action) => {
                // Add user to the state array
                state.showIntro = !action.payload;
            })
    },
});

export const { setToken, setUser, showLogin } = AuthSlice.actions

export default AuthSlice.reducer