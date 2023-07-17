
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUser = async (data) => {
    return axios.post(`auth/register`, data);
}

export const verifyUser = createAsyncThunk(
    'auth/verifyUser',
    async (data) => {
        const response = await axios.post('auth/user/authenticate', data)
        return response.data
    }
)

export const loginUser = createAsyncThunk(
    'auth/login',
    async (data, thunkAPI) => {
        try {
            const response = await axios.post('auth/login', data);
            await AsyncStorage.setItem("token", response.data.data);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)
export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async () => {
        await AsyncStorage.removeItem("token");
        return true;
    }
)

export const deleteUserAccount = createAsyncThunk(
    'auth/deleteUserAccount',
    async (data) => {
        const response = await axios.delete('v3/account/delete', data)

        return response.data
    }
)

export const isLoggedIn = createAsyncThunk(
    'auth/isLoggedIn',
    async (thunkAPI) => {
        return AsyncStorage.getItem("token");
    }
)

export const sendEmailOTP = createAsyncThunk(
    'auth/user/verifyEmail',
    async (data, thunkAPI) => {
        const response = await axios.post('v3/stakers/otp/send', data)
        return response.data
    }
)

export const verifyEmailOTP = createAsyncThunk(
    'auth/user/verifyEmail',
    async (data, thunkAPI) => {
        const response = await axios.post('v3/stakers/email/verify', data)
        return response.data
    }
)

export const verifyAccount = createAsyncThunk(
    'auth/verifyAccount',
    async (data, thunkAPI) => {
        const response = await axios.post(`auth/password/email`, data)
        return response.data
    }
)

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async (data) => {
        const response = await axios.post(`auth/token/verify`, data);
        return response.data
    }
)

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data) => {
        const response = await axios.post(`auth/password/reset`, data);
        return response.data
    }
)

export const changePassword = createAsyncThunk(
    'auth/user/changePassword',
    async (data) => {
        const response = await axios.post('v3/profile/me/password/change', data)
        return response.data
    }
)

export const editPersonalDetails = async (data) => {
    return axios.post(`v3/profile/me/edit-personal`, data);
}
export const editBankDetails = createAsyncThunk(
    'auth/user/editBankDetails',
    async (data, thunkAPI) => {
        const response = await axios.post('v3/profile/me/edit-bank', data)
        return response.data
    }
)

export const editProfileAvatar = createAsyncThunk(
    'auth/user/avatarUpdate',
    async (data) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const response = await axios.post('v3/profile/me/picture', data, config);
        return response.data
    }
)


export const verifyDeviceToken = createAsyncThunk(
    'auth/verifyDeviceToken',
    async (token) => {
        const response = await axios.post('v3/fcm/subscriptions', { token, device_token: token });
        return response.data;
    }
)

export const verifyPhoneOtp = createAsyncThunk(
    'auth/verifyPhoneOtp',
    async (data, thunkAPI) => {
        try {
            const response = await axios.post('auth/register/verify-token', data);
            await AsyncStorage.setItem("token", response.data.data);
            return response.data;
        } catch (err) {
            return thunkAPI.rejectWithValue(err.response.data);
        }
    }
)

export const resendPhoneOtp = createAsyncThunk(
    'auth/resendPhoneOtp',
    async (data) => {
        const response = await axios.post('auth/register/token/resend', data);
        return response.data;
    }
)

export const resendPasswordOtp = createAsyncThunk(
    'auth/resendPasswordOtp',
    async (data) => {
        const response = await axios.post('auth/password/token/resend', data);
        return response.data;
    }
)

export const getFirstTimeUserReward = createAsyncThunk(
    'auth/getFirstTimeUserReward',
    async () => {
        const response = await axios.get('v3/first-time-bonus/fetch');
        return response.data;
    }
)


export const getUser = createAsyncThunk(
    'auth/user/get',
    async () => {
        const response = await axios.get('v3/user/profile')
            // .catch(error => {
            //     console.log(error);

            //     if (error.response) {
            //         // The request was made and the server responded with a status code
            //         // that falls out of the range of 2xx
            //         console.log(error.response); 
            //         // console.log(error.response.status);
            //         // console.log(error.response.headers);
            //     } else if (error.request) {
            //         // The request was made but no response was received
            //         // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
            //         // http.ClientRequest in node.js
            //         console.log(error);
            //     } else {
            //         // Something happened in setting up the request that triggered an Error
            //         // console.log('Error', error.message);
            //     }
            //     // console.log(error.config);
            // })
            ;
        return response.data;
    }
)

const initialState = {
    token: "",
    showIntro: false,
    user: {},
    passwordReset: {},
    createAccount: {},
    firstTimeUserReward: [],
    loginError: "",
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
        },
        showLogin: (state) => {
            state.showIntro = false;
        },
        setUserPasswordResetToken: (state, action) => {
            state.passwordReset.userCode = action.payload;
        },
        setUserPhone: (state, action) => {
            state.passwordReset.userPhone = action.payload;
        },
        saveCreatedUserCredentials: (state, action) => {
            state.createAccount = action.payload
        },
        reduceBoostCount: (state, action) => {
            state.user.boosts.map(boost => {
                if (boost.id === action.payload) {
                    boost.count -= 1;
                }
            })
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(logoutUser.fulfilled, (state) => {
                state.token = "";
                state.user = {};
                state.passwordReset = {};
                state.createAccount = {};
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.token = action.payload.data;
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log("login rejected payload", action.payload);
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.passwordReset = {};
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.user = action.payload.data;
            })
            .addCase(isLoggedIn.fulfilled, (state, action) => {
                state.token = action.payload;
            })
            .addCase(verifyAccount.fulfilled, (state, action) => {
                state.passwordReset.email = action.meta.arg.email;
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.token = action.payload.data;
            })
            .addCase(verifyPhoneOtp.fulfilled, (state, action) => {
                state.token = action.payload.data;
            })
            .addCase(getFirstTimeUserReward.fulfilled, (state, action) => {
                state.firstTimeUserReward = action.payload.data;
            })

    },
});

export const { setToken, setUser, showLogin,setUserPhone, setUserPasswordResetToken, saveCreatedUserCredentials, reduceBoostCount } = AuthSlice.actions

export default AuthSlice.reducer