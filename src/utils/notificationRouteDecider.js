import analytics from '@react-native-firebase/analytics';

export default function routeDecider(notificationData, navigation){
    
    if (!notificationData || notificationData.data == undefined){
        return;
    }
    switch (notificationData.data.action_type) {
        case 'CHALLENGE':            
            navigation.navigate('MyChallengesScore', { challengeId: notificationData.data.action_id });
            break;
        default:
            break;
    }
}