import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, StatusBar, Image, Pressable } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import PageLoading from '../../shared/PageLoading';
import Constants from 'expo-constants';
import {
    getGlobalLeadersByDate,
} from '../CommonSlice';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import TopLeadersModal from '../../shared/TopLeadersModal';
import { formatNumber, isTrue } from '../../utils/stringUtl';
import { Ionicons } from '@expo/vector-icons';
import OtherMonthlyLeaders from '../../shared/OtherMonthlyLeaders';


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
                        <Text style={styles.prizeHeaderText}>Monthly Leaders</Text>
                        <Pressable style={styles.prizeContainer}>
                            <Text style={styles.prizeTitle} onPress={() => setModalVisible(true)}>Prize pool</Text>
                            <Ionicons name="information-circle-outline" size={16} color="#FFFF" style={styles.icon} />
                        </Pressable>
                    </View>
                    <MonthlyGlobalLeaderboard leaders={leaders} />
                    <TopLeadersModal setModalVisible={setModalVisible} modalVisible={modalVisible} />
                </ScrollView>
            </LinearGradient>
        </View>
    )
}


function MonthlyGlobalLeaderboard({ leaders }) {
    return (
        <View style={styles.global}>
            <MonthlyTopLeaders leaders={leaders} />
            <LinearGradient
                colors={['#F5870F', '#770D0F']}
                style={styles.rankLinear}
            >
                <Text style={styles.linearInfo}>Climb up th leaderboard to win cash prizes at the end of the month. Click on prize pool above to see cash prizes to be won</Text>
                {/* <Text style={styles.rankText}>Your current rank</Text>
                <View style={styles.pointPosition}>
                    <Text style={styles.userPoint}>95pts</Text>
                    <View style={styles.userPositionContainer}>
                        <Text style={styles.userPosition}>13</Text>
                    </View>
                </View> */}
            </LinearGradient>
            <OtherMonthlyLeaders leaders={leaders} otherStyles={styles.otherLeaders} />
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
            <MonthlyLeader
                position={formatNumber(3)}
                name={`${thirdLeader.username}`}
                point={`${formatNumber(thirdLeader.points ? `${thirdLeader.points}` : 0)} pts`}
                avatar={thirdLeader.avatar}
                avatarProp={styles.thirdAvatar}
                positionProp={styles.thirdPosition}
                source={require("../../../assets/images/month-crown.png")}
                crownProp={styles.crowns}
            />
            <MonthlyLeader
                position={formatNumber(1)}
                name={`${firstLeader.username}`}
                point={`${formatNumber(firstLeader.points ? `${firstLeader.points}` : 0)} pts`}
                avatar={firstLeader.avatar}
                avatarProp={styles.avatar}
                positionProp={styles.winnerPosition}
                source={require("../../../assets/images/month-winner-crown.png")}
                crownProp={styles.winnerCrown}

            />
            <MonthlyLeader
                position={formatNumber(2)}
                name={`${secondLeader.username}`}
                point={`${formatNumber(secondLeader.points ? `${secondLeader.points}` : 0)} pts`}
                avatar={secondLeader.avatar}
                avatarProp={styles.secondAvatar}
                positionProp={styles.secondPosition}
                source={require("../../../assets/images/month-crown.png")}
                crownProp={styles.crowns}

            />
        </View>
    )
}

function MonthlyLeader({ avatar, position, positionProp, name, point, crownProp, avatarProp, source }) {
    return (
        <View style={styles.winner}>
            <Image
                style={crownProp}
                source={source}
            />
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
        justifyContent: 'space-between',
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
        marginRight: '.2rem'
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
        fontSize: '0.6rem',
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
        marginTop:'1rem',
        marginBottom:'2rem'
    },
    linearInfo: {
        color: '#FFFF',
        fontSize: '0.65rem',
        fontFamily: 'graphik-medium',
        textAlign:'center',
        lineHeight:'1rem'
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
        borderRadius: 50,
        borderWidth: 1,
        borderColor: '#A32725',
        marginLeft:'.4rem',
        padding:'.4rem'
    },
    userPosition: {
        color: '#FFFF',
        fontSize: '0.6rem',
        fontFamily: 'graphik-medium',
    },

});
