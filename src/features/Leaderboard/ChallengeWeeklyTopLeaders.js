import React from "react";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { Image, Platform, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch } from "react-redux";
import Animated, { BounceInLeft } from 'react-native-reanimated';
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { isTrue } from "../../utils/stringUtl";
import { challengeTopLeaders } from "../Games/GameSlice";

const ChallengeWeeklyTopLeaders = ({ challengeLeaders }) => {
    const dispatch = useDispatch();

    useFocusEffect(
        React.useCallback(() => {
            console.info("ChallengeWeeklyTopLeaders useFocusEffect");
            dispatch(challengeTopLeaders());
        }, [])
    );

    return (
        <Animated.View style={styles.leaderboard} entering={BounceInLeft.duration(2000)}>
            <View style={styles.container}>
            <View style={styles.leaderboardHeader}>
                <Text style={styles.title}>Top Challengers</Text>
            </View>
                <TopWeeklyChallengers challengeLeaders={challengeLeaders} />
            </View>
        </Animated.View>


    )
}

const TopWeeklyChallengers = ({ challengeLeaders }) => {
    const navigation = useNavigation();

    const topLeaders = challengeLeaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { username: "..." };
    const secondLeader = topLeaders[1] ?? { username: "..." };
    const thirdLeader = topLeaders[2] ?? { username: "..." };

    return (
        <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
                <View></View>
                <Text style={styles.extendedText} onPress={() => navigation.navigate('Leaderboard')}> Click to view more</Text>
            </View>
            <View style={styles.topChallengersContainer}>
                <TopWeeklyChallenger
                    trophyImageUrl={require('../../../assets/images/third-crown.png')}
                    stageImageUrl={require("../../../assets/images/third-stage.png")}
                    username={thirdLeader.username}
                    avatar={thirdLeader.avatar}
                    styleProp={styles.others}
                    avatarProp={styles.otherAvatar}
                    crownProp={styles.otherCrown}
                />
                <TopWeeklyChallenger
                    trophyImageUrl={require('../../../assets/images/first-crown.png')}
                    stageImageUrl={require("../../../assets/images/first-stage.png")}
                    username={firstLeader.username}
                    avatar={firstLeader.avatar}
                    styleProp={styles.winner}
                    avatarProp={styles.avatar}
                    crownProp={styles.crown}
                />
                <TopWeeklyChallenger
                    trophyImageUrl={require('../../../assets/images/second-crown.png')}
                    stageImageUrl={require("../../../assets/images/second-stage.png")}
                    username={secondLeader.username}
                    avatar={secondLeader.avatar}
                    styleProp={styles.others}
                    avatarProp={styles.otherAvatar}
                    crownProp={styles.otherCrown}
                />
            </View>
        </View>
    )
}

const TopWeeklyChallenger = ({ username, avatar, stageImageUrl, trophyImageUrl, styleProp, avatarProp, crownProp }) => {

    return (
        <View style={styles.topChallengerContainer}>
            <View style={styleProp}>
                <Image
                    source={trophyImageUrl}
                    style={crownProp}
                />
                <Image
                    source={isTrue(avatar) ? { uri: avatar } : require("../../../assets/images/user-icon.png")}
                    style={avatarProp}
                />
                <Text style={styles.leaderUsername}>{username}</Text>
            </View>
            <Image
                source={stageImageUrl}
                style={styles.stage}
            />
        </View>
    )
}
export default ChallengeWeeklyTopLeaders;

const styles = EStyleSheet.create({
    container: {
        // marginRight: normalize(10)
    },
    leaderboardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(3),
    },
    title: {
        fontSize: '.8rem',
        lineHeight: '1.3rem',
        color: '#151C2F',
        fontFamily: 'graphik-bold',
        marginLeft:'.5rem'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    topChallengersHeader: {
        textAlign: 'center',
        fontSize: '.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '2rem'
    },
    viewText: {
        fontSize: '.65rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    contentContainer: {
        backgroundColor: '#701F88',
        flexDirection: 'column',
        paddingTop: responsiveScreenWidth(3),
        paddingHorizontal: responsiveScreenWidth(2),
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 1.5,
        borderColor: Platform.OS === 'ios' ? '#E0E0E0' : '#FFFF'
    },
    topChallengersContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: responsiveScreenWidth(3.5),
        alignItems: 'flex-end',
    },
    topChallengerContainer: {
        alignItems: 'center'
    },
    crown: {
        width: normalize(33),
        height: normalize(33),
    },
    otherCrown: {
        width: normalize(23),
        height: normalize(23),
    },
    avatar: {
        width: normalize(48),
        height: normalize(48),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    otherAvatar: {
        width: normalize(30),
        height: normalize(30),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    leaderUsername: {
        fontSize: '.65rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginTop: Platform.OS === 'ios' ? normalize(3) : normalize(2),
        width: responsiveScreenWidth(22),
        textAlign: 'center'
    },
    winner: {
        // marginBottom : normalize(35),
        alignItems: 'center',
        // position:'absolute',
        // bottom:100
    },
    others: {
        // marginTop : normalize(10),
        alignItems: 'center',
        position: 'absolute',
        bottom: 75
    },
    stage: {
        width: normalize(98),
        height: normalize(98),
    },
    extendedText: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        marginRight:'.3rem',
        textDecoration: 'underline',
    },
    extended: {
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#701F88',
        justifyContent: 'center',
        paddingVertical: normalize(5)
    },
})