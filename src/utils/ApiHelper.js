import AsyncStorage from "@react-native-async-storage/async-storage";

import { baseURL } from "./BaseUrl";
import { isTrue } from "./stringUtl";



// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(`${baseURL}/${url}`, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            // 'Accept': 'application/json',
            'Content-Type': 'application/json',
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    if (!response.ok) {
        debugger;
        console.log(response);
        throw new Error(response.json());
    }

    return response.json(); // parses JSON response into native JavaScript objects
}

async function getData(url = '') {
    // Default options are marked with *
    var token = await AsyncStorage.getItem("token");
    const response = await fetch(`${baseURL}/${url}`, {
        headers: new Headers({
            'Authorization': 'Bearer ' + token,
        }),
    });
    if (!response.ok) {
        throw new Error(response.json());
    }
    return response.json(); // parses JSON response into native JavaScript objects
}

async function register(data) {
    return postData('auth/register', data).then(response => {
        console.log("here")
        saveToken(response.data);
        return response;
    });
}

async function login(data) {
    return postData('auth/login', data)
        .then(response => {
            saveToken(response.data);
            return response;
        });
}

async function verifyUsername(username) {
    console.log(username);
    return postData('auth/username/verify/' + username)
        .then(response => {
            return response.data
        });
}

async function verifyAccount(data) {
    return axios.post(`auth/password/email`, data);
}
async function verifyFunding(data) {
    return getData('v2/wallet/me/transaction/verify/' + data)
        .then(response => {
            console.log(response.data);
            return response.data;
        });
}

async function verifyOtp(data) {
    return axios.post(`auth/token/verify`, data)
}

async function resetPassword(data) {
    return axios.post(`auth/password/reset/${data.email}`, data)
}

async function saveToken(data) {
    await AsyncStorage.setItem("token", data);
    await AsyncStorage.setItem("used", "token");
}

export { login, register, verifyUsername, saveToken, verifyAccount, verifyFunding, resetPassword, verifyOtp };
export { getData, postData };