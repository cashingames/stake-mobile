import React, { useState } from "react";
import { Text, View, ScrollView, Pressable, StatusBar } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import { getUser, getUserNotifications, markNotificationRead } from "../Auth/AuthSlice";
import normalize from "../../utils/normalize";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import LottieAnimations from "../../shared/LottieAnimations";
import PageLoading from "../../shared/PageLoading";

const NotificationsScreen = ({ navigation }) => {
    const user = useSelector(state => state.auth.user)
    console.log(user)

    const notifications = useSelector(state => state.auth.userNotifications)
    console.log(notifications)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)

    useFocusEffect(
        React.useCallback(() => {
            console.log('here')

            dispatch(getUser());
            dispatch(getUserNotifications()).then(() => setLoading(false));
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('dark-content');
            return () => {
                StatusBar.setTranslucent(true)
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );

    if (loading) {
        return <PageLoading
            backgroundColor='#F2F5FF'
            spinnerColor="000000"
        />
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.emojiContainer}>
                <LottieAnimations
                    animationView={require('../../../assets/bell.json')}
                    height={normalize(150)}
                />
            </View>
            {notifications.length > 0 ?
                <>
                    {notifications.map((notification, i) => <Notification key={i} notification={notification}
                        index={i + 1}
                    />)}
                </>
                :
                <View style={styles.noNotificationContainer}>
                    <Text style={styles.noNotification}>No Notification available</Text>
                </View>
            }


        </ScrollView>
    )
}

const Notification = ({ notification, index }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const [clicked, setClicked] = useState(false)
    const notificationAction = () => {
        if (notification.data.action_type === "CHALLENGE") {
            dispatch(markNotificationRead(notification.id)).then(() => setClicked(true));
            dispatch(getUser());
            navigation.navigate('MyChallengesScore', { challengeId: notification.data.action_id })
        }
        dispatch(markNotificationRead(notification.id)).then(() => setClicked(true));
        dispatch(getUser());
    }
    return (
        <View style={styles.notificationContainer}>
            {/* <Text style={styles.notificationIndex}>{index}</Text> */}
            <Pressable style={[styles.notificationTitleContainer, notification.read_at !== null || clicked ? styles.clicked : {}]} onPress={notificationAction}>
                <Text style={styles.notificationTitle}>{notification.data.title}</Text>
            </Pressable>
        </View>
    )
}
export default NotificationsScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5FF',
        paddingHorizontal: normalize(18),
        paddingBottom: normalize(50),
    },
    emojiContainer: {
        alignItems: 'center',
    },
    notificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(10),

    },
    notificationTitleContainer: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingVertical: Platform.OS === 'ios' ? normalize(15) : normalize(12),
        borderRadius: 11,
        paddingHorizontal: normalize(12),
        width: '20rem',
        backgroundColor: '#FFFF',
        elevation: 1.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.2, height: 2 },
        shadowOpacity: 0.2,
    },
    notificationIndex: {
        fontFamily: 'graphik-medium',
        fontSize: '.7rem',
        color: '#000000',
        marginRight: '.6rem'
    },
    notificationTitle: {
        fontFamily: 'graphik-medium',
        fontSize: '.7rem',
        color: '#000000',
        marginRight: '.6rem',
        textAlingn: 'center',
        lineHeight: '1.4rem'
    },
    clicked: {
        opacity: 0.6,
        // backgroundColor:"red"
    },
    noNotificationContainer: {
        justifyContent: 'center',
        alignItems:'center'

    },
    noNotification: {
        fontFamily: 'graphik-medium',
        fontSize: '1rem',
        color: '#000000',
        textAlingn: 'center',

    }
})