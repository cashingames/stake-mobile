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
import analytics from '@react-native-firebase/analytics';





const GamesListScreen = ({ navigation }) => {

    useFocusEffect(
        React.useCallback(() => {
            if (Platform.OS === "android") {
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor("transparent");
                return;
            }
            StatusBar.setBarStyle('light-content');
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
        <LinearGradient
            colors={['#072169', '#752A00']}
            start={[0.5, 0]}
            end={[0.5, 1]}
            style={styles.container}
        >
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.gamesContainer}>
                    <TriviaStakingCard />
                    <ChallengeCard />
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

    const selectChallengeMode = async () => {
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        await analytics().logEvent("game_mode_selected", {
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
            <Text style={styles.title}>Challenge a friend</Text>
            <Pressable style={styles.button} onPress={selectChallengeMode}>
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


    const selectTriviaMode = async () => {
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        await analytics().logEvent("game_mode_selected", {
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
                    source={require('../../../assets/images/quiz.png')}
                    style={styles.quiz}
                />
            </View>
            <Text style={styles.title}>Trivia Staking</Text>
            <Pressable style={styles.button} onPress={selectTriviaMode}>
                <Text style={styles.playText}>Play now</Text>
            </Pressable>
        </Pressable>
    )
}

export default GamesListScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#072169',
        // paddingHorizontal: normalize(18),
        // paddingVertical: normalize(30),

    },
    contentContainer: {
        flex: 1,
        // backgroundColor: '#072169',
        // paddingHorizontal: normalize(18),
        // paddingVertical: normalize(30),
        justifyContent: 'center',
        alignItems: 'center',
    },
    gamesContainer: {
        display: 'flex',
        flexDirection: 'column',
        // justifyContent:'center',
        // alignItems:'center',
        // flexWrap: 'wrap',
        // justifyContent: 'space-between'
    },
    cardContainer: {
        backgroundColor: '#eab676',
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
        backgroundColor: '#FAC502',
        paddingHorizontal: normalize(10),
        paddingVertical: normalize(18),
        display: 'flex',
        alignItems: 'center',
        borderRadius: 13,
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
        width: responsiveScreenWidth(18),
        height: responsiveScreenWidth(18),
    },
    versus: {
        width: responsiveScreenWidth(8),
        height: responsiveScreenWidth(10),
        marginHorizontal: '.8rem'
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