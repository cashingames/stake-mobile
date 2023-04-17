import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { useRef } from 'react'
import { Image, Platform } from 'react-native'
import { Pressable } from 'react-native'
import { Animated } from 'react-native'
import { View } from 'react-native'
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet'
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground'
import GameArkLogo from '../../shared/GameArkLogo'
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize'
import useSound from '../../utils/useSound'
import { ScrollView } from 'react-native-gesture-handler'
import { Text } from 'react-native'
import { useState } from 'react'
import InviteFriendsScreen from '../../screens/InviteFriendsScreen'

const IconSettings = () => {
    const navigation = useNavigation()
    const [showInviteFriends, setShowInviteFriends] = useState(false);
    const spinValue = useRef(new Animated.Value(0)).current;
    const { toogle, handleToggle, stopSound } = useSound('../../../assets/sounds/dashboard.mp3')

    const handleToggleSwitch = () => {
        handleToggle();
        stopSound()
      };

    const showInvite = () => {
        setShowInviteFriends(true)
    }

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
        <ScrollView>
            <MixedContainerBackground>
                    <View style={styles.container}>
                        <GameArkLogo />
                        <View style={styles.settingIconsContainter}>
                            <Pressable style={styles.icons} onPress={handleToggleSwitch}>
                                {toogle ? <Image style={styles.imageIcons} source={require('../../../assets/images/sound-1.png')} />:
                                 <Image style={styles.imageIcons} source={require('../../../assets/images/sound-off.png')} />
                                }
                            </Pressable>
                            <Pressable style={styles.icons}
                            onPress={() => navigation.navigate('Leaderboard')} 
                            >
                                <Image style={styles.imageIcons} source={require('../../../assets/images/leaderboard-icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}
                                onPress={() => {
                                    navigation.navigate('UserProfile')
                                }}>
                                <Image style={styles.imageIcons} source={require('../../../assets/images/profile-icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}
                                  onPress={() => {
                                    navigation.navigate('ContactUs')
                                }}
                            >
                                <Image style={styles.imageIcons} source={require('../../../assets/images/icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}
                                onPress={showInvite}
                            >
                                <Image style={styles.imageIcons} source={require('../../../assets/images/invite-friends.png')} />
                            </Pressable >
                        </View>
                        <View style={styles.setting}>
                            <Pressable onPress={() => navigation.goBack(null)}>
                            <Animated.View style={[styles.circle, { transform: [{ rotate: spinAnimation }] }]}>
                                <Image style={styles.settingIcon} source={require('../../../assets/images/close-icon.png')} />
                                </Animated.View>
                            </Pressable>
                            <Text style={styles.appVersion}>App version: {Constants.manifest.version}</Text>
                        </View>
                    </View>
                    <InviteFriendsScreen  showInviteFriends={showInviteFriends} setShowInviteFriends={setShowInviteFriends}/>
            </MixedContainerBackground>
            </ScrollView>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingTop: normalize(60),
        paddingVertical: responsiveScreenWidth(3),
    },
    settingIconsContainter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: Platform.OS === 'ios' ? responsiveScreenHeight(50) : responsiveScreenHeight(35),
        paddingHorizontal: responsiveScreenWidth(5),
    },

    setting: {
        width: '100%',
        marginTop: responsiveScreenHeight(3),
        paddingHorizontal: responsiveScreenWidth(5),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    icons: {
        marginRight: 30,
        marginVertical: 10,
    },
    imageIcons: {
        height: 75,
        width: 75
    },
    settingIcon: {
        width: 50,
        height: 50
    },
    storeIcon: {
        width: 75.55,
        height: 50
    },
    appVersion:{
        fontFamily: 'graphik-medium',
        color: '#FBC437'
    }
})

export default IconSettings

