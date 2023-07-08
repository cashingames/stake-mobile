import React, { useEffect } from "react";
import { Alert, Image, Pressable, Text, View } from "react-native";
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
                    <TriviaBetCard />
                <FundWalletCard />
                <PlayEarnCard />
            </SwiperFlatList>
        </View>
    )
}
export default GamesCardsList;

const TriviaBetCard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const gameMode = useSelector(state => state.common.gameModes[0]);
    const user = useSelector(state => state.auth.user);

    const selectTriviaMode = () => {
        dispatch(setGameMode(gameMode));
        logToAnalytics("play_banner_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
        })
        navigation.navigate('Games')

    }
    return (
        <Pressable style={styles.triviaBetContainer} onPress={selectTriviaMode}>
            <Image
                source={require('../../assets/images/trivia-banner.png')}
                style={styles.triviaAvatar}
            />
            <View style={styles.triviaActions}>
                <View style={styles.subTriviaActions}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../../assets/images/trivia-chess.png')}
                            style={styles.bookAvatar}
                        />
                    </View>
                    <View style={styles.triviaActionsTexts}>
                        <Text style={styles.triviaBetHeaderI}>Games</Text>
                        <Text style={styles.triviaBetHeader}>Stake on games</Text>
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
const FundWalletCard = () => {
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);

    const fundMode = () => {
        logToAnalytics("trivia_challenge_staking_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
        })
        navigation.navigate('FundWallet')

    }
    return (
        <Pressable style={styles.triviaBetContainer} onPress={fundMode}>
            <Image
                source={require('../../assets/images/fund-banner.png')}
                style={styles.triviaAvatar}
            />
            <View style={styles.triviaActions}>
                <View style={styles.subTriviaActions}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../../assets/images/megaphone.png')}
                            style={styles.bookAvatar}
                        />
                    </View>
                    <View style={styles.triviaActionsTexts}>
                        <Text style={styles.triviaBetHeaderI}>Let's cashout</Text>
                        <Text style={styles.triviaBetHeader}>Play and win big</Text>
                    </View>
                </View>
                <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>
                        Fund Now
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}
const PlayEarnCard = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const gameMode = useSelector(state => state.common.gameModes[0]);
    const user = useSelector(state => state.auth.user);

    const selectTriviaMode = () => {
        dispatch(setGameMode(gameMode));
        logToAnalytics("playearn_banner_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
        })
        navigation.navigate('Games')

    }
    return (
        <Pressable style={styles.triviaRoomContainer} onPress={selectTriviaMode}>
            <Image
                source={require('../../assets/images/rooms-banner.png')}
                style={styles.triviaRoomAvatar}
            />
            <View style={styles.triviaActions}>
                <View style={styles.subTriviaActions}>
                    <View style={styles.avatarContainer}>
                        <Image
                            source={require('../../assets/images/megaphone.png')}
                            style={styles.bookAvatar}
                        />
                    </View>
                    <View style={styles.triviaActionsTexts}>
                        <Text style={styles.triviaBetHeaderI}>Everyday cash</Text>
                        <Text style={styles.triviaBetHeader}>Play and win big</Text>
                    </View>
                </View>
                <View style={styles.playButton}>
                    <Text style={styles.playButtonText}>
                        Play & earn
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
        width: '2.3rem',
        height: '2.3rem',
    },
    triviaActions: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFF',
        paddingHorizontal: '.7rem',
        borderBottomLeftRadius: 13,
        borderBottomRightRadius: 13,
        paddingVertical: '.75rem'
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
    avatarContainer: {
        backgroundColor: '(rgba(178, 229, 227, 0.49))',
        borderRadius: 100,
        width: 65,
        height: 65,
        alignItems: 'center',
        justifyContent: 'center'
    },


    triviaBetHeader: {
        fontSize: '.8rem',
        color: '#072169',
        fontFamily: 'sansation-regular',
    },
    triviaBetHeaderI: {
        fontSize: '.85rem',
        color: '#072169',
        fontFamily: 'gotham-medium',
    },
    triviaActionsTexts: {
        marginLeft: '.3rem'
    },

    playButton: {
        backgroundColor: '#E15220',
        paddingVertical: '.45rem',
        paddingHorizontal: '.8rem',
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