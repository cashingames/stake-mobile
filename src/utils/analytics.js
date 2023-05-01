import analytics from '@react-native-firebase/analytics';

export default async function logToAnalytics(eventName, data) {

    await analytics().logEvent(eventName, data)

}