import React, { useEffect } from "react";
import { Image, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import normalize from "../../utils/normalize";
import { isTrue } from "../../utils/stringUtl";
import { challengeTopLeaders } from "../Games/GameSlice";

const ChallengeWeeklyTopLeaders = () => {
    const dispatch = useDispatch();
    const challengeLeaders = useSelector(state => state.game.challengeLeaders)



    useEffect(() => {
        dispatch(challengeTopLeaders());
    }, [])

    return (
        <View>
            <Text style={styles.topChallengersHeader}>Top Challengers</Text>
            <TopWeeklyChallengers challengeLeaders={challengeLeaders} />
        </View>
    )
}

const TopWeeklyChallengers = ({ challengeLeaders }) => {
    const topLeaders = challengeLeaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { username: "..." };
    const secondLeader = topLeaders[1] ?? { username: "..." };
    const thirdLeader = topLeaders[2] ?? { username: "..." };

    return (
        <View style={styles.topChallengersContainer}>

            {challengeLeaders.length > 0 ?
                <>
                    <TopWeeklyChallenger
                        trophyImageUrl={require('../../../assets/images/third-crown.png')}
                        stageImageUrl={require("../../../assets/images/third-stage.png")}
                        username={thirdLeader.username}
                        avatar={thirdLeader.avatar}

                    />
                    <TopWeeklyChallenger
                        trophyImageUrl={require('../../../assets/images/first-crown.png')}
                        stageImageUrl={require("../../../assets/images/first-stage.png")}
                        username={firstLeader.username}
                        avatar={firstLeader.avatar}

                    />
                    <TopWeeklyChallenger
                        trophyImageUrl={require('../../../assets/images/second-crown.png')}
                        stageImageUrl={require("../../../assets/images/second-stage.png")}
                        username={secondLeader.username}
                        avatar={secondLeader.avatar}

                    />
                </>
                :
                <></>

            }

        </View>
    )
}

const TopWeeklyChallenger = ({ username, avatar, stageImageUrl, trophyImageUrl }) => {

    return (
        <View style={styles.topChallengerContainer}>
            <Image
                source={trophyImageUrl}
                style={styles.crown}
            />
            <Image
                source={isTrue(avatar) ? { uri: avatar } : require("../../../assets/images/user-icon.png")}
                style={styles.avatar}
            />
            <Text style={styles.leaderUsername}>{username}</Text>
            <Image
                source={stageImageUrl}
                style={styles.stage}
            />
        </View>
    )
}
export default ChallengeWeeklyTopLeaders;

const styles = EStyleSheet.create({
    topChallengersHeader: {
        fontSize: '.9rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        marginVertical: normalize(10)
    },
    topChallengersContainer: {
        backgroundColor: '#701F88',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: normalize(15),
        alignItems: 'flex-end',
        borderRadius: 15,
        paddingHorizontal: normalize(5)
    },
    topChallengerContainer: {
        alignItems: 'center'
    },
    crown: {
        width: normalize(45),
        height: normalize(45),
    },
    avatar: {
        width: normalize(45),
        height: normalize(45),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    leaderUsername: {
        fontSize: '.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginTop: normalize(3),
        width: normalize(65),
        textAlign: 'center'
    }
})