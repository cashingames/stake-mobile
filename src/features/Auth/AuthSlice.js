
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios, { Axios } from 'axios';
import {
    getIsLoggedInOnce,
    login as loginApi,
    register as registerApi,
    verifyOtp as verifyOtpApi,
    verifyAccount as verifyAccountApi,
    resetPassword as resetPasswordApi,
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
    async (data, { rejectWithValue }) => {
        try {
            return (await verifyAccountApi(data)).data;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (data, thunkAPI) => {
        const response = await verifyOtpApi(data);
        return response.data
    }
)

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data, { rejectWithValue }) => {
        console.log(data)
        try {
            return (await resetPasswordApi(data)).data;
        } catch (err) {
            return rejectWithValue(err.response.data)
        }
    }
)

export const changePassword = createAsyncThunk(
    'auth/user/changePassword',
    async (data, thunkAPI) => {
        console.log(data);
        const response = await axios.post('v2/profile/me/password/change', data)
        .catch(error=>{
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
              } else if (error.request) {
                // The request was made but no response was received
                // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
                // http.ClientRequest in node.js
                console.log(error.request);
              } else {
                // Something happened in setting up the request that triggered an Error
                console.log('Error', error.message);
              }
              console.log(error.config);
        });
        return response.data
    }
)

export const getUser = createAsyncThunk(
    'auth/user/get',
    async (thunkAPI) => {
        const response = await getData('v3/user/profile');
        return response.data
    }
)

const initialState = {
    token: "",
    showIntro: false,
    user: {},
    passwordReset: {
        email: 'oyekunmi@gmail.com'
    },
    createAccount: {}
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
        },
        setUserPasswordResetToken: (state, action) => {
            state.passwordReset.userCode = action.payload;
        },
        saveCreatedUserCredentials: (state, action) => {
            state.createAccount = action.payload
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
                state.token = action.payload;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.passwordReset = {};
            })
            .addCase(getUser.fulfilled, (state, action) => {
                // Add user to the state array
                state.user = action.payload;
            })
            .addCase(isLoggedIn.fulfilled, (state, action) => {
                state.token = action.payload;
            })
            .addCase(shouldShowIntro.fulfilled, (state, action) => {
                state.showIntro = !action.payload;
            })
            .addCase(verifyAccount.fulfilled, (state, action) => {
                state.passwordReset.code = action.payload.data;
                state.passwordReset.email = action.meta.arg.email;
            })
    },
});

export const { setToken, setUser, showLogin, setUserPasswordResetToken, saveCreatedUserCredentials } = AuthSlice.actions

export default AuthSlice.reducer