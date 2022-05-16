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