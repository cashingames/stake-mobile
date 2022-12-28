import React, { useEffect } from "react";
import { useFocusEffect } from "@react-navigation/native";
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
            <Text style={styles.topChallengersHeader}>Top Challengers</Text>
            <TopWeeklyChallengers challengeLeaders={challengeLeaders} />
        </View>
        </Animated.View>


    )
}

const TopWeeklyChallengers = ({ challengeLeaders }) => {
    const topLeaders = challengeLeaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { username: "..." };
    const secondLeader = topLeaders[1] ?? { username: "..." };
    const thirdLeader = topLeaders[2] ?? { username: "..." };

    return (
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
    )
}

const TopWeeklyChallenger = ({ username, avatar, stageImageUrl, trophyImageUrl, styleProp, avatarProp,crownProp }) => {

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
        marginRight: normalize(10)
    },
    topChallengersHeader: {
        fontSize: '.9rem',
        lineHeight: '1.3rem',
        color: '#151C2F',
        fontFamily: 'graphik-bold',
        marginBottom: normalize(8)
    },
    topChallengersContainer: {
        backgroundColor: '#701F88',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: normalize(10),
        alignItems: 'flex-end',
        borderRadius: 15,
        paddingLeft: normalize(5),
    },
    topChallengerContainer: {
        alignItems: 'center'
    },
    crown: {
        width: normalize(40),
        height: normalize(40),
    },
    otherCrown: {
        width: normalize(30),
        height: normalize(30),
    },
    avatar: {
        width: normalize(55),
        height: normalize(55),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    otherAvatar: {
        width: normalize(35),
        height: normalize(35),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    leaderUsername: {
        fontSize: '.65rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginTop: Platform.OS === 'ios' ? normalize(4) : normalize(2),
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
})