import * as Notifications from 'expo-notifications';

export const triggerNotifierForReferral = ()=>{
    setTimeout(()=>{
        Notifications.presentNotificationAsync({
            title: "Referral Rewards",
            body: 'Invite Your Friends to earns more games',
        })
    }, 7000)
    
}