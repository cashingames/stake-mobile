import React, { useRef, useState } from "react";
import { Text, View, Image, ScrollView, Pressable, Alert } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useSelector, useDispatch } from 'react-redux';
import Constants from 'expo-constants';
import analytics from '@react-native-firebase/analytics';
import { formatNumber } from '../../utils/stringUtl';
import AppButton from "../../shared/AppButton";

import { startGame, setIsPlayingTrivia, setQuestionsCount, setGameDuration } from "./GameSlice";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";



export default function TriviaInstructionsScreen({ navigation, route }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const features = useSelector(state => state.common.featureFlags);
    const user = useSelector(state => state.auth.user)

    const isStakingFeatureEnabled = features['trivia_game_staking'] !== undefined && features['trivia_game_staking'].enabled == true;


    const params = route.params;
    const refRBSheet = useRef();


    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }
    const onProceed = () => {
        openBottomSheet()
    }
    console.log(params, 'instructions')


    const gotoStaking = async () => {
        await analytics().logEvent('initiate_live_trivia_staking', {
            'action': 'initiate',
            'id': user.username
        })
        navigation.navigate("LiveTriviaStaking", params)
    }

    return (
        <>
            <ScrollView style={styles.container}>
                <TriviaInstructions />
                <StakeAmount onPress={gotoStaking} />

                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={430}
                    subComponent={<AvailableBoosts onClose={closeBottomSheet}
                        trivia={params}
                        user={user}
                    />}
                />
            </ScrollView>
            {isStakingFeatureEnabled ?
                <View style={styles.nextButton}>
                    <StakeButton
                        onPress={gotoStaking}
                    />
                    <AppButton
                        onPress={onProceed}
                        text='Proceed'
                        style={styles.proceedButton}
                    />
                </View>
                :
                <AppButton
                    onPress={onProceed}
                    text='Proceed'
                    style={styles.proceed}
                />

            }

        </>
    );
};

const StakeButton = ({ onPress }) => {
    const features = useSelector(state => state.common.featureFlags);

    const isStakingFeatureEnabled = features['trivia_game_staking'] !== undefined && features['trivia_game_staking'].enabled == true;

    if (!isStakingFeatureEnabled) {
        return null;
    }

    return (
        <AppButton
            onPress={onPress}
            text='Stake Cash'
            style={styles.stakingButton}
            textStyle={styles.stakingButtonText}
        />
    )
}

const StakeAmount = ({ onPress }) => {
    const features = useSelector(state => state.common.featureFlags);

    const isStakingFeatureEnabled = features['trivia_game_staking'] !== undefined && features['trivia_game_staking'].enabled == true;

    if (!isStakingFeatureEnabled) {
        return null;
    }
    return (
        <View style={styles.stakeContainer}>
            <Text style={styles.stakeAmount}>Stand a chance of winning up to 1 Million
                Naira by playing this game
            </Text>
            <Pressable style={styles.stakeButton} onPress={onPress}>
                <Text style={styles.showMe}>PLAY NOW</Text>
            </Pressable>
        </View>
    )
}

const AvailableBoosts = ({ onClose, trivia, user }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const boosts = useSelector(state => state.auth.user.boosts);
    const [loading, setLoading] = useState(false);

    const onStartGame = () => {
        setLoading(true);
        dispatch(setIsPlayingTrivia(true))
        dispatch(setQuestionsCount(trivia.questionsCount));
        dispatch(setGameDuration(trivia.duration));
        dispatch(startGame({
            category: trivia.categoryId,
            type: trivia.typeId,
            mode: trivia.modeId,
            trivia: trivia.id
        }))
            .then(unwrapResult)
            .then(async () => {
                await analytics().logEvent('live_trivia_game_started', {
                    'action': 'initiate',
                    'id': user.username
                });
            })
            .then(result => {
                setLoading(false);
                onClose();
                navigation.navigate("GameInProgress", { triviaId: trivia.id })
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(rejectedValueOrSerializedError);
                Alert.alert(rejectedValueOrSerializedError.message)
                setLoading(false);
            });
    }



    const visitStore = () => {
        onClose();
        navigation.navigate('GameStore')
    }

    return (
        <View style={styles.availableBoosts}>
            <Text style={styles.title}>Available Boosts</Text>
            <View style={styles.boosts}>
                {boosts.map((boost, i) => <AvailableBoost boost={boost} key={i} />
                )}
            </View>
            <GoToStore onPress={visitStore} />
            <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={onStartGame} disabled={loading} />
        </View>
    )
}

const AvailableBoost = ({ boost }) => {
    return (
        <View style={styles.boostContent}>
            <View style={styles.boostAmount}>
                <Image
                    source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
                <Text style={styles.amount}>x{formatNumber(boost.count)}</Text>
            </View>
            <View style={styles.boostDetails}>
                <Text style={styles.boostName}>{boost.name}</Text>
                <Text style={styles.boostDescription}>{boost.description}</Text>
            </View>
        </View>
    )
}

const TriviaInstructions = () => {
    return (
        <>
            <View style={styles.instruction}>
                <Text style={styles.unicode}>{'\u0031'}.</Text>
                <Text style={styles.instructionText}>This trivia consists of  questions</Text>
            </View>
            <View style={styles.instruction}>
                <Text style={styles.unicode}>{'\u0032'}.</Text>
                <Text style={styles.instructionText}>You have limited time to answer these questions. Answer questions as correctly
                    and as rapidly as you can to stay at the top of the leaderboard.</Text>
            </View>
            <View style={styles.instruction}>
                <Text style={styles.unicode}>{'\u0033'}.</Text>
                <Text style={styles.instructionText}>Use boosts to increase your chances of winning the grand prize.</Text>
            </View>
        </>
    )
};


const GoToStore = ({ onPress }) => {
    return (
        <View style={styles.moreBoost}>

            <Pressable onPress={onPress}>
                <Text style={styles.needBoost}>Need more boosts?
                    <Text style={styles.storeLink}> Go to Store</Text>
                </Text>
            </Pressable>

        </View>
    )
}



const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5FF',
        paddingHorizontal: normalize(18),
        paddingTop: normalize(20),
        paddingBottom: normalize(5)

    },
    instruction: {
        flexDirection: 'row',
        marginBottom: normalize(20)
    },
    instructionHeader: {
        fontSize: '0.9rem',
        fontFamily: 'graphik-regular',
        color: '#4F4F4F',
        lineHeight: '1.4rem',
        textAlign: 'justify',
        width: responsiveScreenWidth(80),
        marginBottom: normalize(35)
    },
    unicode: {
        fontSize: '1.5rem',
        fontFamily: 'graphik-bold',
        color: '#4F4F4F',
        marginRight: normalize(10)
    },
    instructionText: {
        fontSize: '0.9rem',
        fontFamily: 'graphik-regular',
        color: '#4F4F4F',
        lineHeight: '1.4rem',
        textAlign: 'justify',
        width: responsiveScreenWidth(80)
    },
    buttonContainer: {
        marginTop: normalize(90),
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(32),
        borderRadius: 12,
        backgroundColor: '#EF2F55'
    },

    amount: {
        fontFamily: 'graphik-bold',
        fontSize: '0.8rem',
        color: '#FF932F'
    },
    title: {
        fontSize: '0.85rem',
        fontFamily: 'graphik-medium',
        color: '#000',
        lineHeight: 23,
        marginBottom: normalize(15)
    },
    boosts: {
        // alignItems: ''

    },
    boostContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        marginBottom: normalize(17)
    },
    boostAmount: {
        display: 'flex',
        flexDirection: 'row',
    },
    availableBoosts: {
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(20),
    },
    boostDetails: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: normalize(15),
        justifyContent: 'center'
    },
    boostName: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-bold',
        color: '#151C2F',
        lineHeight: '1.2rem',
    },
    boostDescription: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
        color: '#828282',
        lineHeight: '1.2rem',
        width: responsiveScreenWidth(60),
    },
    storeLink: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    needBoost: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
        color: '#000',
    },
    moreBoost: {
        alignItems: 'center',
    },
    startContainer: {
        marginTop: normalize(50),
    },
    boostIcon: {
        width: normalize(35),
        height: normalize(35)
    },
    proceed: {
        marginVertical: 10,
        marginHorizontal: normalize(18)
    },
    proceedButton: {
        marginVertical: 10,
        // paddingHorizontal:'2.5rem',
        width: '9rem',
        // height:'1rem'
    },
    stakingButton: {
        marginVertical: 10,
        backgroundColor: '#FFFF',
        // paddingHorizontal:'2.5rem',
        width: '9rem',
        borderColor: '#EF2F55',
        borderWidth: 1,
        // height:'1rem'
    },
    stakingButtonText: {
        color: '#EF2F55'
    },
    nextButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: normalize(18),
    },
    stakeContainer: {
        backgroundColor: '#518EF8',
        borderRadius: 15,
        paddingHorizontal: "2.5rem",
        paddingVertical: "1.3rem",
        marginTop: ".8rem",
        marginBottom: "1rem",
        alignItems: 'center',
        justifyContent: 'center'
    },
    stakeAmount: {
        fontSize: '1.1rem',
        fontFamily: 'graphik-medium',
        color: '#ffff',
        textAlign: 'center',
        lineHeight: '1.65rem'
    },
    stakeButton: {
        marginTop: '1rem',
        borderWidth: 1,
        borderColor: "#ffff",
        paddingVertical: '.8rem',
        paddingHorizontal: '1.3rem',
        borderRadius: 8
    },
    showMe: {
        fontSize: '.8rem',
        fontFamily: 'graphik-regular',
        color: '#ffff',
        textAlign: 'center',
    }
});
