import React from "react";
import { Image, Platform, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from "react-redux";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import Constants from 'expo-constants';
import { isTrue } from "../../utils/stringUtl";
import { setGameMode, setGameType } from "./GameSlice";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { LinearGradient } from 'expo-linear-gradient';
import logToAnalytics from "../../utils/analytics";





const GamesListScreen = ({ navigation }) => {

    useFocusEffect(
        React.useCallback(() => {
            if (Platform.OS === "android") {
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor("transparent");
                return;
            }
            StatusBar.setBarStyle('dark-content');
            return () => {
                if (Platform.OS === "android") {
                    StatusBar.setTranslucent(true)
                    return;
                }
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );


    return (
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.gamesContainer}>
                    <ChallengeCard />
                    <TriviaStakingCard />
                </View>
            </ScrollView>
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
        logToAnalytics("trivia_challenge_staking_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            'gamemode': gameMode.displayName,
        })
        navigation.navigate('SelectGameCategory')

    }

    return (
        <Pressable style={styles.cardContainer} onPress={selectChallengeMode}>
            <View style={styles.avatarContainer}>
                <Image
                    source={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}
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
            <Text style={styles.title}>Challenge a player</Text>
            <Pressable style={styles.challengeButton} onPress={selectChallengeMode}>
                <Text style={styles.playText}>Play now</Text>
            </Pressable>
        </Pressable>
    )
}

const TriviaStakingCard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const gameMode = useSelector(state => state.common.gameModes[0]);
    const gameType = useSelector(state => state.common.gameTypes[0]);
    const user = useSelector(state => state.auth.user)


    const selectTriviaMode = () => {
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        logToAnalytics("trivia_staking_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            'gamemode': gameMode.displayName,
        })
        navigation.navigate('SelectGameCategory')

    }

    return (
        <Pressable style={styles.triviaContainer} onPress={selectTriviaMode}>
            <View style={styles.avatarContainer}>
                <Image
                source={require('../../../assets/images/trivia-book.png')}
                style={styles.quiz}
                />
            </View>
            <Text style={styles.title}>Trivia Bet</Text>
            <Pressable style={styles.button} onPress={selectTriviaMode}>
                <Text style={styles.playText}>Play now</Text>
            </Pressable>
        </Pressable>
    )
}

export default GamesListScreen;

const styles = EStyleSheet.create({
    contentContainer: {
        flex: 1,
        backgroundColor: '#F2F5FF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    gamesContainer: {
        display: 'flex',
        flexDirection: 'column',
    },
    cardContainer: {
        backgroundColor: '#FDCCD4',
        borderColor: '#EF2F55',
        borderWidth: 2,
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(18),
        display: 'flex',
        alignItems: 'center',
        borderRadius: 13,
        width: responsiveScreenWidth(65),
        justifyContent: 'flex-end',
        marginBottom: '1rem'
    },
    triviaContainer: {
        backgroundColor: '#ECF7FF',
        borderColor: '#4FAAFD',
        borderWidth: 2,
        borderRadius: 13,        
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(18),
        display: 'flex',
        alignItems: 'center',
        width: responsiveScreenWidth(65),
        justifyContent: 'flex-end',
        marginBottom: '1rem'

    },
    avatarContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    avatar: {
        width: responsiveScreenWidth(15),
        height: responsiveScreenWidth(15),
        borderRadius: 50,
        borderWidth: 2,
        borderColor: "#fff"
    },
    quiz: {
        width: '7rem',
        height: '4.5rem',
    },
    versus: {
        width: responsiveScreenWidth(8),
        height: responsiveScreenWidth(10),
        marginHorizontal: '.8rem'
    },
    title: {
        fontSize: '1.1rem',
        color: '#072169',
        fontFamily: 'sansation-bold',
        marginVertical: 23,
        width: responsiveScreenWidth(35),
        textAlign: 'center'
    },
    button: {
        backgroundColor: '#4FAAFD',
        paddingVertical: '.7rem',
        paddingHorizontal: '1.7rem',
        borderRadius: 20
    },
    challengeButton: {
        backgroundColor: '#EF2F55',
        paddingVertical: '.7rem',
        paddingHorizontal: '1.7rem',
        borderRadius: 20
    },
    playText: {
        fontSize: '.95rem',
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
    },
})