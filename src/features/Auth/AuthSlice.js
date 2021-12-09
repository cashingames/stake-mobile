
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    getIsLoggedInOnce,
    login as loginApi,
    register as registerApi,
    verifyOtp as verifyOtpApi,
    verifyAccount as verifyAccountApi,
    getGameBoosts as getGameBoostsApi,
    getData,
} from '../../utils/ApiHelper';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (data, thunkAPI) => {
        const response = await registerApi(data);
        return response.data
        
    }
)

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (data, thunkAPI) => {
        const response = await loginApi(data);
        return response.data
    }
)

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (data, thunkAPI) => {
        await AsyncStorage.removeItem("token");
        return true;
    }
)

export const isLoggedIn = createAsyncThunk(
    'auth/isLoggedIn',
    async (thunkAPI) => {
        return AsyncStorage.getItem("token");
    }
)

export const shouldShowIntro = createAsyncThunk(
    'auth/shouldShowIntro',
    async (thunkAPI) => {
        return getIsLoggedInOnce();
    }
)

export const verifyAccount = createAsyncThunk(
    'auth/verifyAccount',
    async (data, thunkAPI) => {
        const response = await verifyAccountApi(data);
        return response.data
    }
)

export const getGameBoosts = createAsyncThunk(
    'auth/getGameBoosts',
    async (data, thunkAPI) => {
        const response = await getGameBoostsApi(data);
        return response.data
    }
)

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (data, thunkAPI) => {
        const response = await verifyOtpApi(data);
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
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = "";
                state.showIntro = false;
                state.user = {};
                state.passwordReset = {};
                state.createAccount = {};
            })
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