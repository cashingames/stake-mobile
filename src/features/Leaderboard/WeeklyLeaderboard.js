import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StatusBar, Image, Pressable } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import PageLoading from '../../shared/PageLoading';
import Constants from 'expo-constants';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { formatNumber, isTrue } from '../../utils/stringUtl';
import OtherMonthlyLeaders from '../../shared/OtherMonthlyLeaders';
import PrizePoolTitle from '../../shared/PrizePoolTitle';
import { getWeeklyLeadersByDate } from '../CommonSlice';
import analytics from '@react-native-firebase/analytics';


export default function WeeklyLeaderboard({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const leaders = useSelector(state => state.common.weeklyLeaderboard.leaderboard)
    const userRank = useSelector(state => state.common.weeklyLeaderboard.userRank)
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const user = useSelector(state => state.auth.user)


    const today = new Date();
    const startDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 5, 0, 0);
    const endDate = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 21, 59, 0);
    

    const viewPrizePool = async () => {
        await analytics().logEvent("weekly_leaderboard_prize_pool_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        setModalVisible(true)
    }

    useEffect(() => {
        dispatch(getWeeklyLeadersByDate({
            startDate,
            endDate
        })).then(() => setLoading(false));
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getWeeklyLeadersByDate({
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
        return <PageLoading spinnerColor="#0000ff" backgroundColor='#701F88'
        />
    }

    return (
        <View style={styles.linearContainer}>
            <LinearGradient
                colors={['#701F88', '#752A00']}
                style={styles.container}
            >
                <ScrollView>
                    <View style={styles.prizeHeaderContainer}>
                    {/* <PrizePoolTitle setModalVisible={setModalVisible} modalVisible={modalVisible} onPress={viewPrizePool}  /> */}
                    </View>
                    <WeeklyGlobalLeaderboard leaders={leaders} userRank={userRank} />
                </ScrollView>
            </LinearGradient>
        </View>
    )
}


function WeeklyGlobalLeaderboard({ leaders, userRank }) {
    return (
        <View style={styles.global}>
            <WeeklyTopLeaders leaders={leaders} />
            <LinearGradient
                colors={['#F5870F', '#770D0F']}
                style={styles.rankLinear}
            >
                {/* <Text style={styles.linearInfo}>Climb up th leaderboard to win cash prizes at the end of the month. Click on prize pool above to see cash prizes to be won</Text> */}
                <Text style={styles.rankText}>Your current rank</Text>
                <View style={styles.pointPosition}>
                    <Text style={styles.userPoint}>{userRank.points} pts</Text>
                    <View style={[userRank.rank < 999 ? styles.userPositionContainer : styles.userPositionContainer1]}>
                        <Text style={styles.userPosition}>{userRank.rank}</Text>
                    </View>
                </View>
            </LinearGradient>
            <OtherMonthlyLeaders leaders={leaders} otherStyles={styles.otherLeaders} />
        </View>

    )
}

function WeeklyTopLeaders({ leaders }) {
    const topLeaders = leaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { username: "..." };
    const secondLeader = topLeaders[1] ?? { username: "..." };
    const thirdLeader = topLeaders[2] ?? { username: "..." };
    return (
        <View style={styles.contentContainer}>
            <WeeklyLeader
                position={formatNumber(3)}
                name={`${thirdLeader.username}`}
                point={`${formatNumber(thirdLeader.points ? `${thirdLeader.points}` : 0)} pts`}
                avatar={thirdLeader.avatar}
                avatarProp={styles.thirdAvatar}
                positionProp={styles.thirdPosition}
                crownProp={styles.crowns}
            />
            <WeeklyLeader
                position={formatNumber(1)}
                name={`${firstLeader.username}`}
                point={`${formatNumber(firstLeader.points ? `${firstLeader.points}` : 0)} pts`}
                avatar={firstLeader.avatar}
                avatarProp={styles.avatar}
                positionProp={styles.winnerPosition}
                crownProp={styles.winnerCrown}

            />
            <WeeklyLeader
                position={formatNumber(2)}
                name={`${secondLeader.username}`}
                point={`${formatNumber(secondLeader.points ? `${secondLeader.points}` : 0)} pts`}
                avatar={secondLeader.avatar}
                avatarProp={styles.secondAvatar}
                positionProp={styles.secondPosition}
                crownProp={styles.crowns}

            />
        </View>
    )
}

function WeeklyLeader({ avatar, position, positionProp, name, point, crownProp, avatarProp, source }) {
    return (
        <View style={styles.winner}>

            <View style={styles.avatarContainer}>
                <Image
                    style={avatarProp}
                    source={isTrue(avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${avatar}` } : require("../../../assets/images/user-icon.png")}
                />
                <View style={positionProp}>
                    <Text style={styles.position}>{position}</Text>
                </View>
            </View>
            <Text style={styles.leaderName}>{name}</Text>
            <Text style={styles.point}>{point}</Text>
        </View>

    );
}

const styles = EStyleSheet.create({
    contentContainer: {
        display: 'flex',
        flexDirection: 'row',
        marginVertical: '2rem',
        justifyContent: 'space-between',
        alignItems: 'flex-end'
    },
    prizeHeaderContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    prizeContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    prizeHeaderText: {
        fontSize: '1rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    prizeTitle: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textDecoration: 'underline',
        marginLeft: '.2rem'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: responsiveScreenWidth(4),
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: '.7rem'
    },
    crowns: {
        width: 30,
        height: 30,
    },
    winnerCrown: {
        width: 50,
        height: 50,
    },
    winner: {
        alignItems: 'center',

    },
    avatar: {
        width: 120,
        height: 120,
        backgroundColor: '#FFFF',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#FFD700'
    },
    secondAvatar: {
        width: 70,
        height: 70,
        backgroundColor: '#FFFF',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#2D9CDB'
    },
    thirdAvatar: {
        width: 70,
        height: 70,
        backgroundColor: '#FFFF',
        borderRadius: 100,
        borderWidth: 2,
        borderColor: '#9C3DB8'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

    linearContainer: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        paddingVertical: '1rem'
    },
    global: {
        // // paddingHorizontal: normalize(15),
        // marginBottom: normalize(10),
    },
    position: {
        color: '#000000',
        textAlign: 'center',
        fontFamily: 'graphik-bold',
        fontSize: '.6rem'
    },
    secondPosition: {
        backgroundColor: '#2D9CDB',
        width: '.8rem',
        height: '.8rem',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -8
    },
    thirdPosition: {
        backgroundColor: '#9C3DB8',
        width: '.8rem',
        height: '.8rem',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -8
    },
    winnerPosition: {
        backgroundColor: '#FFD700',
        width: '.8rem',
        height: '.8rem',
        borderRadius: 50,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        bottom: -8
    },
    point: {
        color: '#FFFF',
        fontSize: '0.6rem',
        fontFamily: 'graphik-medium',
    },
    leaderName: {
        color: '#FFFF',
        fontSize: '0.7rem',
        fontFamily: 'graphik-medium',
        width: responsiveScreenWidth(22),
        marginBottom: '.2rem',
        textAlign: 'center',

    },
    rankLinear: {
        borderRadius: 18,
        paddingHorizontal: normalize(13),
        paddingVertical: normalize(10),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1rem',
        marginBottom: '2rem'
    },
    linearInfo: {
        color: '#FFFF',
        fontSize: '0.65rem',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
        lineHeight: '1rem'
    },
    rankText: {
        color: '#FFFF',
        fontSize: '0.75rem',
        fontFamily: 'graphik-medium',
    },
    pointPosition: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    userPoint: {
        color: '#FFFF',
        fontSize: '0.6rem',
        fontFamily: 'graphik-medium',
    },
    userPositionContainer: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#A32725',
        marginLeft: '.4rem',
        width: '1.7rem',
        height: '1.7rem',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#752A00',
        // paddingHorizontal:'.1rem',
        // paddingVertical:'.5rem',

    },
    userPositionContainer1: {
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#A32725',
        marginLeft: '.4rem',
        width: '2.2rem',
        height: '2.2rem',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#752A00',
        // paddingHorizontal:'.1rem',
        // paddingVertical:'.5rem',

    },
    userPosition: {
        color: '#FFFF',
        fontSize: '0.6rem',
        fontFamily: 'graphik-medium',
    },

});
