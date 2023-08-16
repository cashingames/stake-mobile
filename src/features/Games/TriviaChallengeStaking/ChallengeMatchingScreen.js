import React, { useCallback, useEffect, useState } from "react";
import { BackHandler, ImageBackground, Image, Text, View, ScrollView } from "react-native";
import { formatNumber, isTrue } from "../../../utils/stringUtl";
import Constants from 'expo-constants';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from "react-redux";
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from "../../../utils/normalize";
import { useFocusEffect } from "@react-navigation/native";
import AppButton from "../../../shared/AppButton";
import firestore from '@react-native-firebase/firestore';
import { setChallengeDetails } from "./TriviaChallengeGameSlice";
import logToAnalytics from "../../../utils/analytics";
import DoubleButtonAlert from "../../../shared/DoubleButtonAlert";
import AuthTitle from "../../../shared/AuthTitle";

const ChallengeMatchingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const boosts = useSelector(state => state.auth.user.boosts);
    const documentId = useSelector(state => state.triviaChallenge.documentId);
    const [dataUpdated, setDataUpdated] = useState(false);
    const [challengeInfo, setChallengeInfo] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const cashMode = useSelector(state => state.game.cashMode);
    const practiceMode = useSelector(state => state.game.practiceMode);


    const startModal = () => {
        setModalVisible(true)
    }

    const cancelChallenge = () => {
        startModal()
        setAlertMessage("Are you sure you want to cancel this challenge?");
    }

    const proceedWithCancel = () => {
        navigation.navigate('Home');
    }

    useEffect(() => {

        const subscriber = firestore()
            // .doc('trivia-challenge-requests/n3gJEjoqHdg3wY2h7QK8')
            .doc(documentId)
            .onSnapshot(documentSnapshot => {
                if (!documentSnapshot.exists) {
                    return;
                }
                const data = documentSnapshot.data();
                /**
                 * @TODO fix this bug, something keeps reruning this subscription from game in progress screen
                 * when opponent info changes
                 */
                if (data.status === "MATCHED" && data.opponent.status !== "COMPLETED") {
                    logToAnalytics("trivia_challenge_stake_matched", {
                        'documentId': documentId,
                        'opponentName': data.opponent.username,
                        'username': data.username,
                    })
                    logToAnalytics("trivia_challenge_stake_start_initiated", {
                        'documentId': documentId,
                        'opponentName': data.opponent.username,
                        'username': data.username,
                    })

                    dispatch(setChallengeDetails(data))
                    setChallengeInfo(data)
                    setDataUpdated(true)
                    setTimeout(() => {
                        if (cashMode) {
                            navigation.navigate('ChallengeGameBoard');
                        }
                        if (practiceMode) {
                            navigation.navigate('ChallengePracticeTour');
                        }
                    }, 5000);
                }
            }, error => {
            });


        return () => subscriber();
    }, [documentId]);

    //disable back button
    useFocusEffect(
        useCallback(() => {
            const onBackPress = () => true;
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    return (
        <ImageBackground source={require('../../../../assets/images/match-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView style={styles.container} contentContainerStyle={styles.content}>
                <View>
                <View style={styles.headerBox}>
                    <AuthTitle text='Challenge a Player' />
                </View>
                    <View style={styles.purchaseBoost}>
                        <Text style={styles.boostText}>Score high using boosts</Text>
                        {practiceMode &&
                            <DemoBoostCardDetails />
                        }
                        {cashMode &&
                            <View>
                                {boosts?.length > 0 ?
                                    <View style={styles.boostContainer}>
                                        {boosts.map((boost, i) => <BoostCardDetails key={i} boost={boost} />)}
                                    </View>
                                    :
                                    <View style={styles.boostContainer}>
                                        <View style={styles.boostDetailsHead}>
                                            <Image
                                                source={require('../../../../assets/images/timefreeze-boost.png')}
                                                style={styles.boostIcon}
                                            />
                                            <Text style={styles.storeItemName}>x0</Text>
                                        </View>
                                        <View style={styles.boostDetailsHead}>
                                            <Image
                                                source={require('../../../../assets/images/skip-boost.png')}
                                                style={styles.boostIcon}
                                            />
                                            <Text style={styles.storeItemName}>x0</Text>
                                        </View>
                                    </View>
                                }
                            </View>
                        }
                    </View>
                    <View style={styles.messageContainer}>
                        <SelectedPlayers user={user} challengeDetails={challengeInfo} dataUpdated={dataUpdated} />
                    </View>
                    {!dataUpdated ?
                        <View style={styles.findingContainer}>
                            <View style={styles.animationContainer}>
                                <Image
                                    source={require('../../../../assets/images/finding-bar.png')}
                                    style={styles.barAvatar}
                                />
                            </View>
                            <Text style={styles.message}>
                                Finding a player...
                            </Text>
                        </View>
                        :
                        <View style={styles.findingContainer}>
                            <View style={styles.animationContainer}>
                                <Image
                                    source={require('../../../../assets/images/matched-bar.png')}
                                    style={styles.barAvatar}
                                />
                            </View>
                            <Text style={styles.message}>
                                You have been matched
                            </Text>
                        </View>
                    }
                </View>
                <View>
                    {!dataUpdated &&
                        <AppButton text="Cancel" onPress={cancelChallenge} style={styles.stakeButton} />
                    }
                    {dataUpdated &&
                        <AppButton text="Starting Game" style={styles.stakeButton} />
                    }
                    <DoubleButtonAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                        textLabel={alertMessage} buttonLabel='Dismiss' actionLabel='Yes, cancel'
                     onPress={proceedWithCancel} />
                </View>

            </ScrollView>
        </ImageBackground>
    )
}


const SelectedPlayers = ({ user, dataUpdated, challengeDetails }) => {
    const username = user.username?.charAt(0) + user.username?.charAt(1);
    const opponentName = challengeDetails.opponent?.username?.charAt(0) + challengeDetails.opponent?.username?.charAt(1)
    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerName={user.username} playerAvatar={username} backgroundColor='#ccded48c' />

            <Image
                source={require('../../../../assets/images/versus.png')}
                style={styles.versus}
            />
            {dataUpdated ?
                <SelectedPlayer playerName={challengeDetails.opponent.username} playerAvatar={opponentName} backgroundColor='#FEECE7' />
                :
                <SelectedPlayer playerName="...." playerAvatar="?" backgroundColor='#FEECE7' />
            }
        </View>
    )
}

const SelectedPlayer = ({ playerName, playerAvatar, backgroundColor }) => {
    return (
        <View style={styles.avatarBackground}>
            <View style={[styles.avatarContent, { backgroundColor: backgroundColor }]}>
                <Text style={styles.avatarText}>{playerAvatar}</Text>
            </View>
            <Text style={styles.username}>@{playerName}</Text>
        </View>
    )
}

const BoostCardDetails = ({ boost }) => {
    return (
        <View style={styles.boostDetailsHead}>
            <Image
                source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${boost.icon}` }}
                style={styles.boostIcon}
            />
            <Text style={styles.storeItemName}>x{formatNumber(boost.count)}</Text>
        </View>
    )
}

const DemoBoostCardDetails = () => {
    return (
        <View style={styles.boostContainer}>
            <View style={styles.boostDetailsHead}>
                <Image
                    source={require('../../../../assets/images/timefreeze-boost.png')}
                    style={styles.boostIcon}
                />
                <Text style={styles.storeItemName}>x{formatNumber(20)}</Text>
            </View>
            <View style={styles.boostDetailsHead}>
                <Image
                    source={require('../../../../assets/images/skip-boost.png')}
                    style={styles.boostIcon}
                />
                <Text style={styles.storeItemName}>x{formatNumber(20)}</Text>
            </View>
        </View>
    )
}

export default ChallengeMatchingScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        paddingTop:'2rem',
        paddingBottom:'1rem',
    },
    content: {
        justifyContent: 'space-between',
        flex: 1,
    },
    headerBox: {
        marginTop: Platform.OS === 'ios' ? responsiveScreenWidth(3) : 0,
    },
    animationContainer: {
        display: 'flex',
        alignItems: 'center'
    },
    playerImage: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        borderRadius: 13,
        marginBottom: '1rem',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        backgroundColor: '#fff'
    },

    avatarBackground: {
        alignItems: 'center',
        marginVertical: normalize(15)
    },
    avatar: {
        width: normalize(65),
        height: normalize(65),
        backgroundColor: '#F6F4FF',
        borderRadius: 50,
    },
    avatarContent: {
        width: normalize(80),
        height: normalize(80),
        backgroundColor: '#ccded48c',
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: '1.6rem',
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        textTransform: 'uppercase'
    },
    username: {
        fontSize: '0.85rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',
        width: '5rem',
        textAlign: 'center',
        marginTop: '.8rem'
    },
    versus: {
        width: '3.2rem',
        height: '7.9rem'
    },
    findingContainer: {
        marginTop:'1rem'
    },
    message: {
        fontSize: '1rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',
        textAlign: 'center',
        marginTop: normalize(15),
        lineHeight: '2rem'
    },
    matchingText: {
        fontSize: '.8rem',
        fontFamily: 'graphik-italic',
        color: '#FFFF',
        textAlign: 'center',
        marginBottom: normalize(4),
        lineHeight: '2rem'
    },
    purchaseBoost: {
        backgroundColor: '#FAF0E8',
        marginVertical: normalize(15),
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(18),
        borderRadius: 13,
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
    },
    boostText: {
        fontSize: '1rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B',
    },
    boostIcon: {
        width: '3.3rem',
        height: '3.3rem',
    },
    boostContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '.8rem'
    },
    boostDetailsHead: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginRight: '1.8rem'
    },
    storeItemName: {
        fontSize: '.9rem',
        color: '#fff',
        fontFamily: 'gotham-bold',
        textShadowColor: '#121212',
        textShadowRadius: 1,
        textShadowOffset: {
            width: 1,
            height: 1,
        },
        position: 'absolute',
        left: 35,
        top: 10
    },
})