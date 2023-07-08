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
import CustomAlert from "../../shared/CustomAlert";





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
        Alert.alert('This mode is unavailable')
        // dispatch(setCashMode(false));
        // dispatch(setPracticeMode(true));
        // logToAnalytics("challenge_play_for_free_selected", {
        //     'id': user.username,
        //     'phone_number': user.phoneNumber,
        //     'email': user.email,
        // })
        // closeBottomSheet()
        // navigation.navigate('SelectGameCategory')
    }

    const playTriviaForFree = () => {
        // closeBottomSheet()
        Alert.alert('This mode is unavailable')
        // dispatch(setCashMode(false));
        // dispatch(setPracticeMode(true));
        // logToAnalytics("trivia_play_for_free_selected", {
        //     'id': user.username,
        //     'phone_number': user.phoneNumber,
        //     'email': user.email,
        // })

        // navigation.navigate('SelectGameCategory')
    }

    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView style={styles.contentContainer}>
                <View style={styles.gamesContainer}>
                    <TriviaBetCard openBottomSheet={openBottomSheet} />
                    <TriviaChallengeCard openBottomSheet={openBottomSheet} />
                    <JackpotBetCard />
                    <TriviaRoomsCard />
                </View>
            </ScrollView>
            <UniversalBottomSheet
                refBottomSheet={refRBSheet}
                height={560}
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
    const navigation = useNavigation();
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
            <View style={[styles.subTriviaActions, { backgroundColor: '#EBFAED' }]}>
                <Image
                    source={require('../../../assets/images/single-player.png')}
                    style={styles.avatar}
                />
            </View>
            <Text style={styles.gameTitle}>Single Player</Text>
            <View style={styles.playButton}>
                <Text style={styles.playButtonText}>
                    Play now
                </Text>
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
            <View style={[styles.subTriviaActions, { backgroundColor: '#F6F4FF' }]}>
                <Image
                    source={require('../../../assets/images/challenge-player.png')}
                    style={styles.avatari}
                />
            </View>
            <Text style={styles.gameTitle}>Challenge a player</Text>
            <View style={styles.playButton}>
                <Text style={styles.playButtonText}>
                    Play now
                </Text>
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
const TriviaRoomsCard = () => {
    return (
        <Pressable style={styles.triviaBetContainer}>
            <View style={[styles.subTriviaActions, { backgroundColor: '#ECF7FF' }]}>
                <Image
                    source={require('../../../assets/images/rooms-hat.png')}
                    style={styles.avatar}
                />
            </View>
            <Text style={styles.gameTitle}>Trivia rooms</Text>
            <View style={styles.playButtonI}>
                <Text style={styles.playButtonTextI}>
                    Coming soon
                </Text>
            </View>
        </Pressable>
    )
}

const SelectGameMode = ({ playTriviaForFree, playTriviaForCash, playChallengeForFree, playChallengeForCash }) => {
    const [earn, setEarn] = useState(false);
    const [practice, setPractice] = useState(false);
    const gameMode = useSelector(state => state.game.gameMode);
    const gameModeName = gameMode?.name
    console.log(gameModeName)

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
                <Pressable style={styles.modeSubContainerDisabled} onPress={toggleFreeMode} disabled>
                    <Ionicons name={practice ? 'checkmark-circle' : "ellipse-outline"} size={30} color={practice ? '#00FFA3' : '#D9D9D9'} />
                    <Text style={styles.modeName}>Practice for free (Coming soon)</Text>
                </Pressable>
                <Pressable style={styles.modeSubContainer} onPress={toggleEarn}>
                    <Ionicons name={earn ? 'checkmark-circle' : "ellipse-outline"} size={30} color={earn ? '#00FFA3' : '#D9D9D9'} />
                    <Text style={styles.modeName}>Play to earn</Text>
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
        marginBottom: '3rem',
        marginTop: '1.5rem',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between'
        // alignItems:'center'
    },
    triviaBetContainer: {
        marginBottom: '2rem',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: normalize(193),
        // marginHorizontal:'.5rem'
    },
    triviaAvatar: {
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        width: normalize(335),
        height: normalize(245),
    },
    avatar: {
        width: '3rem',
        height: '3.9rem',
    },
    avatari: {
        width: '4.2rem',
        height: '3.9rem',
    },
    gameTitle: {
        fontSize: '1rem',
        color: '#072169',
        fontFamily: 'gotham-bold',
        width: '8rem',
        textAlign: 'center'
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
        borderRadius: 100,
        width: 120,
        height: 120,
        alignItems: 'center',
        justifyContent: 'center',
        borderColor: '#E5E5E5',
        borderWidth: 1,
    },
    triviaChallengeContainer: {
        backgroundColor: '#FDCCD4',
        borderColor: '#EF2F55',
        borderWidth: 2,
        borderRadius: 13,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1rem',
        marginRight: '1rem'
    },
    triviaRoomContainer: {
        marginBottom: '1rem',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.2,
    },
    triviaRoomAvatar: {
        borderTopLeftRadius: 13,
        borderTopRightRadius: 13,
        width: normalize(335),
        height: normalize(245),
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
        paddingVertical: '.5rem',
        paddingHorizontal: '1rem',
        borderRadius: 20
    },
    playButtonI: {
        backgroundColor: '#E15220',
        paddingVertical: '.5rem',
        paddingHorizontal: '1rem',
        borderRadius: 20,
        opacity: 0.6
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
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
    },
    modeContainer: {
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(15),
    },
    modeTitle: {
        fontSize: '1.2rem',
        color: '#072169',
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
        fontSize: '.9rem',
        color: '#072169',
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
        color: '#072169',
        fontFamily: 'gotham-bold',
    },
    continueButton: {
        // marginVertical: 20,
        paddingVertical: normalize(19),
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },

})