import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import SwiperFlatList from "react-native-swiper-flatlist";
import normalize from "../../utils/normalize";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setGameMode, setGameType } from "./GameSlice";
import logToAnalytics from "../../utils/analytics";

const GamesCards = () => {
    return (
        <View style={styles.gamesContainer}>
            <SwiperFlatList>
                <TriviaBetCard />
                <TriviaChallengeCard />
                <TriviaRoomsCard />
            </SwiperFlatList>
        </View>
    )
}
export default GamesCards;

const TriviaBetCard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const gameMode = useSelector(state => state.common.gameModes[0]);
    const gameType = useSelector(state => state.common.gameTypes[0]);
    const user = useSelector(state => state.auth.user);

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
        <Pressable style={styles.triviaBetContainer} onPress={selectTriviaMode}>
            <Text style={styles.triviaBetHeader}>Trivia Bet</Text>
            <Image
                source={require('../../../assets/images/trivia-book.png')}
                style={styles.triviaAvatar}
            />
            <View style={styles.playButton}>
                <Text style={styles.playButtonText}>
                    Play Now!
                </Text>
            </View>
        </Pressable>
    )
}
const TriviaChallengeCard = () => {
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
        <Pressable style={styles.triviaChallengeContainer} onPress={selectChallengeMode}>
            <Text style={styles.triviaBetHeader}>Challenge a player</Text>
            <Image
                source={require('../../../assets/images/challenge-sword.png')}
                style={styles.avatar}
            />
            <View style={styles.challengePlayButton}>
                <Text style={styles.playButtonText}>
                    Play Now!
                </Text>
            </View>
        </Pressable>
    )
}
const TriviaRoomsCard = () => {
    return (
        <Pressable style={styles.triviaRoomContainer}>
            <Text style={styles.triviaBetHeader}>Trivia Rooms</Text>
            <Image
                source={require('../../../assets/images/rooms-hat.png')}
                style={styles.avatar}
            />
            <View style={styles.roomPlayButton}>
                <Text style={styles.playButtonText}>
                    Coming Soon!!
                </Text>
            </View>
        </Pressable>
    )
}

const styles = EStyleSheet.create({
    gamesContainer: {
        marginTop: '1.5rem'
    },
    triviaBetContainer: {
        backgroundColor: '#ECF7FF',
        borderColor: '#4FAAFD',
        borderWidth: 2,
        borderRadius: 13,
        width: normalize(208),
        height: normalize(190),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1rem',
        marginRight: '1rem'
    },
    triviaChallengeContainer: {
        backgroundColor: '#FDCCD4',
        borderColor: '#EF2F55',
        borderWidth: 2,
        borderRadius: 13,
        width: normalize(208),
        height: normalize(190),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1rem',
        marginRight: '1rem'
    },
    triviaRoomContainer: {
        backgroundColor: '#ECF7FF',
        borderColor: '#9186E9',
        borderWidth: 2,
        borderRadius: 13,
        width: normalize(208),
        height: normalize(190),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1rem',
        opacity: 0.6
    },
    avatar: {
        width: '6rem',
        height: '5.5rem',
    },
    triviaAvatar: {
        width: '7rem',
        height: '5.5rem',
    },
    triviaBetHeader: {
        fontSize: '1.1rem',
        color: '#072169',
        fontFamily: 'sansation-bold',
    },
    playButton: {
        backgroundColor: '#4FAAFD',
        paddingVertical: '.7rem',
        paddingHorizontal: '1.7rem',
        borderRadius: 20
    },
    challengePlayButton: {
        backgroundColor: '#EF2F55',
        paddingVertical: '.7rem',
        paddingHorizontal: '1.7rem',
        borderRadius: 20
    },
    roomPlayButton: {
        backgroundColor: '#9186E9',
        paddingVertical: '.7rem',
        paddingHorizontal: '1.7rem',
        borderRadius: 20
    },
    playButtonText: {
        fontSize: '.95rem',
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
    },
})