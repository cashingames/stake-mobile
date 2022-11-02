import React from "react";
import { Image, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../../utils/normalize";

const ChallengeWeeklyTopLeaders = () => {
    return (
        <View>
            <Text style={styles.topChallengersHeader}>Top Challenge Leaders for this week</Text>
            <TopWeeklyChallengers />
        </View>
    )
}

const TopWeeklyChallengers = () => {
    return (
        <View style={styles.topChallengersContainer}>
            <TopWeeklyChallenger
                leaderCrown={require("../../../assets/images/third-crown.png")}
                leaderUsername="Jaybewa"
                leaderStage={require("../../../assets/images/third-stage.png")}
            />
            <TopWeeklyChallenger
                leaderCrown={require("../../../assets/images/first-crown.png")}
                leaderUsername="Jaybewa"
                leaderStage={require("../../../assets/images/first-stage.png")}
            />
            <TopWeeklyChallenger
                leaderCrown={require("../../../assets/images/second-crown.png")}
                leaderUsername="Jaybewa"
                leaderStage={require("../../../assets/images/second-stage.png")}
            />
        </View>
    )
}

const TopWeeklyChallenger = ({ leaderCrown, leaderUsername, leaderStage }) => {
    return (
        <View style={styles.topChallengerContainer}>
            <Image
                source={leaderCrown}
                style={styles.crown}
            />
            <Image
                source={require("../../../assets/images/user-icon.png")}
                style={styles.avatar}
            />
            <Text style={styles.leaderUsername}>{leaderUsername}</Text>
            <Image
                source={leaderStage}
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
        width: normalize(38),
        height: normalize(38),
    },
    avatar: {
        width: normalize(40),
        height: normalize(40),
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