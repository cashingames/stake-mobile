import React, { useState } from 'react';
import { Text, View, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { isTrue } from '../../utils/stringUtl';
import { getUser, editProfileAvatar, logoutUser } from '../Auth/AuthSlice';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import Animated from 'react-native-reanimated';
import { randomEnteringAnimation } from '../../utils/utils';
import useSound from '../../utils/useSound';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GameArkLogo from '../../shared/GameArkLogo';
import { setModalOpen } from '../CommonSlice';


export default function UserProfileScreen({ navigation }) {

    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(logoutUser());
    }

    useFocusEffect(
        React.useCallback(() => {
            // console.info('UserDetails focus effect')
            dispatch(getUser());
        }, [])
    );

    return (
        <MixedContainerBackground>
            <SafeAreaView style={styles.container}>
                <GameArkLogo />
                <ScrollView style={{ flex: 1 }}>
                    <View style={[styles.content, { flex: 1 }]}>
                        <View>
                            <UserAvatar />
                            <ProfileTabs />
                        </View>
                    </View>
                    {/* <Footer onLogout={onLogout} /> */}
                    <Pressable onPress={() => {
                        navigation.goBack(null)
                        dispatch(setModalOpen(false))}}>
                        <Image style={styles.settingIcon} source={require('../../../assets/images/close-icon.png')} />
                    </Pressable>
                </ScrollView>
            </SafeAreaView>
        </MixedContainerBackground>
    );
}

const UserAvatar = () => {
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);


    const pickImage = async () => {
        setLoading(true);
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (result.cancelled) {
            setLoading(false);
            return;
        }

        let localUri = result.uri;
        let filename = localUri.split('/').pop();
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        let formData = new FormData();
        formData.append('avatar', { uri: localUri, name: filename, type });

        dispatch(editProfileAvatar(formData)).then(result => {
            dispatch(getUser()).then(x => {
                setLoading(false)
            });
        }).catch(ex => {
            // console.log("erroring", ex);
            setLoading(false);
        });
    }

    return (
        <View style={styles.userAvatar}>
            <View style={styles.imageCircle}>
                <Image
                    style={styles.avatar}
                    source={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}

                />
                {!loading ?
                    <Pressable style={styles.camera} onPress={pickImage}>
                        {/* <Ionicons name="camera-sharp" size={26} color="#FFFF" /> */}
                        <Image style={styles.imageIcon} source={require('../../../assets/images/addImage.png')} />
                    </Pressable> : <ActivityIndicator size="large" color="#0000ff" />}
            </View>
        </View>
    )
}

const ProfileTabs = () => {
    const dispatch = useDispatch();
    const { playSound } = useSound(require('../../../assets/sounds/open.wav'))

    const navigation = useNavigation();
    const features = useSelector(state => state.common.featureFlags);
    const isAchievementBadgeFeatureEnabled = features['achievement_badges'] !== undefined && features['achievement_badges'].enabled === true;

    // const onLogout = () => {
    //     dispatch(logoutUser());
    // }

    return (

        <View style={styles.profileTabs}>
            <ProfileTab tabName='Edit Details' onPress={() => {
                playSound()
                navigation.navigate('EditDetails')
            }} />
            <ProfileTab tabName='Change Password' onPress={() => {
                playSound()
                navigation.navigate('ChangePassword')
            }} />
            <ProfileTab tabName='Achievements' onPress={() => {
                playSound()
                navigation.navigate('AchievementsMilestone')
            }} />
            <ProfileTab tabName='Stats' onPress={() => {
                playSound()
                navigation.navigate('UserStats')
            }} />
            <ProfileTab tabName='Invite Friends' onPress={() => {
                playSound()
                navigation.navigate('Invite')
            }} />
        </View>

    )
}


const ProfileTab = ({ tabName, onPress }) => {
    return (
        <Animated.View entering={randomEnteringAnimation().duration(1000)}>
            <Pressable onPress={onPress} style={styles.profileTab}>
                <Text style={styles.tabText}>{tabName}</Text>
            </Pressable >
        </Animated.View>
    )
}

const Footer = ({ onLogout }) => {
    return (
        <View style={styles.logoutContainer}>
            <Text style={styles.appVersion}>App version: {Constants.manifest.version}</Text>
            <Pressable onPress={onLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </Pressable>
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: responsiveScreenWidth(3)
    },
    content: {
        paddingVertical: normalize(25),
        // marginBottom: normalize(20),
        alignItems: 'center'

    },
    userAvatar: {
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'center',
        padding: 10
        // width: normalize(150),
        // height: normalize(150),
    },
    avatar: {
        width: normalize(150),
        height: normalize(150),
        backgroundColor: '#FFFF',
        borderRadius: 100,
        borderColor: '#fff',
        borderWidth: 4,
        marginBottom: normalize(10)
    },
    camera: {
        // backgroundColor: '#EF2F55',
        borderRadius: 100,
        padding: normalize(6),
        position: 'absolute',
        bottom: 0,
        right: 10
    },
    imageIcon: {
        height: 50,
        width: 50
    },
    profileTab: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingHorizontal: 35,
        borderRadius: 20,
        marginVertical: 8,
        paddingVertical: normalize(10)
    },
    tabText: {
        fontSize: '0.93rem',
        fontFamily: 'blues-smile',
        color: '#15397D',
    },
    profileTabs: {
        paddingVertical: normalize(25)
    },
    logoutContainer: {
        backgroundColor: '#FFFF',
        marginBottom: 22,
        // flex: 1,
        // justifyContent: 'flex-end'
    },
    appVersion: {
        color: '#000000',
        fontSize: '0.8rem',
        lineHeight: '0.7rem',
        fontFamily: 'graphik-regular',
        opacity: 0.7,
        marginVertical: 10,
        textAlign: 'center',
    },
    logoutText: {
        color: '#EF2F5F',
        textAlign: 'center',
        fontSize: '0.75rem',
        fontFamily: 'graphik-medium',
        paddingVertical: responsiveScreenHeight(1),
    },
    settingIcon: {
        width: 50,
        height: 50
    },

});
