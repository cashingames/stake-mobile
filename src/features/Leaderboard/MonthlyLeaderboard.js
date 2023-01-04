import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StatusBar } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import PageLoading from '../../shared/PageLoading';
import OtherLeaders from '../../shared/OtherLeaders';
import {
    getGlobalLeadersByDate,
} from '../CommonSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../../shared/LottieAnimations';
import MonthlyLeader from '../../shared/MonthlyLeader';
import TopLeadersModal from '../../shared/TopLeadersModal';
import { formatNumber } from '../../utils/stringUtl';
// import MonthlyTopLeaders from '../../shared/MonthlyTopLeaders';


export default function MonthlyLeaderboard({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const leaders = useSelector(state => state.common.globalLeadersbyDate)
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);

    // const startDate = getFirstDayOfMonth(2022, 11);
    // const endDate = getLastDayOfMonth(2022, 11);
    const date = new Date();
    function getLastDayOfMonth(year, month) {
        return new Date(year, month + 1, 0);
    }
    function getFirstDayOfMonth(year, month) {
        return new Date(year, month, 1);
    }

    const startDate = getFirstDayOfMonth(
        date.getFullYear(),
        date.getMonth(),
    );

    const endDate = getLastDayOfMonth(
        date.getFullYear(),
        date.getMonth(),
    );


    useEffect(() => {
        dispatch(getGlobalLeadersByDate({
            startDate,
            endDate
        })).then(() => setLoading(false));
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getGlobalLeadersByDate({
                startDate,
                endDate
            }));
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setTranslucent(true)
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );

    if (loading) {
        return <PageLoading spinnerColor="#0000ff" backgroundColor='#FCAB00'
        />
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <Text style={styles.prizeTitle} onPress={() => setModalVisible(true)}> View prize pool</Text>
                <View style={styles.animation}>
                    <LottieAnimations
                        animationView={require('../../../assets/gamepadii.json')}
                        width={normalize(200)}
                        height={normalize(200)}
                    />
                </View>
                <Text style={styles.title}>Top Players for the month</Text>
                {/* <Text style={styles.prizeTitle} onPress={() => setModalVisible(true)}> View prize pool</Text> */}
                <MonthlyGlobalLeaderboard leaders={leaders} />
                <TopLeadersModal setModalVisible={setModalVisible} modalVisible={modalVisible} />
            </ScrollView>
        </View>
    )
}


function MonthlyGlobalLeaderboard({ leaders }) {
    return (
        <View style={styles.global}>
            <MonthlyTopLeaders leaders={leaders} />
            <OtherLeaders leaders={leaders} otherStyles={styles.otherLeaders} />
        </View>

    )
}

function MonthlyTopLeaders({ leaders }) {
    const topLeaders = leaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { username: "..." };
    const secondLeader = topLeaders[1] ?? { username: "..." };
    const thirdLeader = topLeaders[2] ?? { username: "..." };
    return (
        <View style={styles.contentContainer}>
            <View style={styles.content}>
                <MonthlyLeader
                    podPosition={require('../../../assets/images/month-pod3.png')}
                    name={`${thirdLeader.username}`}
                    point={`${formatNumber(thirdLeader.points ? `${thirdLeader.points}` : 0)} pts`}
                    avatar={thirdLeader.avatar}
                    styleProp={styles.others}
                    avatarProp={styles.otherAvatar}
                    stage={styles.stage}
                />
                <MonthlyLeader
                    podPosition={require('../../../assets/images/month-pod1.png')}
                    name={`${firstLeader.username}`}
                    point={`${formatNumber(firstLeader.points ? `${firstLeader.points}` : 0)} pts`}
                    avatar={firstLeader.avatar}
                    styleProp={styles.winner}
                    avatarProp={styles.avatar}
                    stage={styles.winnerStage}

                />
                <MonthlyLeader
                    podPosition={require('../../../assets/images/month-pod2.png')}
                    name={`${secondLeader.username}`}
                    point={`${formatNumber(secondLeader.points ? `${secondLeader.points}` : 0)} pts`}
                    avatar={secondLeader.avatar}
                    styleProp={styles.others}
                    avatarProp={styles.otherAvatar}
                    stage={styles.stage}

                />
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    contentContainer: {
        display: 'flex',
        backgroundColor: '#5d5fef',
        flexDirection: 'column',
        paddingTop: responsiveScreenWidth(3.5),
        paddingHorizontal: responsiveScreenWidth(7),
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 1.5,
        borderColor: Platform.OS === 'ios' ? '#E0E0E0' : '#FFFF'
    },
    prizeTitle: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textDecoration: 'underline',
        marginLeft: 'auto',
        marginTop: normalize(30)
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#5d5fef',
        borderRadius: 20,
        paddingHorizontal: normalize(30),
        paddingVertical: normalize(18),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonClose: {
        marginLeft: 'auto',
        marginBottom: normalize(20)
    },
    closeStyle: {
        fontSize: '0.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    modalItems: {
        marginTop: normalize(25)
    },
    resultContainer: {
        alignItems: 'center'
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(10)

    },
    modalWinnerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(18)
    },
    modalTopText: {
        fontSize: '1rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginBottom: normalize(10)
    },
    winnerItemText: {
        fontSize: '0.9rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
    },
    itemText: {
        fontSize: '0.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: responsiveScreenWidth(4),
    },
    title: {
        fontSize: '.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        textAlign: 'center'
    },
    winner: {
        alignItems: 'center',
    },
    others: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 75
    },
    avatar: {
        width: normalize(55),
        height: normalize(55),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    otherAvatar: {
        width: normalize(40),
        height: normalize(40),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '2rem'
    },
    viewText: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    stage: {
        width: normalize(88),
        height: normalize(88),
    },
    winnerStage: {
        width: normalize(98),
        height: normalize(98),
    },


    container: {
        flex: 1,
        backgroundColor: '#FCAB00',
        paddingHorizontal: normalize(18)
    },
    contentContainer: {
        display: 'flex',
        backgroundColor: '#5d5fef',
        flexDirection: 'column',
        paddingTop: responsiveScreenWidth(3.5),
        paddingHorizontal: responsiveScreenWidth(2),
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 1.5,
        borderColor: Platform.OS === 'ios' ? '#E0E0E0' : '#FFFF'
    },
    animation: {
        alignItems: 'center'
    },
    global: {
        paddingHorizontal: normalize(15),
        marginBottom: normalize(10),
    },
    title: {
        fontSize: '0.9rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        lineHeight: '2rem',
        textAlign: 'center',
        marginVertical: normalize(10)
    },
    dateRange: {
        borderRadius: 5,
        borderColor: '#CDD4DF',
        borderWidth: 1,
        alignItems: 'center',
        marginBottom: responsiveScreenWidth(5),
        marginTop: responsiveScreenWidth(3)
    },
    otherLeaders: {
        backgroundColor: '#5d5fef',
    },
});
