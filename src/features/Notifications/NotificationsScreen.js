import React, { useState, useEffect } from "react";
import { Text, View, ScrollView, Pressable, StatusBar, ImageBackground, Dimensions, Platform, ActivityIndicator, RefreshControl } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import { getUser, getUserNotifications, markNotificationRead } from "../Auth/AuthSlice";
import normalize from "../../utils/normalize";
import AppButton from '../../shared/AppButton';
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import LottieAnimations from "../../shared/LottieAnimations";
import PageLoading from "../../shared/PageLoading";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";

const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

const NotificationsScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector(state => state.auth.user)
    // console.log(user)

    const notifications = useSelector(state => state.auth.userNotifications)
    console.log(notifications)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [refreshing, setRefreshing] = useState(false);
    const [showText, setShowText] = useState(true);
    const [clicked, setClicked] = useState(false)
    const [clicking, setClicking] = useState(false)

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        dispatch(getUserNotifications());
        wait(2000).then(() => setRefreshing(false));

    }, []);
    // useEffect(() => {
    //     // Change the state every second or the time given by User.
    //     const interval = setInterval(() => {
    //         setShowText((showText) => !showText);
    //     }, 2000);
    //     return () => clearInterval(interval);
    // }, []);

    const markAllAsRead = () => {
        setClicking(true)
        dispatch(markNotificationRead("all")).then(() => {
            setClicking(false)
            setClicked(true)
        });
    }

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getUser());
            dispatch(getUserNotifications()).then(() => setLoading(false));

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
            backgroundColor='#FFE900'
            spinnerColor="000000"
        />
    }


    return (
        <ImageBackground source={require('../../../assets/images/studio-illustration.jpg')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
            <ScrollView style={styles.container}
             refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#000000"
                />
            }
            >
                <Pressable style={styles.markAllButton} onPress={markAllAsRead}>
                    <Text style={styles.markText}>Mark all as read</Text>
                    {clicking ? 
                        <ActivityIndicator size="small" color="#072169" />
                        :
                        <Ionicons name='checkmark-circle' color="#072169" size={18} />
                    }
                </Pressable>

                <View style={styles.emojiContainer}>
                    <LottieAnimations
                        animationView={require('../../../assets/bell.json')}
                        height={normalize(150)}
                    />
                </View>
                {notifications.length > 0 ?
                    <View style={styles.notificationsContainer}>
                        {/* <> */}
                        {notifications.map((notification, i) => <Notification key={i} notification={notification}
                            // index={i + 1}
                            moment={moment}
                            showText={showText}
                            clicked={clicked}
                            setClicked={setClicked}
                        />)}
                    </View>
                    :
                    <View style={styles.noNotificationContainer}>
                        <Text style={styles.noNotification}>No Notification available</Text>
                    </View>
                }
            </ScrollView>

        </ImageBackground>

    )
}

const Notification = ({ notification, moment, showText, clicked, setClicked }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
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
        <View style={styles.headNotificationContainer}>
            {notification.read_at !== null || clicked ?
                <View style={styles.checkContainer}>
                    <Ionicons name='checkmark-circle' color="#072169" size={22} />

                </View>
                :
                <View style={styles.bellContainer}>
                    <Ionicons name='notifications-circle' color="#EF2F55" size={22} />
                </View>
            }
            <View style={styles.notificationContainer}>
                <Pressable style={[styles.notificationTitleContainer, notification.read_at !== null || clicked ? styles.clicked : {}]} onPress={notificationAction}>
                    <Text style={[styles.notificationTitle, notification.read_at !== null || clicked ? styles.clickedText : {}]}>{notification.data.title}</Text>
                </Pressable>
                <View style={styles.notificationTimeContainer}>
                    <Text style={styles.notificationTime}>From {moment(notification.created_at).fromNow()}</Text>
                </View>
            </View>
        </View>
    )
}
export default NotificationsScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        // paddingBottom: normalize(18),
        paddingHorizontal: normalize(18)
    },
    imageContainer: {
        flex: 1,
    },
    emojiContainer: {
        alignItems: 'center',
    },
    notificationsContainer: {
        // backgroundColor: '#072169',
        // marginHorizontal: normalize(18),
        // paddingRight: normalize(50),
        // paddingLeft: normalize(13),
        alignItems: 'center',
        paddingBottom: normalize(35),
        borderRadius: 15,
    },
    headNotificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: normalize(25),

    },
    notificationContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start',

    },
    notificationTimeContainer: {
        marginRight: '1rem',
        marginTop: '.2rem',
        marginLeft: 'auto',
        backgroundColor: "#072169",
        paddingHorizontal: '.8rem',
        paddingVertical: normalize(3),
        borderRadius: 30,
        opacity: 0.6
    },
    notificationTime: {
        fontFamily: 'graphik-medium',
        fontSize: '.65rem',
        color: '#FFFF',
        textAlingn: 'center',
        fontStyle: 'italic',
        // opacity: 0.8
    },
    notificationTitleContainer: {
        width: '16rem',
        borderWidth: 1,
        borderColor: '#FAC502',
        paddingVertical: Platform.OS === 'ios' ? normalize(8) : normalize(9),
        borderRadius: 30,
        paddingHorizontal: normalize(15),
        backgroundColor: '#FFFF',

    },
    notificationTitle: {
        fontFamily: 'graphik-medium',
        fontSize: '.75rem',
        color: '#000000',
        textAlingn: 'center',
        lineHeight: '1.1rem',
    },
    clickedText: {
        fontFamily: 'graphik-medium',
        fontWeight: '700',
        fontSize: '.75rem',
        color: '#000000',
        textAlingn: 'center',
        lineHeight: '1.1rem',
        fontStyle: 'italic',
        opacity: 0.7
    },
    clicked: {
        opacity: 0.75,
        backgroundColor: "#FFFF"
    },
    noNotificationContainer: {
        justifyContent: 'center',
        alignItems: 'center'

    },
    noNotification: {
        fontFamily: 'graphik-medium',
        fontSize: '1rem',
        color: '#FFFF',
        textAlingn: 'center',

    },
    bellContainer: {
        backgroundColor: "#072169",
        borderRadius: 100,
        paddingLeft: normalize(3),
        marginRight: '.6rem',
        marginBottom: '1rem'
    },
    checkContainer: {
        backgroundColor: "#FAC502",
        borderRadius: 100,
        paddingLeft: Platform.OS === 'ios' ? normalize(2) : normalize(3),
        marginRight: '.6rem',
        marginBottom: '1rem'
    },
    markAllButton: {
        paddingVertical: '.3rem',
        backgroundColor: '#EF2F55',
        borderRadius: 15,
        width: Platform.OS === 'ios' ? '6.5rem' : '7rem',
        marginLeft:'auto',
        marginTop:'1rem',
        backgroundColor:'#FFE900',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center'
    },
    markText: {
        fontSize: '.65rem',
        color: '#000000',
        fontFamily: 'graphik-medium',
        marginRight:normalize(4)

    },
})