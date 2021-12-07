
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import {
    getIsLoggedIn,
    getIsLoggedInOnce,
    login as loginApi,
    register as registerApi,
    verifyOtp as verifyOtpApi,
    verifyAccount as verifyAccountApi,
    resetPassword as resetPasswordApi,
} from '../../utils/ApiHelper';

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

export const isLoggedIn = createAsyncThunk(
    'auth/isLoggedIn',
    async (thunkAPI) => {
        return getIsLoggedIn();
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

const initialState = {
    token: "",
    showIntro: false,
    user: {},
    passwordReset: {
        email: 'oyekunmi@gmail.com'
    }
}

export const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state) => {
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
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                state.token = action.payload;
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.passwordReset = {};
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

export const { setToken, setUser, showLogin, setUserPasswordResetToken } = AuthSlice.actions

export default AuthSlice.reducer