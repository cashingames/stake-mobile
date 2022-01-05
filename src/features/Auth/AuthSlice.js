
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import {
    getIsLoggedInOnce,
    login as loginApi,
    verifyOtp as verifyOtpApi,
    verifyAccount as verifyAccountApi,
    resetPassword as resetPasswordApi,
    signInWithGoogle as googleSignIn,
    getData,
} from '../../utils/ApiHelper';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { isTrue } from '../../utils/stringUtl';

export const registerUser = async (data) => {
    return axios.post('auth/register', data);
}

export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (data, thunkAPI) => {
        const response = await loginApi(data);
        return response.data
    }
)

export const loginWithGoogle = async (data) => {
    return axios.post("/auth/google/login", data);
}

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
        return AsyncStorage.getItem("used");
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
        const response = await axios.post('v2/profile/me/password/change', data)
        return response.data
    }
)

export const editPersonalDetails = createAsyncThunk(
    'auth/user/editPersonalDetails',
    async (data, thunkAPI) => {
        const response = await axios.post('v2/profile/me/edit-personal', data)
        return response.data
    }
)
export const editBankDetails = createAsyncThunk(
    'auth/user/editBankDetails',
    async (data, thunkAPI) => {
        const response = await axios.post('v2/profile/me/edit-bank', data)
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
                state.showIntro = !isTrue(action.payload);
            })
            .addCase(verifyAccount.fulfilled, (state, action) => {
                state.passwordReset.code = action.payload.data;
                state.passwordReset.email = action.meta.arg.email;
            })
    },
});

export const { setToken, setUser, showLogin, setUserPasswordResetToken, saveCreatedUserCredentials } = AuthSlice.actions

export default AuthSlice.reducer