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
import Animated from 'react-native-reanimated';
import { randomEnteringAnimation } from '../../utils/utils';


export default function UserProfileScreen({ navigation }) {

    useApplyHeaderWorkaround(navigation.setOptions);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.content}>
                    <UserAvatar />
                    <ProfileTabs />
                </View>
            </ScrollView>
        </SafeAreaView>
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
            <Image
                style={styles.avatar}
                source={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}

            />
            {!loading ?
                <Pressable style={styles.camera} onPress={pickImage}>
                    <Ionicons name="camera-sharp" size={26} color="#FFFF" />
                </Pressable> : <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    )
}

const ProfileTabs = () => {
    const dispatch = useDispatch();

    const navigation = useNavigation();
    const features = useSelector(state => state.common.featureFlags);
    const isAchievementBadgeFeatureEnabled = features['achievement_badges'] !== undefined && features['achievement_badges'].enabled === true;

    // const onLogout = () => {
    //     dispatch(logoutUser());
    // }

    return (
        <View style={styles.profileTabs}>
            <ProfileTab tabName='Edit Details' onPress={() => navigation.navigate('EditDetails')} />
            <ProfileTab tabName='Change Password' onPress={() => navigation.navigate('ChangePassword')} />
            {/* <ProfileTab tabName='Achievements' onPress={() => navigation.navigate('AchievementsMilestone')} /> */}
            {/* <ProfileTab tabName='Stats' onPress={() => navigation.navigate('UserStats')} /> */}
            <ProfileTab tabName='Bank Details' onPress={() => navigation.navigate('BankDetails')} />
            {/* <Pressable onPress={onLogout}>
                <Text style={styles.logoutText}>Logout</Text>
            </Pressable> */}
        </View>
    )
}


const ProfileTab = ({ tabName, onPress }) => {
    return (
        <Animated.View entering={randomEnteringAnimation().duration(1000)}>
            <Pressable onPress={onPress} style={styles.profileTab}>
                <Text style={styles.tabText}>{tabName}</Text>
                <Ionicons name="chevron-forward-outline" size={20} color="#524D4D" />
            </Pressable >
        </Animated.View>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        // marginVertical: normalize(20)
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
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        marginBottom: normalize(10)
    },
    camera: {
        backgroundColor: '#EF2F55',
        borderRadius: 50,
        padding: normalize(6),
    },
    profileTab: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingVertical: normalize(20)
    },
    tabText: {
        fontSize: '0.93rem',
        fontFamily: 'graphik-regular',
        color: '#151C2F',
    },
    profileTabs: {
        paddingVertical: normalize(25)
    }

});
