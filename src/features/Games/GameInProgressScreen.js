import React, { useCallback, useState } from "react";
import { View, ScrollView, ImageBackground, Alert, BackHandler, Image, Text } from 'react-native';
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { unwrapResult } from '@reduxjs/toolkit';
import { useSelector, useDispatch } from 'react-redux';
import crashlytics from '@react-native-firebase/crashlytics';
import {
    endGame, setHasPlayedTrivia
} from "./GameSlice";

import EStyleSheet from "react-native-extended-stylesheet";
import { useFocusEffect } from "@react-navigation/native";
import PlayGameHeader from "../../shared/PlayGameHeader";
import GameTopicProgress from "../../shared/GameTopicProgress";
import AvailableGameSessionBoosts from "../../shared/AvailableGameSessionBoosts";
import GameQuestions from "../../shared/GameQuestions";
import logToAnalytics from "../../utils/analytics";
import DoubleButtonAlert from "../../shared/DoubleButtonAlert";
import CustomAlert from "../../shared/CustomAlert";




export default function GameInProgressScreen({ navigation, route }) {

    const dispatch = useDispatch();
    const params = route.params;

    const gameSessionToken = useSelector(state => state.game.gameSessionToken);
    const chosenOptions = useSelector(state => state.game.chosenOptions);
    const consumedBoosts = useSelector(state => state.game.consumedBoosts);
    const isPlayingTrivia = useSelector(state => state.game.isPlayingTrivia);
    const isStaking = useSelector(state => state.game.amountStaked);
    const user = useSelector(state => state.auth.user);
    const isEnded = useSelector(state => state.game.isEnded);
    const newUser = useSelector(state => state.auth.user.joinedOn);
    const newUserDate = newUser.slice(0, 10);
    let formattedDate = new Date().toISOString().split('T')[0];
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [exiting, setExiting] = useState(false);
    const [exitClicked, setExitClicked] = useState(false);


    const startModal = () => {
        setModalVisible(true)
    }


    const [ending, setEnding] = useState(false);

    const onExitGame = (confirm = false) => {
        setExiting(true)
        setModalVisible(false)
        if (ending) {
            //do not delete
            // console.log("Trying to end second time. If this happens, please notify Oye")
            return;
        }

        setEnding(true);
        if (confirm) {
            showExitConfirmation()
            return;
        }

        dispatch(endGame({
            token: gameSessionToken,
            chosenOptions,
            consumedBoosts
        }))
            .then(unwrapResult)
            .then(() => {
                console.log('hidddt')
                crashlytics().log('User completed exhibition game');
                if (formattedDate !== newUserDate && !isStaking && !isPlayingTrivia) {
                    logToAnalytics('exhibition_game_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                if (formattedDate === newUserDate && !isStaking && !isPlayingTrivia) {
                    logToAnalytics('new_user_exhibition_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                if (formattedDate === newUserDate && isStaking) {
                    logToAnalytics('new_user_staking_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                if (formattedDate !== newUserDate && isStaking) {
                    crashlytics().log('User completed staking game');
                    logToAnalytics('staking_game_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                }
                setEnding(false);
                if (isPlayingTrivia) {
                    dispatch(setHasPlayedTrivia(true))
                    crashlytics().log('User completed live trivia');
                    logToAnalytics('live_trivia_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    })
                    navigation.navigate('TriviaEndResult', {
                        triviaId: params.triviaId,
                    })
                } else {
                    navigation.navigate('GameEndResult');
                }
            })
            .catch((error, rejectedValueOrSerializedError) => {
                crashlytics().recordError(error);
                crashlytics().log('failed to end exhibition game');
                setEnding(false);
                // console.log(rejectedValueOrSerializedError);
                startModal()
                setAlertMessage("failed to end game");
            });
    }
    const onEndGame = (confirm = false) => {
        console.log('hit')

        if (ending) {
            //do not delete
            // console.log("Trying to end second time. If this happens, please notify Oye")
            return;
        }

        setEnding(true);
        if (confirm) {
            showExitConfirmation()
            return;
        }

        dispatch(endGame({
            token: gameSessionToken,
            chosenOptions,
            consumedBoosts
        }))
            .then(unwrapResult)
            .then(() => {
                console.log('hidddt')
                crashlytics().log('User completed exhibition game');
                if (formattedDate !== newUserDate && !isStaking && !isPlayingTrivia) {
                    logToAnalytics('exhibition_game_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                if (formattedDate === newUserDate && !isStaking && !isPlayingTrivia) {
                    logToAnalytics('new_user_exhibition_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                if (formattedDate === newUserDate && isStaking) {
                    logToAnalytics('new_user_staking_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                };
                if (formattedDate !== newUserDate && isStaking) {
                    crashlytics().log('User completed staking game');
                    logToAnalytics('staking_game_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    });
                }
                setEnding(false);
                if (isPlayingTrivia) {
                    dispatch(setHasPlayedTrivia(true))
                    crashlytics().log('User completed live trivia');
                    logToAnalytics('live_trivia_completed', {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    })
                    navigation.navigate('TriviaEndResult', {
                        triviaId: params.triviaId,
                    })
                } else {
                    navigation.navigate('GameEndResult');
                }
            })
            .catch((error, rejectedValueOrSerializedError) => {
                crashlytics().recordError(error);
                crashlytics().log('failed to end exhibition game');
                setEnding(false);
                // console.log(rejectedValueOrSerializedError);
                startModal()
                setAlertMessage("failed to end game");
            });
    }

    const showExitConfirmation = () => {
        setExitClicked(true)
        startModal()
        setAlertMessage("You have an ongoing game. Do you want to submit this game ?");
    }

    //disable back button
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => true;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    if (isEnded) {
        return null;
    }

    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')} style={styles.image} resizeMode="cover">
            <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
                <PlayGameHeader onPress={showExitConfirmation} />
                <StakeDetails />
                <GameProgressAndBoosts />
                <GameQuestions onPress={() => onEndGame()} ending={ending} onComplete={() => onEndGame()} exiting={exiting} />
                {exitClicked ?
                    <DoubleButtonAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                        textLabel={alertMessage} buttonLabel='Continue playing' actionLabel='Exit'
                        alertImage={require('../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} onPress={() => onExitGame()} />
                    :
                    <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                        textLabel={alertMessage} buttonLabel='Ok, got it'
                        alertImage={require('../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} />
                }
            </ScrollView>
        </ImageBackground>
    );
}

const StakeDetails = () => {
    const amountStaked = useSelector(state => state.game.amountStaked);
    const gameStakes = useSelector(state => state.game.gameStakes[0]);


    return (
        <View style={styles.stakeContainer}>
            <View style={styles.stakeSubContainer}>
                <Image
                    source={require('../../../assets/images/wallet-with-cash.png')}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.stakeHeader}>Stake</Text>
                    <Text style={styles.stakeAmount}>NGN {amountStaked}</Text>
                </View>
            </View>

            {/* <View style={styles.stakeSubContainer}>
                <Image
                    source={require('../../../assets/images/wallet-with-cash.png')}
                    style={styles.avatar}
                />
                <View>
                    <Text style={styles.stakeHeader}>Pot. winnings</Text>
                    <Text style={styles.stakeAmount}>NGN {amountStaked * (gameStakes.odd)}</Text>
                </View>
            </View> */}
        </View>
    )
}

const GameProgressAndBoosts = () => {
    return (
        <View style={styles.gameProgressAndBoost}>
            <GameTopicProgress />
            <AvailableGameSessionBoosts />
        </View>
    )
}


const styles = EStyleSheet.create({

    container: {
        flex: 1,
    },
    image: {
        flex: 1,
        paddingHorizontal: normalize(18),
        paddingTop: responsiveScreenWidth(13),
    },
    stakeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: '1.5rem'
    },
    stakeSubContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: '1.4rem',
        height: '1.4rem'
    },
    stakeHeader: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-medium',
        color: '#072169',
    },
    stakeAmount: {
        fontSize: '0.9rem',
        fontFamily: 'sansation-regular',
        color: '#072169',
    },
    gameProgressAndBoost: {
        display: 'flex',
        backgroundColor: '#AAD880',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        borderRadius: 16,
        marginVertical: normalize(25),
        borderWidth: 1,
        borderColor: '#E5E5E5',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: '1.2rem',
        paddingVertical: '1rem'


    },

});
