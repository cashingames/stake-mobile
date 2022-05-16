import { nativeApplicationVersion } from "expo-application";
import {
    BounceInDown, RotateInUpLeft, BounceInLeft, BounceInRight, BounceInUp, SlideInDown, SlideInLeft,
    SlideInRight, SlideInUp, RotateInUpRight, RotateInDownLeft, RotateInDownRight,
    FlipInXUp, FlipInXDown, FlipInEasyX, FlipInEasyY, FlipInYLeft, FlipInYRight
} from "react-native-reanimated";


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