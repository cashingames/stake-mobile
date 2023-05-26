import analytics from '@react-native-firebase/analytics';
import { AppEventsLogger } from "react-native-fbsdk-next";

export default async function logToAnalytics(eventName, data) {

    await analytics().logEvent(eventName, data)
    AppEventsLogger.logEvent(eventName, data)
}