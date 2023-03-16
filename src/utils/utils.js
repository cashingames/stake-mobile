import { nativeApplicationVersion } from "expo-application";
import { Alert, Linking } from "react-native";
import {
    BounceInDown, RotateInUpLeft, BounceInLeft, BounceInRight, BounceInUp, SlideInDown, SlideInLeft,
    SlideInRight, SlideInUp, RotateInUpRight, RotateInDownLeft, RotateInDownRight,
    FlipInXUp, FlipInXDown, FlipInEasyX, FlipInEasyY, FlipInYLeft, FlipInYRight
} from "react-native-reanimated";
import * as Updates from 'expo-updates';
import crashlytics from '@react-native-firebase/crashlytics';


export const randomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const randomEnteringAnimation = () => {
    const slides = [
        SlideInLeft, SlideInRight, SlideInDown, SlideInUp,
        BounceInLeft, BounceInRight, BounceInDown, BounceInUp,
        RotateInUpLeft, RotateInUpRight, RotateInDownLeft, RotateInDownRight,
        FlipInXUp, FlipInXDown, FlipInEasyX, FlipInEasyY, FlipInYLeft, FlipInYRight
    ];

    return randomElement(slides);
}

export const appNeedsStoreUpdate = (minVersion) => {
    const installedVersionCodes = nativeApplicationVersion.split(".");
    const minVersionCodes = minVersion.split(".");

    for (let i = 0; i < installedVersionCodes.length; i++) {
        if (Number.parseInt(installedVersionCodes[i]) < Number.parseInt(minVersionCodes[i])) {
            return true;
        }
    }
    return false;
}

export const appNeedsPublishedRestart = async (minPublishedVersionCode) => {
    return true;
}

export const notifyOfStoreUpdates = (minVersionCode, forceUpdate = false) => {
    if (!appNeedsStoreUpdate(minVersionCode)) {
        return;
    }

    let config = [];
    if (!forceUpdate) {
        config.push({
            text: 'Skip',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        });
    }

    const link = Platform.OS === 'ios' ?
        "https://apps.apple.com/us/app/cashingames/id6443878628"
        :
        "https://play.google.com/store/apps/details?id=com.cashingames.cashingames";

    config.push({
        text: 'OK',
        onPress: () => Linking.openURL(link),
    });

    Alert.alert(
        "Updates available",
        "Please update your app now to access new ways of winning more money",
        config
    );
}

export const notifyOfPublishedUpdates = async () => {
    try {

        const update = await Updates.checkForUpdateAsync();

        if (!update.isAvailable) {
            return;
        }
        await Updates.fetchUpdateAsync();
        Alert.alert(
            "Updates available",
            "Please reload the app to enjoy the new experience we just added to cashingames",
            [
                {
                    text: 'Restart',
                    onPress: async () => {
                        await Updates.reloadAsync();
                    },
                }
            ]
        );

    } catch (e) {
        crashlytics().recordError(error);
    }
}

export const networkIssueNotify = async () => {

    //let's actually check network
    Alert.alert(
        "Problem detected",
        "Please check your network connection and restart the app to continue playing game. If the issue still persists please contact support",
        [
            {
                text: 'Restart',
                onPress: async () => {
                    await Updates.reloadAsync().catch((error) => crashlytics().recordError(error));
                },
            }
        ]
    )
}

export const calculateTimeRemaining = (futureTime, onComplete) => {
    const diff = futureTime - new Date().getTime();

    // console.log(diff, typeof(diff), diff < 2000, diff < Number(2000))
    if (diff < 3000) {
        // console.log("stop running countdown")
        onComplete();
        return "1s";
    }

    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    let result = "";
    if (days !== 0) {
        result += days + "d ";
    }

    if (hours !== 0) {
        result += hours + "h ";
    }

    if (minutes !== 0) {
        result += minutes + "m ";
    }

    if (seconds !== 0) {
        result += seconds + "s ";
    }

    return result;

}