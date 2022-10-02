import React, { useEffect, useState, useRef } from "react";
import { Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import normalize from "../../utils/normalize";
import { useNavigation, } from '@react-navigation/native';
import Input from "../../shared/Input";
import AppButton from "../../shared/AppButton";
import { canStake, getGameStakes, setGameDuration, setIsPlayingTrivia, setQuestionsCount, startGame } from "./GameSlice";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";
import { getUser } from "../Auth/AuthSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import analytics from '@react-native-firebase/analytics';
import LiveTriviaUserAvailableBoosts from "../../shared/LiveTriviaUserAvailableBoosts";
import StakingPredictionsTable from "../../shared/StakingPredictionsTable";
import LowWalletBalance from "../../shared/LowWalletBalance";
import UserWalletBalance from "../../shared/UserWalletBalance";



const LiveTriviaStakingScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector((state) => state.auth.user);
    const gameStakes = useSelector(state => state.game.gameStakes);
    const params = route.params;
    const maximumStakeAmount = useSelector(state => state.common.maximumStakeAmount);
    const minimumStakeAmount = useSelector(state => state.common.minimumStakeAmount);
    const [loading, setLoading] = useState(false);
    const [amount, setAmount] = useState(200);
    const dispatch = useDispatch();
    const refRBSheet = useRef();

    const openBottomSheet = async () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        dispatch(getUser());
        refRBSheet.current.close()
    }

    useEffect(() => {
        dispatch(getGameStakes())
        dispatch(getUser())
    }, [])

    const startGame = async () => {
        setLoading(true);
        if (Number.parseFloat(user.walletBalance) < Number.parseFloat(amount)) {
            await analytics().logEvent('live_trivia_staking_low_balance', {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            });
            openBottomSheet();
            setLoading(false);
            return
        }

        if (Number.parseFloat(amount) < Number.parseFloat(minimumStakeAmount)) {
            Alert.alert("Minimum stake amount is 100 naira");
            setLoading(false);
            return false;
        }

        if (Number.parseFloat(amount) > Number.parseFloat(maximumStakeAmount)) {
            Alert.alert("Maximum stake amount is 1000 naira");
            setLoading(false);
            return false;
        }

        canStake({ staking_amount: amount })
            .then(async response => {
                await analytics().logEvent('live_trivia_staking_initiated', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                });
                openBottomSheet();
                setLoading(false);
            },
                err => {
                    if (!err || !err.response || err.response === undefined) {
                        Alert.alert("Your Network is Offline.");
                        setLoading(false);
                    }
                    else if (err.response.status === 400) {
                        Alert.alert(err.response.data.message);
                        setLoading(false);

                    }
                }
            )
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.amountContainer}>
                <UserWalletBalance balance={user.walletBalance} />
                <Input
                    style={styles.fundAmount}
                    value={amount}
                    defaultValue="200"
                    keyboardType="numeric"
                    onChangeText={setAmount}
                    autoFocus={true}
                    placeholder="Enter Stake Amount"
                    min
                />
            </View>
            <View style={styles.buttonContainer}>
                <AppButton text={loading ? <ActivityIndicator size="small" color="#FFFF" /> : "Stake Amount"} onPress={startGame} disabled={loading} />
            </View>
            <View style={styles.stakeContainer}>
                <Text style={styles.stakeHeading}>Predictions Table</Text>
                <View style={styles.stakeHeaders}>
                    <Text style={styles.stakeHead}>WINNINGS</Text>
                    <Text style={styles.stakeScore}>SCORE</Text>
                    <Text style={styles.stakeHead}>ODDS</Text>
                </View>
                {gameStakes.map((gameStake, i) => <StakingPredictionsTable key={i} gameStake={gameStake} position={i + 1}
                    amount={amount} />)}
            </View>

            {Number.parseFloat(user.walletBalance) < Number.parseFloat(amount) ?
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={620}
                    subComponent={<LowWalletBalance onClose={closeBottomSheet} />}
                />
                :
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={460}
                    subComponent={<AvailableBoosts trivia={params}
                        onClose={closeBottomSheet} amount={amount}
                        user={user}
                    />}
                />
            }

        </ScrollView>
    )

}

const AvailableBoosts = ({ onClose, trivia, amount, user }) => {
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
            trivia: trivia.id,
            staking_amount: amount

        }))
            .then(unwrapResult)
            .then(async () => {
                await analytics().logEvent('live_trivia_game_with_staking_started', {
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
            .catch((rejectedValueOrSerializedError) => {
                // console.log(rejectedValueOrSerializedError);
                Alert.alert(rejectedValueOrSerializedError.message)
                setLoading(false);
            });
    }


    return (
        <LiveTriviaUserAvailableBoosts onClose={onClose} boosts={boosts}
            loading={loading} onStartGame={onStartGame} />
    )
}

export default LiveTriviaStakingScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        paddingBottom: normalize(10)
    },
    amountContainer: {
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(20),
        backgroundColor: '#FFFF',
    },
    fundAmount: {
        fontFamily: "graphik-medium",
        fontSize: "1.7rem",
        color: "#333333",
        marginVertical: normalize(10),
        opacity: 0.65,
        textAlign: "center",
    },
    buttonContainer: {
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(6),
        backgroundColor: '#FFFF',
    },
    stakeContainer: {
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(6),
    },
    stakeHeading: {
        textAlign: 'center',
        fontFamily: "graphik-medium",
        fontSize: "1rem",
        color: "#EF2F55",
        marginVertical: '1rem',
    },
    stakeHeaders: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: normalize(10),
    },
    stakeHead: {
        fontFamily: "graphik-medium",
        fontSize: ".8rem",
        color: "#333333",
    },

})