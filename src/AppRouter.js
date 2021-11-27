import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import HomeRouter from './features/Home/HomeRouter';
import AuthRouter from './features/Auth/AuthRouter';


import { isTrue } from './utils/stringUtl';
import { isLoggedIn } from './features/Auth/AuthSlice';
import { logout } from './utils/ApiHelper';
import PageLoading from './shared/PageLoading';

function AppRouter() {
    const dispatch = useDispatch();

    const [loading, setLoading] = useState(true);

    const token = useSelector(state => state.auth.token);

    //during app restart, check localstorage for these info
    useEffect(() => {
        dispatch(isLoggedIn()).then(() => {
            setLoading(false);
        });
    }, []);

    if (loading) {
        return <PageLoading />
    }


    // logout();

    if (!isTrue(token)) {
        return <AuthRouter />;
    }

    return <HomeRouter />

}


export default AppRouter;