import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, ImageBackground } from 'react-native';
import normalize from '../../utils/normalize';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { resetPoints} from "./GameSlice";

export default function GameEndResultScreen({ navigation }) {
    const user = useSelector(state => state.auth.user);
    const pointsGained = useSelector(state => state.game.pointsGained);

    return (

        <ScrollView style={styles.container}>
            <UserResultEmoji userEmoji={require('../../../assets/images/thumbs_up.png')} />
            <Username userName={user.firstName} />
            <UserResultInfo pointsGained={pointsGained} />
            <SeeRank />
            <FinalScore pointsGained={pointsGained} />
            <GameButtons />
        </ScrollView>

    );
}

const UserResultEmoji = ({ userEmoji }) => {
    return (
        <View style={styles.emojiContainer}>
            <Image
                style={styles.emoji}
                source={userEmoji}
            />
        </View>
    )
}

const Username = ({ userName }) => {
    return (
        <View style={styles.nameContainer}>
            <Text style={styles.name}>{userName}</Text>
        </View>
    )
}

const UserResultInfo = ({ pointsGained }) => {
    return (
        <View style={styles.infoContainer}>
            <Text style={styles.info}>you scored {pointsGained} points, Play again to climb up the leaderboard</Text>
        </View>
    )
}

const SeeRank = () => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity
            onPress={() => navigation.navigate('ExtendedLeaderboard')}
            style={styles.goToLeaderboard}
        >
            <View style={styles.seeRank}>
                <Image
                    source={require('../../../assets/images/leaderboard.png')}
                />
                <Text style={styles.seeRankText}>Check the leaderboard to see your rank</Text>
            </View>
        </TouchableOpacity>

    )
}

const FinalScore = ({ pointsGained }) => {
    return (
        <View style={styles.finalScore}>
            <Text style={styles.finalScoreText}>Your final score point is</Text>
            <Text style={styles.point}>{pointsGained}</Text>
        </View>
    )
}

const GameButton = ({ buttonText, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.gameButton}>
                <Text style={styles.buttonText}>{buttonText}</Text>
            </View>
        </TouchableOpacity>
    )
}

const GameButtons = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.gameButtons}>
            <GameButton buttonText='Return to Home'
                onPress={() => navigation.navigate('Home')}
            />
            <GameButton buttonText='Play Again'
                onPress={() => navigation.navigate('GameInProgress')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9C3DB8',
        paddingVertical: normalize(40),
        paddingHorizontal: normalize(18),
        display: 'flex',
        marginTop: normalize(40)
    },
    image: {
        flex: 1,
    },
    emojiContainer: {
        alignItems: 'center',
        marginBottom: normalize(18)
    },
    emoji: {
        width: normalize(66),
        height: normalize(70)
    },
    nameContainer: {
        alignItems: 'center',
        marginBottom: normalize(15)
    },
    name: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(30),
    },
    infoContainer: {
        alignItems: 'center',
        textAlign: 'center',
        marginHorizontal: normalize(25),
        marginBottom: normalize(15)
    },
    info: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        fontSize: normalize(16),
        lineHeight: normalize(24)
    },
    seeRank: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    seeRankText: {
        // textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
    },
    goToLeaderboard: {
        backgroundColor: '#701F88',
        borderRadius: 8,
        padding: normalize(13),
        marginBottom: normalize(15)
    },
    finalScore: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#F9E821',
        padding: normalize(10),
        borderRadius: 16,
        marginBottom: normalize(75)
    },
    finalScoreText: {
        // textAlign: 'center',
        color: '#9236AD',
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
    },
    point: {
        // textAlign: 'center',
        color: '#9236AD',
        fontFamily: 'graphik-bold',
        fontSize: normalize(65),
    },
    gameButton: {
        borderColor: '#FFFF',
        borderWidth: 1,
        width: normalize(130),
        height: normalize(40),
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        display: 'flex',
    },
    gameButtons: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: normalize(50)
    },
    buttonText: {
        textAlign: 'center',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
    }

});
