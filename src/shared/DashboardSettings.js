import { View } from 'react-native'
import React from 'react'
import { responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Image } from 'react-native'
import { Pressable } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import { useDispatch, useSelector } from 'react-redux'
import { getGlobalLeaders, setModalOpen } from '../features/CommonSlice'
import { useRef } from 'react'
import { Animated } from 'react-native'
import { useEffect } from 'react'
import useSound from '../utils/useSound'

const DashboardSettings = () => {
    const { playSound } = useSound(require('../../assets/sounds/open.wav'));

   const dispatch = useDispatch()
    useEffect(() => {
        dispatch(getGlobalLeaders());
    },[]);
    const spinValue = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const spin = () => {
        Animated.timing(spinValue, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }).start(() => {
          spinValue.setValue(0);
          spin();
        });
      };
      spin();
    }, [spinValue]);
  
    const spinAnimation = spinValue.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
  
    const navigation = useNavigation()
    return (
        <>
            <View style={styles.setting}>
                <Pressable onPress={() => {
                    playSound()
                    navigation.navigate('IconSettings')}}>
                <Animated.View style={[styles.circle, { transform: [{ rotate: spinAnimation }] }]}>
                    <Image style={styles.settingIcon} source={require('./../../assets/images/setting-icon.png')} />
                    </Animated.View>
                </Pressable>
                <Pressable onPress={() => {
                    playSound()
                    navigation.navigate('GameStore')}}>
                    <Image style={styles.storeIcon} source={require('../../assets/images/store-icon.png')} />
                    
                </Pressable>
            </View>
        </>
    )
}
const styles = EStyleSheet.create({
    settingIconsContainter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: responsiveScreenHeight(34),
        paddingHorizontal: responsiveScreenHeight(3),

    },

    setting: {
        width: '100%',
        marginTop: responsiveScreenHeight(1),
        paddingHorizontal: responsiveScreenWidth(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    settingIcon: {
        width: 50,
        height: 50
    },
    storeIcon: {
        width: 75.55,
        height: 50
    }
})

export default DashboardSettings
