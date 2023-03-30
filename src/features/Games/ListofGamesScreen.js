import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from "react-redux";
import LottieAnimations from "../../shared/LottieAnimations";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import Constants from 'expo-constants';
import { isTrue } from "../../utils/stringUtl";
import { setGameMode, setGameType } from "./GameSlice";
import { useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';




const ListofGamesScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);

    return (
        <LinearGradient
            colors={['#072169', '#752A00']}
            start={[0.5, 0]}
            end={[0.5, 1]}
            style={styles.container}
        >
            <ScrollView >
                <View style={styles.gamesContainer}>
                    <ChallengeCard />
                    <TriviaStakingCard />
                </View>
            </ScrollView>
        </LinearGradient>

    )
}

const ChallengeCard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);
    const gameMode = useSelector(state => state.common.gameModes[1]);
    const gameType = useSelector(state => state.common.gameTypes[0]);

    const selectChallengeMode = () => {
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        navigation.navigate('SelectGameCategory')

    }

    return (
        <View style={styles.cardContainer}>
            <View style={styles.avatarContainer}>
                <Image
                    source={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}
                    style={styles.avatar}
                />
                <Image
                    source={require('../../../assets/images/versus.png')}
                    style={styles.versus}
                />
                <Image
                    source={require('../../../assets/images/question.png')}
                    style={styles.avatar}
                />
            </View>
            <Text style={styles.title}>Challenge a friend</Text>
            <Pressable style={styles.button} onPress={selectChallengeMode}>
                <Text style={styles.playText}>Play now</Text>
            </Pressable>
        </View>
    )
}

const TriviaStakingCard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const gameMode = useSelector(state => state.common.gameModes[0]);
    const gameType = useSelector(state => state.common.gameTypes[0]);

    const selectChallengeMode = () => {
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        navigation.navigate('SelectGameCategory')

    }

    return (
        <View style={styles.triviaContainer}>
            <View style={styles.avatarContainer}>
                <Image
                    source={require('../../../assets/images/quiz.png')}
                    style={styles.quiz}
                />
            </View>
            <Text style={styles.title}>Trivia Staking</Text>
            <Pressable style={styles.button} onPress={selectChallengeMode}>
                <Text style={styles.playText}>Play now</Text>
            </Pressable>
        </View>
    )
}

export default ListofGamesScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#072169',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(30)
    },
    gamesContainer: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
    },
    cardContainer: {
        backgroundColor: '#FAC502',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(18),
        display: 'flex',
        alignItems: 'center',
        borderRadius: 13,
        width: responsiveScreenWidth(42),
        justifyContent: 'flex-end'
    },
    triviaContainer: {
        backgroundColor: '#eab676',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(18),
        display: 'flex',
        alignItems: 'center',
        borderRadius: 13,
        width: responsiveScreenWidth(42)

    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    avatar: {
        width: responsiveScreenWidth(12),
        height: responsiveScreenWidth(12),
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#fff"
    },
    quiz: {
        width: responsiveScreenWidth(15),
        height: responsiveScreenWidth(15),
    },
    versus: {
        width: responsiveScreenWidth(7),
        height: responsiveScreenWidth(10),
        marginHorizontal: '.5rem'
    },
    title: {
        fontSize: '.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginVertical: 23,
        width: responsiveScreenWidth(35),
        textAlign: 'center'
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(28),
        borderRadius: 20,
        elevation: 10,
        backgroundColor: '#EF2F55'
    },
    playText: {
        fontSize: '.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
})