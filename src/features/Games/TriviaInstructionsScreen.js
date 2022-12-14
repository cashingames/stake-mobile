import React, { useRef, useState } from "react";
import { Text, View, ScrollView, Alert } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import { unwrapResult } from '@reduxjs/toolkit';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import analytics from '@react-native-firebase/analytics';
import AppButton from "../../shared/AppButton";
import { startGame, setIsPlayingTrivia, setQuestionsCount, setGameDuration } from "./GameSlice";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";
import ExhibitionStakeAmount from "../../shared/ExhibitionStakeAmount";
import crashlytics from '@react-native-firebase/crashlytics';
import StakingButtons from "../../shared/StakingButtons";
import LiveTriviaUserAvailableBoosts from "../../shared/LiveTriviaUserAvailableBoosts";



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


    const gotoStaking = async () => {
        await analytics().logEvent('initiate_live_trivia_staking', {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate("LiveTriviaStaking", params)
    }

    return (
        <View style={styles.container}>
            <ScrollView>
                <TriviaInstructions />
                {isStakingFeatureEnabled &&
                    <ExhibitionStakeAmount onPress={gotoStaking} />
                }
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={430}
                    subComponent={<AvailableBoosts onClose={closeBottomSheet}
                        trivia={params}
                        user={user}
                    />}
                />
            </ScrollView>
            <View style={styles.stakingButtons}>
                <AppButton
                    onPress={onProceed}
                    text={isStakingFeatureEnabled ? 'Play exhibition' : 'Proceed'}
                    style={isStakingFeatureEnabled ? styles.proceed : styles.noStaking}
                    textStyle={isStakingFeatureEnabled ? styles.buttonText : styles.noStakingText}
                />
                {isStakingFeatureEnabled &&
                    <StakingButtons onPress={gotoStaking} />
                }
            </View>

        </View>
    );
};

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
                crashlytics().log('User started live trivia game');
                await analytics().logEvent('live_trivia_game_started', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                });
            })
            .then(result => {
                setLoading(false);
                onClose();
                navigation.navigate("GameInProgress", { triviaId: trivia.id })
            })
            .catch((error, rejectedValueOrSerializedError) => {
                // console.log(rejectedValueOrSerializedError);
                crashlytics().recordError(error);
                crashlytics().log('failed to start live trivia game');
                setLoading(false);
                Alert.alert(rejectedValueOrSerializedError.message)
            });
    }

    return (
        <LiveTriviaUserAvailableBoosts onClose={onClose} boosts={boosts}
            loading={loading} onStartGame={onStartGame} />
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
    title: {
        fontSize: '0.85rem',
        fontFamily: 'graphik-medium',
        color: '#000',
        lineHeight: 23,
        marginBottom: normalize(15)
    },
    availableBoosts: {
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(20),
    },
    proceed: {
        marginVertical: 10,
        backgroundColor: '#FFFF',
        borderColor: '#EF2F55',
        borderWidth: 1,
        width: '9rem',
        paddingHorizontal: normalize(5)
    },
    noStaking: {
        marginVertical: 10,
        backgroundColor: '#EF2F55',
        width: '100%'
    },
    stakingButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buttonText: {
        color: '#EF2F55'
    },
    noStakingText: {
        color: '#FFFF',
        width: '9rem',
        borderColor: '#EF2F55',
        borderWidth: 1,
    },
    noStakeProcced: {
        width: '100%',
        marginVertical: 10,
    },
    proceedText: {
        color: '#EF2F55',
    },
    noStakeText: {
        color: '#FFFF',
    },
    playButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between'

    }
});
