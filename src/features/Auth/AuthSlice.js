
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { getIsLoggedIn, getIsLoggedInOnce, login as loginApi } from '../../utils/ApiHelper';

// const fetchUserById = createAsyncThunk(
//     'users/fetchByIdStatus',
//     async (userId, thunkAPI) => {
//         const response = await userAPI.fetchById(userId)
//         return response.data
//     }
// )

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


const initialState = {
    token: "",
    showIntro: false,
    user: {},
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
        }
    },
    extraReducers: (builder) => {
        // Add reducers for additional action types here, and handle loading sAWAWAWAWtate as needed
        builder
            .addCase(loginUser.fulfilled, (state, action) => {
                // Add user to the state array
                state.token = action.payload;
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