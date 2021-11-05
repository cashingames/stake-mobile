import * as React from 'react';
import { View } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import CountDown from 'react-native-countdown-component';
const GameCountdown = ({onFinish}) => {
    return (
        <View>
        <CountDown
            until={3}
            onFinish={onFinish}
            size={100}
            timeToShow={['S']}
            digitStyle={{backgroundColor: '#9C3DB8'}}
            digitTxtStyle={{color: '#FFFF' , fontSize:normalize(100), fontFamily: 'graphik-medium',}}
            timeLabels={{m: 'MM', s: 'Starting Game'}}
            timeLabelStyle={{color: '#FFFF', fontSize:normalize(18), fontFamily: 'graphik-regular',}}
        />
    </View>
    )
}
export default GameCountdown