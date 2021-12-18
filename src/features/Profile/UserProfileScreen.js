import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';  
import { TouchableOpacity } from 'react-native-gesture-handler';
import {useSelector } from 'react-redux';
import { isTrue } from '../../utils/stringUtl';
import { backendUrl } from '../../utils/BaseUrl';





export default function UserProfileScreen({ navigation }) {


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
    return (
        <View style={styles.userAvatar}>
              <Image
                      style={styles.avatar}
                    source={isTrue(user.avatar) ? { uri: `${backendUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}
                />
            <TouchableOpacity style={styles.camera}>
                <Ionicons name="camera-sharp" size={26} color="#FFFF" />
            </TouchableOpacity>
        </View>
    )
}

const ProfileTab = ({ tabName, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} style={styles.profileTab}>
            <Text style={styles.tabText}>{tabName}</Text>
            <Ionicons name="chevron-forward-outline" size={20} color="#524D4D" />
        </TouchableOpacity >
    )
}

const ProfileTabs = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.profileTabs}>
            <ProfileTab tabName='Edit Details' onPress={() =>  navigation.navigate('ProfileRouter', { screen: 'EditDetails' })} />
            <ProfileTab tabName='Change Password' onPress={() => navigation.navigate('ProfileRouter' , { screen: 'ChangePassword' })} />
            <ProfileTab tabName='Achievements' onPress={() => navigation.navigate('ProfileRouter' , { screen:'AchievementsMilestone' })} />
            <ProfileTab tabName='Stats' onPress={() => navigation.navigate('ProfileRouter', { screen: 'UserStats'  })} />
            <ProfileTab tabName='Bank Details' onPress={() => navigation.navigate('BankDetails')} />
            <ProfileTab tabName='Settings' onPress={() => navigation.navigate('Dashboard')} />
        </View>
    )
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        // marginVertical: normalize(20)
    },
    contentContainer: {
        backgroundColor: '#F8F9FD',
    },
    content: {
        marginHorizontal: normalize(18),
        paddingVertical: normalize(25),
        marginBottom: normalize(20)

    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },
    userAvatar: {
        flexDirection: 'row',
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
        marginRight: normalize(30)
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
        paddingVertical: normalize(15)
    },
    tabText: {
        fontSize: normalize(14),
        fontFamily: 'graphik-regular',
        color: '#151C2F',
    },
    profileTabs: {
        paddingVertical: normalize(25)
    }

});
