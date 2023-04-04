import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { useRef } from 'react'
import { Image } from 'react-native'
import { Pressable } from 'react-native'
import { Animated } from 'react-native'
import { View } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet'
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground'
import GameArkLogo from '../../shared/GameArkLogo'
import { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize'

const IconSettings = () => {
    const navigation = useNavigation()
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
    return(
            <MixedContainerBackground>
                    <View style={styles.container}>
                        <GameArkLogo />
                        <View style={styles.settingIconsContainter}>
                            <Pressable style={styles.icons}>
                                <Image style={styles.imageIcons} source={require('../../../assets/images/sound-1.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}>
                                <Image style={styles.imageIcons} source={require('../../../assets/images/leaderboard-icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}
                                onPress={() => {
                                  
                                    navigation.navigate('UserProfile')
                                }}>
                                <Image style={styles.imageIcons} source={require('../../../assets/images/profile-icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}>
                                <Image style={styles.imageIcons} source={require('../../../assets/images/icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}>
                                <Image style={styles.imageIcons} source={require('../../../assets/images/help-icon.png')} />
                            </Pressable >
                        </View>
                        <View style={styles.setting}>
                            <Pressable onPress={() => navigation.goBack(null)}>
                            <Animated.View style={[styles.circle, { transform: [{ rotate: spinAnimation }] }]}>
                                <Image style={styles.settingIcon} source={require('../../../assets/images/close-icon.png')} />
                                </Animated.View>
                            </Pressable>
                        </View>
                    </View>
            </MixedContainerBackground>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(3),
    },
    settingIconsContainter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: responsiveScreenHeight(25),
        paddingHorizontal: responsiveScreenHeight(3),

    },

    setting: {
        width: '100%',
        marginTop: responsiveScreenHeight(3),
        paddingHorizontal: responsiveScreenWidth(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    icons: {
        marginRight: 30,
        marginVertical: 10,
    },
    imageIcons: {
        height: 80,
        width: 80
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

export default IconSettings

