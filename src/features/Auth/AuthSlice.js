
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
    verifyOtp as verifyOtpApi,
    verifyAccount as verifyAccountApi,
    resetPassword as resetPasswordApi,
} from '../../utils/ApiHelper';
import { isTrue } from '../../utils/stringUtl';

export const registerUser = async (data) => {
    return axios.post('auth/register', data);
}

export const verifyUser = createAsyncThunk(
    'auth/verifyUser',
    async (data, thunkAPI) => {
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

export const loginWithSocialLink = createAsyncThunk(
    'auth/loginWithSocialLink',
    async (data, thunkAPI) => {
        const response = await axios.post('/auth/social-login/authenticate', data)
        return response.data
    }
)

export const registerWithSocialLink = createAsyncThunk(
    'auth/registerWithSocialLink',
    async (data, thunkAPI) => {
        const response = await axios.post('/auth/social-login/create-account', data)
        return response.data
    }
)

export const googleSignUp = async (data) => {
    return axios.post('/auth/social-login/create-account', data)
}

export const logoutUser = createAsyncThunk(
    'auth/logoutUser',
    async (data, thunkAPI) => {
        await AsyncStorage.removeItem("token");
        return true;
    }
)

export const deleteUserAccount = createAsyncThunk(
    'auth/deleteUserAccount',
    async (data, thunkAPI) => {
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

export const shouldShowIntro = createAsyncThunk(
    'auth/shouldShowIntro',
    async (thunkAPI) => {
        return await AsyncStorage.getItem("used");
    }
)

export const verifyAccount = createAsyncThunk(
    'auth/verifyAccount',
    async (data, thunkAPI) => {
        const response = await verifyAccountApi(data)
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

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async (data, thunkAPI) => {
        const response = await resetPasswordApi(data);
        return response.data
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

export const editProfileAvatar = createAsyncThunk(
    'auth/user/avatarUpdate',
    async (data, thunkAPI) => {
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        const response = await axios.post('v2/profile/me/picture', data, config);
        return response.data
    }
)



export const getChallengeScores = createAsyncThunk(
    'auth/getChallengeScores',
    async (data, thunkAPI) => {
        const response = await axios.get(`v3/challenge/${data}/leaderboard`);
        return response.data;
    }
)

export const verifyDeviceToken = createAsyncThunk(
    'auth/verifyDeviceToken',
    async (token, thunkAPI) => {
        console.log(token)
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

export const ResendPhoneOtp = createAsyncThunk(
    'auth/ResendPhoneOtp',
    async (data, thunkAPI) => {
        const response = await axios.post('auth/register/token/resend', data);
        return response.data;
    }
)

export const getFirstTimeUserReward = createAsyncThunk(
    'auth/getFirstTimeUserReward',
    async (data, thunkAPI) => {
        const response = await axios.get('v3/first-time-bonus/fetch');
        return response.data;
    }
)


export const getUser = createAsyncThunk(
    'auth/user/get',
    async (thunkAPI) => {
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
    passwordReset: {
        // email: 'oyekunmi@gmail.com'
    },
    createAccount: {},
    challengeScores: {},
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
            state.showIntro = false;
            console.log("token set");
        },
        showLogin: (state) => {
            state.showIntro = false;
        },
        setUserPasswordResetToken: (state, action) => {
            state.passwordReset.userCode = action.payload;
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
                state.showIntro = false;
                state.user = {};
                state.passwordReset = {};
                state.createAccount = {};
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                console.log("action response X", action.payload.data);
                state.token = action.payload.data;
            })
            .addCase(loginUser.rejected, (state, action) => {
                
                console.log("login rejected payload", action.payload);
            })
            .addCase(resetPassword.fulfilled, (state) => {
                state.passwordReset = {};
            })
            .addCase(getUser.fulfilled, (state, action) => {
                // Add user to the state array
                state.user = action.payload.data;
            })
            .addCase(isLoggedIn.fulfilled, (state, action) => {
                state.token = action.payload;
            })
            .addCase(shouldShowIntro.fulfilled, (state, action) => {
                state.showIntro = !isTrue(action.payload);
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
            .addCase(loginWithSocialLink.fulfilled, (state, action) => {
                state.token = action.payload.data.token;
            })
            .addCase(registerWithSocialLink.fulfilled, (state, action) => {
                state.token = action.payload.data;
            })
            .addCase(getChallengeScores.fulfilled, (state, action) => {
                state.challengeScores = action.payload;
            })
            .addCase(getFirstTimeUserReward.fulfilled, (state, action) => {
                state.firstTimeUserReward = action.payload.data;
            })

    },
});

export const { setToken, setUser, showLogin, setUserPasswordResetToken, saveCreatedUserCredentials, reduceBoostCount } = AuthSlice.actions

export default AuthSlice.reducer