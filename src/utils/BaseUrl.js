const env = process.env.APP_VARIANT;
export const isStaging = true;
export const baseURL = isStaging ? 'https://stg-api.cashingames.com/api' : 'https://api.cashingames.com/api';
export const backendUrl = isStaging ? 'https://stg-api.cashingames.com' : 'https://api.cashingames.com';
export const backendAPI = isStaging ? 'https://stg-api.cashingames.com/api' : 'https://api.cashingames.com/api';
export const appUrl = isStaging ? 'https://stg.cashingames.com' : 'https://www.cashingames.com';
export const paystackKey = isStaging ? 'pk_test_3ebf811326f87025dafdbe6829bdcbdaf8ebfd84' : 'pk_live_cee2bb8cae2f3f0ff16923b581c2bc1460ded991';
export const androidClientId = getAndroidClientId();
export const gaTrackingId = getGATrackingID();


function getAndroidClientId() {

    if (env === "development") {
        return '123011216040-2ngfo5n6380jb945b4jq4v0fmech16sv.apps.googleusercontent.com';
    } else if (env === "preview") {
        return "123011216040-b88f0f2hg926lvo4e69rt1vfp6a0ob48.apps.googleusercontent.com";
    } else {
        return "123011216040-og5ikpld5slid535nv0blrrh9rnuhfoo.apps.googleusercontent.com";
    }
}

function getGATrackingID() {
    if (env === "development") {
        return 'UA-173622310-2';
    } else if (env === "preview") {
        return 'UA-173622310-2';
    } else {
        return 'UA-173622310-1';
    }
}