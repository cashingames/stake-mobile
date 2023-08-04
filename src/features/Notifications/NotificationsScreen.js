import React, { useEffect, useState } from "react";
import EStyleSheet from "react-native-extended-stylesheet";
import { Text, View, ScrollView, Pressable, ImageBackground, Platform, ActivityIndicator, Image } from 'react-native';
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "../Auth/AuthSlice";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import PageLoading from "../../shared/PageLoading";
import moment from "moment";
import { getUserNotifications, markNotificationRead } from "../CommonSlice";
import AppButton from "../../shared/AppButton";


const NotificationsScreen = ({ navigation }) => {
    const notifications = useSelector(state => state.common.userNotifications)
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [clicking, setClicking] = useState(false)
    const [readAll, setReadAll] = useState(false)


    const markAllAsRead = () => {
        setClicking(true)
        dispatch(markNotificationRead('all')).then(() => {
            setClicking(false)
            setReadAll(true)
        });
    }

    useEffect(() => {
        dispatch(getUserNotifications()).then(() => setLoading(false));
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getUserNotifications());
        }, [])
    );

    if (loading) {
        return <PageLoading
            backgroundColor='#FFF'
            spinnerColor="072169"
        />
    }


    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }} resizeMethod="resize">

            <ScrollView style={notifications?.length > 0 ? styles.container : {}} contentContainerStyle={notifications?.length <= 0 ? styles.noContainer : {}}>

                {notifications?.length > 0 ?
                    <View style={styles.notificationsContainer}>
                        {/* <> */}
                        {notifications.map((notification, i) => <Notification key={i} notification={notification}
                            // index={i + 1}
                            moment={moment}
                            readAll={readAll}
                        />)}
                    </View>
                    :

                    <View style={styles.noNotificationContainer}>
                        <Image
                            source={require('../../../assets/images/bell-dynamic-color.png')}
                            style={styles.noAvatar}
                        />
                        <Text style={styles.noNotification}>Nothing yet, check back later</Text>
                    </View>

                }
            </ScrollView>
            {notifications?.length > 0 ?
                <AppButton text={clicking ? <ActivityIndicator size="small" color="#FFF" /> : 'Mark all as read'} onPress={markAllAsRead} disabled={clicking} style={styles.markButton} textStyle={styles.buttonText}
                    disabledStyle={styles.disabled} />
                :

                <AppButton text='Okay, got it' onPress={() => navigation.navigate('Home')} style={styles.markButton} textStyle={styles.buttonText}
                    disabledStyle={styles.disabled} />
            }

        </ImageBackground>

    )
}

const Notification = ({ notification, moment, readAll }) => {
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
        <Pressable style={[styles.notificationTitleContainer, notification.read_at !== null || clicked || readAll ? styles.clicked : {}]} onPress={notificationAction}>
            <View style={styles.imageAvatar}>
                <Image
                    source={require('../../../assets/images/bell-dynamic-color.png')}
                    style={styles.avatar}
                />
            </View>
            <Text style={[styles.notificationTitle, notification.read_at !== null || clicked || readAll ? styles.clickedText : {}]}>{notification.data.title}</Text>
            <Text style={styles.notificationTime}>{moment(notification.created_at).fromNow()}</Text>
        </Pressable>
    )
}
export default NotificationsScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(14),
        paddingTop: responsiveScreenWidth(8)
    },
    noContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(14),

    },
    imageContainer: {
        flex: 1,
    },
    imageAvatar: {
        backgroundColor: '#FEECE7',
        borderRadius: 100,
        width: 55,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        width: 30,
        height: 30
    },
    noAvatar: {
        width: 120,
        height: 120
    },
    emojiContainer: {
        alignItems: 'center',
    },
    notificationsContainer: {
        // alignItems: 'center',
        marginBottom: responsiveScreenWidth(40),
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
        fontFamily: 'sansation-bold',
        fontSize: '.75rem',
        color: '#E05C28',
        textAlign: 'center',
        fontStyle: 'italic',
        // opacity: 0.8
    },
    notificationTitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        paddingVertical: Platform.OS === 'ios' ? normalize(13) : normalize(12),
        borderRadius: 13,
        paddingHorizontal: normalize(15),
        backgroundColor: '#FFFF',
        marginBottom: '1rem'

    },
    notificationTitle: {
        fontFamily: 'sansation-regular',
        fontSize: '.9rem',
        color: '#072169',
        textAlign: 'center',
        lineHeight: '1.1rem',
        width: '10rem'
    },
    clickedText: {
        fontFamily: 'sansation-regular',
        fontSize: '.9rem',
        color: '#072169',
        textAlign: 'center',
        lineHeight: '1.1rem',
        width: '10rem'
    },
    clicked: {
        opacity: 0.5,
        backgroundColor: "#FFFF"
    },
    noNotificationContainer: {
        justifyContent: 'center',
        alignItems: 'center'

    },
    noNotification: {
        fontFamily: 'gotham-medium',
        fontSize: '1.3rem',
        color: '#072169',
        textAlign: 'center',

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
        paddingLeft: normalize(2),
        marginRight: '.6rem',
        marginBottom: '1rem'
    },
    markAllButton: {
        paddingVertical: '.3rem',
        borderRadius: 15,
        width: Platform.OS === 'ios' ? '6.5rem' : '7rem',
        marginLeft: 'auto',
        marginVertical: '.7rem',
        backgroundColor: '#072169',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    markText: {
        fontSize: '.65rem',
        color: '#FFF',
        fontFamily: 'gotham-medium',
        marginRight: normalize(4)

    },
    markButton: {
        // backgroundColor: '#E15220',
        marginVertical: 20,
        marginHorizontal: '1rem',
        paddingVertical: normalize(19),
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },
    disabled: {
        backgroundColor: '#EA8663'
    },
})