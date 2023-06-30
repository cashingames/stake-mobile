import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import SwiperFlatList from "react-native-swiper-flatlist";
import { useDispatch, useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import { setGameMode, setGameType } from "../features/Games/GameSlice";
import logToAnalytics from "../utils/analytics";
import normalize from "../utils/normalize";

const GamesCardsList = () => {
    return (
        <View style={styles.gamesContainer}>
            <SwiperFlatList>
                <TriviaChallengeCard />
                <TriviaBetCard />
                <TriviaRoomsCard />
            </SwiperFlatList>
        </View>
    )
}
export default GamesCardsList;

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
            // 'gamemode': gameType.displayName,
        })
        navigation.navigate('SelectGameCategory')

    }
    return (
        <Pressable style={styles.triviaBetContainer} onPress={selectTriviaMode}>
            <Image
                source={require('../../assets/images/trivia-banner.png')}
                style={styles.triviaAvatar}
            />
            <View style={styles.triviaActions}>
                <View style={styles.subTriviaActions}>
                    <Image
                        source={require('../../assets/images/trivia-book.png')}
                        style={styles.bookAvatar}
                    />
                    <View style={styles.triviaActionsTexts}>
                        <Text style={styles.triviaBetHeaderI}>Discover</Text>
                        <Text style={styles.triviaBetHeader}>Trivia Bet</Text>
                    </View>
                </View>
                <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>
                        Play Now
                    </Text>
                </View>
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
            // 'gamemode': gameMode.displayName,
        })
        navigation.navigate('SelectGameCategory')

    }
    return (
        <Pressable style={styles.triviaBetContainer} onPress={selectChallengeMode}>
            <Image
                source={require('../../assets/images/challenge-banner.png')}
                style={styles.triviaAvatar}
            />
            <View style={styles.triviaActions}>
                <View style={styles.subTriviaActions}>
                    <Image
                        source={require('../../assets/images/challenge-sword.png')}
                        style={styles.avatar}
                    />
                    <View style={styles.triviaActionsTexts}>
                        <Text style={styles.triviaBetHeaderI}>Challenge</Text>
                        <Text style={styles.triviaBetHeader}>A Player</Text>
                    </View>
                </View>
                <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>
                        Play Now
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}
const TriviaRoomsCard = () => {
    return (
        <Pressable style={styles.triviaRoomContainer}>
            <Image
                source={require('../../assets/images/rooms-banner.png')}
                style={styles.triviaRoomAvatar}
            />
            <View style={styles.triviaActions}>
                <View style={styles.subTriviaActions}>
                    <Image
                        source={require('../../assets/images/rooms-hat.png')}
                        style={styles.roomAvatar}
                    />
                    <View style={styles.triviaActionsTexts}>
                        <Text style={styles.triviaBetHeaderI}>Discover</Text>
                        <Text style={styles.triviaBetHeader}>Trivia Rooms</Text>
                    </View>
                </View>
                <View style={styles.playButtonI}>
                    <Text style={styles.playButtonTextI}>
                        Coming soon
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}

const styles = EStyleSheet.create({
    gamesContainer: {
        marginTop: '1.5rem'
    },
    triviaBetContainer: {
        width: normalize(300),
        marginRight: '.8rem',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.2,
    },
    triviaAvatar: {
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        width: normalize(300),
        height: normalize(230),
    },
    bookAvatar: {
        width: '3rem',
        height: '3.9rem',
    },
    triviaActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        paddingHorizontal: '.7rem',
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
    },
    subTriviaActions: {
        flexDirection: 'row',
        alignItems: 'center',
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
        width: normalize(330),
        marginRight: '.8rem',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.2,
    },
    triviaRoomAvatar: {
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        width: normalize(330),
        height: normalize(230),
    },
    avatar: {
        width: '4rem',
        height: '3.9rem',
    },
    roomAvatar: {
        width: '4.2rem',
        height: '3.9rem',
    },


    triviaBetHeader: {
        fontSize: '1rem',
        color: '#072169',
        fontFamily: 'bubble-regular',
    },
    triviaBetHeaderI: {
        fontSize: '.85rem',
        color: '#FF3B81',
        fontFamily: 'bubble-regular',
    },
    triviaActionsTexts: {
        marginLeft: '.3rem'
    },

    playButton: {
        backgroundColor: '#E15220',
        paddingVertical: '.6rem',
        paddingHorizontal: '.5rem',
        borderRadius: 20
    },
    playButtonI: {
        backgroundColor: '#F9FBFF',
        paddingVertical: '.6rem',
        paddingHorizontal: '.5rem',
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
        fontSize: '.8rem',
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
    },
    playButtonTextI: {
        fontSize: '.8rem',
        color: '#072169',
        fontFamily: 'sansation-bold',
    },
})