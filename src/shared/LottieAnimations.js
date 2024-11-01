import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';


const LottieAnimations = ({animationView, width,height}) => {
    const animation = useRef(null);

    return (
        <LottieView
            autoPlay
            ref={animation}
            style={{
                width: width,
                height: height,
            }}
            source={animationView}
        />
    )
}
export default LottieAnimations;