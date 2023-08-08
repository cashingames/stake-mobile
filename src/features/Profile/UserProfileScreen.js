import React, { useState } from 'react';
import { Text, View, Image, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import * as ImagePicker from 'expo-image-picker';
import { isTrue } from '../../utils/stringUtl';
import { getUser, editProfileAvatar, logoutUser } from '../Auth/AuthSlice';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';


export default function UserProfileScreen({ navigation }) {

    useApplyHeaderWorkaround(navigation.setOptions);

    const dispatch = useDispatch();

    const onLogout = () => {
        dispatch(logoutUser());
    }

    return (
            <ScrollView style={styles.container}>
                <View style={styles.content}>
                    <UserAvatar />
                    <ProfileTabs />
                </View>
                <View style={styles.logoutContainer}>
                <Pressable onPress={onLogout} style={styles.button}>
                    <Text style={styles.text}>Logout</Text>
                </Pressable>
                <Text style={styles.appVersion}>App version: {Constants.expoConfig.version}</Text>
            </View>
            </ScrollView>
    );
}

const UserAvatar = () => {
    const user = useSelector(state => state.auth.user)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const username = user.firstName === '' ? user.username : (user.firstName + ' ' + user.lastName)



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
            setLoading(false);
        });
    }

    return (
        <>
            <View style={styles.userAvatar}>
                <Image
                    style={styles.avatar}
                    source={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}

                />

                {!loading ?
                    <Pressable style={styles.camera} onPress={pickImage}>
                        <Ionicons name="camera-sharp" size={20} color="#FFFF" />
                    </Pressable> :
                    <ActivityIndicator size="large" color="#0000ff" />
                }
            </View>
            <Text style={styles.userName}>{username}</Text>
        </>

    )
}

const ProfileTabs = () => {

    const navigation = useNavigation();

    return (
        <View style={styles.profileTabsContainer}>
            <View style={styles.profileTabs}>
                <ProfileTab tabName='Bio data' onPress={() => navigation.navigate('EditDetails')} icon={require('../../../assets/images/single-player.png')} styleProp={styles.profileTab} />
                <ProfileTab tabName='Notification' onPress={() => navigation.navigate('Notifications')} icon={require('../../../assets/images/bell-dynamic-color.png')} styleProp={styles.profileTabI} />
                <ProfileTab tabName='Wallet' onPress={() => navigation.navigate('Wallet')} icon={require('../../../assets/images/wallet-dynamic-color.png')} styleProp={styles.profileTab} />
            </View>
            <View style={styles.profileTabs}>
                <ProfileTab tabName='FAQ' onPress={() => navigation.navigate('Support')} icon={require('../../../assets/images/file-dynamic-color.png')} styleProp={styles.profileTab} />
                <ProfileTab tabName='Contact Us' onPress={() => navigation.navigate('ContactUs')} icon={require('../../../assets/images/mail-dynamic-color.png')} styleProp={styles.profileTabI} />
                <ProfileTab tabName='Invite' onPress={() => navigation.navigate('Invite')} icon={require('../../../assets/images/link-dynamic-color.png')} styleProp={styles.profileTab} />
            </View>
            <View style={styles.profileTabsI}>
                <ProfileTab tabName='Change Password' onPress={() => navigation.navigate('ChangePassword')} icon={require('../../../assets/images/key-dynamic-color.png')} styleProp={styles.profileTabI} />
            </View>
        </View>
    )
}


const ProfileTab = ({ tabName, onPress, icon, styleProp }) => {
    return (
        <Pressable onPress={onPress} style={styleProp}>
            <View style={styles.profileTabIcon}>
                <Image
                    source={icon}
                    style={styles.tabIcon}
                />
            </View>
            <Text style={styles.tabText}>{tabName}</Text>
        </Pressable >
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingHorizontal:'1.2rem',
        paddingTop:'1rem'
    },
    content: {
        marginHorizontal: normalize(18),
        paddingVertical: normalize(25),
        marginBottom: normalize(20)

    },
    userAvatar: {
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        width: normalize(100),
        height: normalize(100),
        backgroundColor: '#FFFF',
        borderRadius: 100,
        borderColor: '#F5870F',
        borderWidth: 1,
        marginBottom: normalize(10)
    },
    camera: {
        backgroundColor: '#F5870F',
        borderRadius: 50,
        padding: normalize(6),
        position: 'absolute',
        // left: 35,
        bottom: -5
    },
    profileTab: {
        flexDirection: 'column',
        alignItems: 'center',
    },
    profileTabI: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '2.5rem'
    },
    profileTabIcon: {
        borderColor: '#F5870F',
        borderWidth: 2,
        borderRadius: 100,
        width: '5rem',
        height: '5rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    tabIcon: {
        width: '3rem',
        height: '3rem'
    },
    tabText: {
        fontSize: '0.85rem',
        fontFamily: 'sansation-bold',
        color: '#1C453B',
        marginTop: '.4rem'
    },
    userName: {
        fontSize: '0.93rem',
        fontFamily: 'sansation-bold',
        color: '#1C453B',
        textAlign: 'center',
        marginTop: '.6rem'
    },
    profileTabsContainer: {
        flexDirection: 'column'
    },
    profileTabs: {
        flexDirection: 'row',
        justifyContent: 'space-between'
        // paddingVertical: normalize(25)
    },
    profileTabsI: {
        flexDirection: 'row',
        justifyContent: 'center'
        // paddingVertical: normalize(25)
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(28),
        marginBottom: 10,
        borderRadius: 13,
        elevation: 3,
        backgroundColor: '#E15220',
    },
    text: {
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'graphik-medium',
        fontSize: '1.2rem',
        textAlign:'center',
    },
    logoutContainer:{
        marginBottom:'2rem'
    },
    appVersion: {
        letterSpacing: 0.25,
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '.7rem',
        textAlign:'center',
    },

});
