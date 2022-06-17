import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import { Text } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';

// import Animation from 'lottie-react-native';


const LiveTriviaWinner = ({animationView, width,height}) => {
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
export default LiveTriviaWinner;
