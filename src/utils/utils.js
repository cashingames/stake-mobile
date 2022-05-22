import { nativeApplicationVersion } from "expo-application";
import { Alert, Linking } from "react-native";
import {
    BounceInDown, RotateInUpLeft, BounceInLeft, BounceInRight, BounceInUp, SlideInDown, SlideInLeft,
    SlideInRight, SlideInUp, RotateInUpRight, RotateInDownLeft, RotateInDownRight,
    FlipInXUp, FlipInXDown, FlipInEasyX, FlipInEasyY, FlipInYLeft, FlipInYRight
} from "react-native-reanimated";
import * as Updates from 'expo-updates';


export const randomElement = (arr) => {
    return arr[Math.floor(Math.random() * arr.length)];
}

export const randomEnteringAnimation = () => {
    var slides = [
        SlideInLeft, SlideInRight, SlideInDown, SlideInUp,
        BounceInLeft, BounceInRight, BounceInDown, BounceInUp,
        RotateInUpLeft, RotateInUpRight, RotateInDownLeft, RotateInDownRight,
        FlipInXUp, FlipInXDown, FlipInEasyX, FlipInEasyY, FlipInYLeft, FlipInYRight
    ];

    return randomElement(slides);
}

export const appNeedsUpdate = (minVersion) => {
    var installedVersionCodes = nativeApplicationVersion.split(".");
    var minVersionCodes = minVersion.split(".");

    for (var i = 0; i < installedVersionCodes.length; i++) {
        if (Number.parseInt(installedVersionCodes[i]) < Number.parseInt(minVersionCodes[i])) {
            return true;
        }
    }
    return false;
}

export const notifyOfStoreUpdates = (minVersionCode, forceUpdate = false) => {
    if (!appNeedsUpdate(minVersionCode)) {
        return;
    }

    var config = [];
    if (!forceUpdate) {
        config.push({
            text: 'Skip',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
        });
    }

    config.push({
        text: 'OK',
        onPress: () => Linking.openURL("https://play.google.com/store/apps/details?id=com.cashingames.cashingames"),
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
        if (update.isAvailable) {
            await Updates.fetchUpdateAsync();
            Alert.alert(
                "Updates available",
                "Please reload to the app to enjoy the new experience we just added to cashingames",
                [
                    {
                        text: 'Restart',
                        onPress: async () => {
                            await Updates.reloadAsync();
                        },
                    }
                ]
            );
        }
    } catch (e) {
        // handle or log error
        console.log(e);
    }
}