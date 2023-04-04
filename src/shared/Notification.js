import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export const triggerNotifierForReferral = ()=>{
    setTimeout(()=>{
        Notifications.presentNotificationAsync({
            title: "Referral Rewards",
            body: 'Invite Your Friends to earns more games',
        })
    }, 7000)
    
}

export const triggerNotificationForAppInstallation = async () => {
    let token = await AsyncStorage.getItem('expoPushToken');
    if (!token) {
      token = await Notifications.getExpoPushTokenAsync();
      await AsyncStorage.setItem('expoPushToken', JSON.stringify(token));
     Notifications.scheduleNotificationAsync({
        content: {
          title: 'Welcome to Gameark',
          body: "Welcome to GameArk, where the adventure never ends! Whether you're a seasoned player or new to the gaming world, our game has something for everyone. With exciting quests and endless challenges, get ready to dive into a world of fun and excitement. Join our community today and let's begin the journey together!🎮🌟",
          importance: 'high',
        },
        trigger: null,
      });
    }
}