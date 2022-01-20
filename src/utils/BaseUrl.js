// const env = process.env.APP_VARIANT;

export const isStaging = true;
export const baseURL = isStaging ? 'https://stg-api.cashingames.com/api' : 'https://api.cashingames.com/api';
export const backendUrl = isStaging ? 'https://stg-api.cashingames.com' : 'https://api.cashingames.com';
export const backendAPI = isStaging ? 'https://stg-api.cashingames.com/api' : 'https://api.cashingames.com/api';
export const appUrl = isStaging ? 'https://stg.cashingames.com' : 'https://www.cashingames.com';
export const paystackKey = isStaging ? 'pk_test_3ebf811326f87025dafdbe6829bdcbdaf8ebfd84' : 'pk_live_cee2bb8cae2f3f0ff16923b581c2bc1460ded991';
export const androidClientId = '125752028373-ik9v848h4d8n8c95bq5lrva1k5anffdo.apps.googleusercontent.com';
export const gaTrackingId = isStaging ? 'UA-173622310-2' : 'UA-173622310-1';



// function getAndroidClientId() {
   
//     if (env === "development") {
//       return '125752028373-ik9v848h4d8n8c95bq5lrva1k5anffdo.apps.googleusercontent.com';
//     } else if (env === "preview") {
//       return "125752028373-f3pls3bjaq22s82p9elsg57bd7bc0kbh.apps.googleusercontent.com";
//     } else {
//       return "125752028373-mmdihc58hbubpt4obl59875tun5633or.apps.googleusercontent.com";
//     }
//   }