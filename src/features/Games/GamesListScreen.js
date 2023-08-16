import React, { useRef, useState } from "react";
import { Alert, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from "../../utils/normalize";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { setCashMode, setGameMode, setGameType, setPracticeMode } from "./GameSlice";
import logToAnalytics from "../../utils/analytics";
import { Image } from "react-native";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";
import { Ionicons } from "@expo/vector-icons";
import AppButton from "../../shared/AppButton";





const GamesListScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const refRBSheet = useRef();

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }
    const playTriviaForCash = () => {
        dispatch(setPracticeMode(false));
        dispatch(setCashMode(true));
        logToAnalytics("trivia_play_with_cash_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
        })
        closeBottomSheet()
        navigation.navigate('SelectGameCategory')
    }

    const playChallengeForCash = () => {
        dispatch(setPracticeMode(false));
        dispatch(setCashMode(true));
        logToAnalytics("challenge_play_with_cash_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
        })
        closeBottomSheet()
        navigation.navigate('SelectGameCategory')
    }

    const playChallengeForFree = () => {
        // Alert.alert('This mode is unavailable')
        dispatch(setCashMode(false));
        dispatch(setPracticeMode(true));
        logToAnalytics("challenge_play_for_free_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
        })
        closeBottomSheet()
        navigation.navigate('SelectGameCategory')
    }

    const playTriviaForFree = () => {
        // Alert.alert('This mode is unavailable')
        dispatch(setCashMode(false));
        dispatch(setPracticeMode(true));
        logToAnalytics("trivia_play_for_free_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
        })
        closeBottomSheet()
        navigation.navigate('SelectGameCategory')
    }

    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView style={styles.contentContainer}>
                <View style={styles.gamesContainer}>
                    <TriviaBetCard openBottomSheet={openBottomSheet} />
                    <TriviaChallengeCard openBottomSheet={openBottomSheet} />
                    <TriviaRoomsCard />
                    {/* <JackpotBetCard /> */}
                </View>
            </ScrollView>
            <UniversalBottomSheet
                refBottomSheet={refRBSheet}
                height={500}
                subComponent={<SelectGameMode
                    playTriviaForCash={playTriviaForCash}
                    playTriviaForFree={playTriviaForFree}
                    playChallengeForCash={playChallengeForCash}
                    playChallengeForFree={playChallengeForFree}
                />}
            />
        </ImageBackground>
    )
}

const TriviaBetCard = ({ openBottomSheet }) => {
    const dispatch = useDispatch();
    const gameMode = useSelector(state => state.common.gameModes[0]);
    const gameType = useSelector(state => state.common.gameTypes[0]);
    const user = useSelector(state => state.auth.user);

    const selectTriviaMode = () => {
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        openBottomSheet()
        logToAnalytics("trivia_staking_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            // 'gamemode': gameMode.displayName,
        })

    }
    return (
        <Pressable style={styles.triviaBetContainer} onPress={selectTriviaMode}>
            <Image
                source={require('../../../assets/images/single-player-banner.png')}
                style={styles.triviaAvatar}
            />
            <View style={styles.triviaActions}>
                <View style={styles.subTriviaActions}>
                    <Image
                        source={require('../../../assets/images/single-player.png')}
                        style={styles.bookAvatar}
                    />
                    <View style={styles.triviaActionsTexts}>
                        <Text style={styles.triviaBetHeader}>Single Player</Text>
                        <Text style={styles.triviaBetHeaderI}>Trivia Bet</Text>
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
const TriviaChallengeCard = ({ openBottomSheet }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const gameMode = useSelector(state => state.common.gameModes[1]);
    const gameType = useSelector(state => state.common.gameTypes[0]);

    const selectChallengeMode = () => {
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        openBottomSheet()
        logToAnalytics("trivia_challenge_staking_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
        })

    }
    return (
        <Pressable style={styles.triviaBetContainer} onPress={selectChallengeMode}>
            <Image
                source={require('../../../assets/images/challenge-banner.png')}
                style={styles.triviaAvatar}
            />
            <View style={styles.triviaActions}>
                <View style={styles.subTriviaActions}>
                    <Image
                        source={require('../../../assets/images/challenge-player.png')}
                        style={styles.challengeAvatar}
                    />
                    <View style={styles.triviaActionsTexts}>
                        <Text style={styles.triviaBetHeader}>Challenge</Text>
                        <Text style={styles.triviaBetHeaderI}>A Player</Text>
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
        <Pressable style={styles.triviaBetContainer}>
             <Image
                source={require('../../../assets/images/room-banner.png')}
                style={styles.triviaAvatar}
            />
            <View style={styles.triviaActions}>
                <View style={styles.subTriviaActions}>
                    <Image
                        source={require('../../../assets/images/rooms-hat.png')}
                        style={styles.bookAvatar}
                    />
                    <View style={styles.triviaActionsTexts}>
                        <Text style={styles.triviaBetHeader}>Trivia Rooms</Text>
                        <Text style={styles.triviaBetHeaderI}>Win More</Text>
                    </View>
                </View>
                <View style={styles.playButtonI} disabled>
                    <Text style={styles.playButtonText}>
                        Coming Soon
                    </Text>
                </View>
            </View>
        </Pressable>
    )
}
const JackpotBetCard = () => {
    return (
        <Pressable style={styles.triviaBetContainer}>
            <View style={[styles.subTriviaActions, { backgroundColor: '#FEECE7' }]}>
                <Image
                    source={require('../../../assets/images/money-jackpot.png')}
                    style={styles.avatar}
                />
            </View>
            <Text style={styles.gameTitle}>Jackpot Bet</Text>
            <View style={styles.playButtonI}>
                <Text style={styles.playButtonTextI}>
                    Coming soon
                </Text>
            </View>
        </Pressable>
    )
}


const SelectGameMode = ({ playTriviaForFree, playTriviaForCash, playChallengeForFree, playChallengeForCash }) => {
    const [earn, setEarn] = useState(true);
    const [practice, setPractice] = useState(false);
    const gameMode = useSelector(state => state.game.gameMode);
    const gameModeName = gameMode?.name

    const toggleFreeMode = () => {
        setEarn(false);
        setPractice(true);
    }

    const toggleEarn = () => {
        setEarn(true);
        setPractice(false);
    }

    const chooseMode = () => {
        if (earn && gameModeName === 'EXHIBITION') {
            playTriviaForCash()
        }
        if (practice && gameModeName === 'EXHIBITION') {
            playTriviaForFree()
        }
        if (earn && gameModeName === 'CHALLENGE') {
            playChallengeForCash()
        }
        if (practice && gameModeName === 'CHALLENGE') {
            playChallengeForFree()
        }
    }

    return (
        <View style={styles.modeContainer}>
            {gameModeName === 'EXHIBITION' &&
                <Text style={styles.modeTitle}>Single player trivia bet</Text>
            }
            {gameModeName === 'CHALLENGE' &&
                <Text style={styles.modeTitle}>Challenge a player</Text>
            }
            <View style={styles.mainContainer}>
                {/* <Pressable style={styles.modeSubContainerDisabled} onPress={toggleFreeMode} disabled>
                    <Ionicons name={practice ? 'checkmark-circle' : "ellipse-outline"} size={30} color={practice ? '#00FFA3' : '#D9D9D9'} />
                    <Text style={styles.modeName}>Practice for free (Coming soon)</Text>
                </Pressable> */}
                <Pressable style={styles.modeSubContainer} onPress={toggleEarn}>
                    <Ionicons name={earn ? 'checkmark-circle' : "ellipse-outline"} size={30} color={earn ? '#00FFA3' : '#D9D9D9'} />
                    <Text style={styles.modeName}>Play to earn</Text>
                </Pressable>
                <Pressable style={styles.modeSubContainer} onPress={toggleFreeMode}>
                    <Ionicons name={practice ? 'checkmark-circle' : "ellipse-outline"} size={30} color={practice ? '#00FFA3' : '#D9D9D9'} />
                    <Text style={styles.modeName}>Practice for free</Text>
                </Pressable>
            </View>
            {/* <Pressable style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>Game instructions</Text>
                <Ionicons name="chevron-forward" size={30} color='#072169' onPress={toggleEarn} />
            </Pressable> */}
            <AppButton text='Click to continue' style={styles.continueButton} textStyle={styles.buttonText} disabled={!earn && !practice} onPress={chooseMode} />
        </View>
    )
}


export default GamesListScreen;

const styles = EStyleSheet.create({
    contentContainer: {
        flex: 1,
        paddingHorizontal: normalize(20),
        paddingTop: '1rem'
    },
    gamesContainer: {
        marginBottom: '1rem',
        // marginTop: '1.5rem',
        flexDirection: 'column',
        alignItems: 'center'
    },
    triviaBetContainer: {
        width: normalize(335),
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.2,
        marginBottom: '1rem'
    },
    triviaAvatar: {
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        width: normalize(335),
        height: normalize(250),
    },
    bookAvatar: {
        width: '2.5rem',
        height: '2.5rem',
    },
    challengeAvatar: {
        width: '3rem',
        height: '2.5rem',
        marginRight: '.5rem'
    },
    subTriviaActions: {
        flexDirection: 'row',
        alignItems: 'center',
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
    triviaBetHeader: {
        fontSize: '.85rem',
        color: '#E15220',
        fontFamily: 'gotham-bold',
    },
    triviaBetHeaderI: {
        fontSize: '1.2rem',
        color: '#1C453B',
        fontFamily: 'gotham-bold',
    },
    playButton: {
        backgroundColor: '#E15220',
        paddingVertical: '.6rem',
        paddingHorizontal: '1.2rem',
        borderRadius: 20
    },
    playButtonI: {
        backgroundColor: '#EA8663',
        paddingVertical: '.6rem',
        paddingHorizontal: '1.2rem',
        borderRadius: 20
    },
    playButtonText: {
        fontSize: '.85rem',
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
    },
    modeContainer: {
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(15),
    },
    modeTitle: {
        fontSize: '1.2rem',
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        textAlign: 'center'
    },
    mainContainer: {
        marginTop: '1.2rem'
    },
    modeSubContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        paddingVertical: '1rem'
    },
    modeSubContainerDisabled: {
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderColor: '#EEEEEE',
        paddingVertical: '1rem',
        opacity: 0.4
    },
    modeName: {
        fontSize: '1rem',
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        marginLeft: '.5rem'
    },
    instructionsContainer: {
        backgroundColor: '#FFFFFF',
        borderColor: '#E5E5E5',
        borderWidth: 1,
        borderRadius: 13,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1rem',
        paddingHorizontal: '.9rem',
        marginTop: '.9rem',
        marginBottom: '4.5rem'
    },
    instructionsTitle: {
        fontSize: '.85rem',
        color: '#1C453B',
        fontFamily: 'gotham-bold',
    },
    continueButton: {
        marginTop: '5rem',
        marginBottom:0,
        paddingVertical: normalize(19),
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },

})