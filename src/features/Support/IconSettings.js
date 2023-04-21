import { useNavigation } from '@react-navigation/native'
import { useEffect } from 'react'
import { useRef } from 'react'
import { Alert, Image, Platform } from 'react-native'
import { Pressable } from 'react-native'
import { Animated } from 'react-native'
import { View } from 'react-native'
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet'
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground'
import GameArkLogo from '../../shared/GameArkLogo'
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from '../../utils/normalize'
import useSound from '../../utils/useSound'
import { Text } from 'react-native'
import { useState } from 'react'
import InviteFriendsScreen from '../../screens/InviteFriendsScreen'
import { useDispatch } from 'react-redux'
import { logoutUser } from '../Auth/AuthSlice'

const IconSettings = () => {
    const navigation = useNavigation()
    const [showInviteFriends, setShowInviteFriends] = useState(false);
    const spinValue = useRef(new Animated.Value(0)).current;
    const { toogle, handleToggle, stopSound } = useSound('../../../assets/sounds/open.wav')
    const { playSound } = useSound('../../../assets/sounds/open.wav')

    const dispatch = useDispatch()
    const handleToggleSwitch = () => {
        handleToggle();
        stopSound()
      };

    const showInvite = () => {
        setShowInviteFriends(true)
    }

    const logoutHandler = () => {
                Alert.alert(
                    'Logout?',
                    'Are you sure you want to logout?',
                    [
                        {
                            text: "No",
                           
                        },
                        {
                            text: 'Yes',
                            onPress: () =>   dispatch(logoutUser())
                        },
                    ]
                )
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
            <MixedContainerBackground>
                    <View style={styles.container}>
                        <View style={styles.top}>
                            <GameArkLogo />
                        </View>
                        <View style={styles.content}>                        
                            <View style={styles.settingIconsContainter}>
                            <Pressable style={styles.icons} onPress={handleToggleSwitch}>
                                {toogle ? <Image style={styles.imageIcons} resizeMode='contain' source={require('../../../assets/images/sound-1.png')} />:
                                 <Image style={styles.imageIcons} resizeMode='contain' source={require('../../../assets/images/sound-off.png')} />
                                }
                            </Pressable>
                            <Pressable style={styles.icons}
                            onPress={() => {
                                playSound()
                                navigation.navigate('Leaderboard')}} 
                            >
                                <Image style={styles.imageIcons} resizeMode='contain' source={require('../../../assets/images/leaderboard-icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}
                                onPress={() => {
                                    playSound()
                                    navigation.navigate('UserProfile')
                                }}>
                                <Image style={styles.imageIcons} resizeMode='contain' source={require('../../../assets/images/profile-icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}
                                  onPress={() => {
                                    playSound()
                                    navigation.navigate('ContactUs')
                                }}
                            >
                                <Image style={styles.imageIcons} resizeMode='contain' source={require('../../../assets/images/icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}
                                onPress={showInvite}
                            >
                                <Image style={styles.imageIcons} resizeMode='contain' source={require('../../../assets/images/invite-friends.png')} />
                            </Pressable >
                        </View>
                        <View style={styles.setting}>
                            <Pressable onPress={() => {
                                playSound()
                                navigation.goBack(null)}}>
                            <Animated.View style={[styles.circle, { transform: [{ rotate: spinAnimation }] }]}>
                                <Image style={styles.settingIcon} resizeMode='contain' source={require('../../../assets/images/close-icon.png')} />
                                </Animated.View>
                            </Pressable>
                            <View>
                            <Text style={styles.appVersion}>App version: {Constants.manifest.version}</Text>
                            <Pressable onPress={logoutHandler}>
                            <Text style={styles.appVersion}>Logout</Text>
                            </Pressable>
                            </View>
                        </View>
                    </View>
                    </View>
                    <InviteFriendsScreen  showInviteFriends={showInviteFriends} setShowInviteFriends={setShowInviteFriends}/>
            </MixedContainerBackground>
    )
}

const styles = EStyleSheet.create({
    container: {
        height: responsiveHeight(100),
        paddingVertical: responsiveHeight(6),
    },

    top:{
        height: responsiveHeight(20),
        // backgroundColor:'yellow',
        justifyContent:'flex-end'
    },
    content:{
        height:responsiveHeight(70), 
        justifyContent:"flex-end"
    },
    settingIconsContainter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        // marginTop: Platform.OS === 'ios' ? responsiveScreenHeight(40) : responsiveScreenHeight(27),
        paddingHorizontal: responsiveScreenWidth(5),
    },

    setting: {
        width: '100%',
        marginTop: responsiveScreenHeight(3),
        paddingHorizontal: responsiveScreenWidth(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    icons: {
        // marginRight: 30,
        marginVertical: 20,
    },
    imageIcons: {
        height: responsiveHeight(10),
        width: responsiveWidth(30)
    },
    settingIcon: {
        height: responsiveHeight(10),
        width: responsiveWidth(15)
    },
    appVersion:{
        fontFamily: 'graphik-medium',
        color: '#FBC437'
    }
})

export default IconSettings

