import React, { useEffect, useState, useRef } from "react";
import { Text, View, ScrollView, Alert, ActivityIndicator } from 'react-native';
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import normalize from "../../utils/normalize";
import { useNavigation } from '@react-navigation/native';
import Input from "../../shared/Input";
import AppButton from "../../shared/AppButton";
import { getGameStakes, setAmountStaked, setIsPlayingTrivia, startGame } from "./GameSlice";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";
import { getUser } from "../Auth/AuthSlice";
import { logActionToServer } from "../CommonSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import analytics from '@react-native-firebase/analytics';
import ExhibitionUserAvailableBoosts from "../../shared/ExhibitionUserAvailableBoosts";
import StakingPredictionsTable from "../../shared/StakingPredictionsTable";
import LowWalletBalance from "../../shared/LowWalletBalance";
import UserWalletBalance from "../../shared/UserWalletBalance";


const GameStakingScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector((state) => state.auth.user);
    const gameStakes = useSelector(state => state.game.gameStakes);
    const maximumExhibitionStakeAmount = useSelector(state => state.common.maximumExhibitionStakeAmount);
    const minimumExhibitionStakeAmount = useSelector(state => state.common.minimumExhibitionStakeAmount);
    const [amount, setAmount] = useState(500);
    const [loading, setLoading] = useState(false);
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

    useEffect(() => {
        if (Number.parseFloat(maximumExhibitionStakeAmount) > Number.parseFloat(user.walletBalance)) {
            setAmount(user.walletBalance)
        } else {
            setAmount(maximumExhibitionStakeAmount)
        }
    }, [maximumExhibitionStakeAmount, user.walletBalance])

    const validate = async () => {
        setLoading(true);
        if (Number.parseFloat(amount) < Number.parseFloat(minimumExhibitionStakeAmount)) {
            Alert.alert(`Minimum stake amount is ${minimumExhibitionStakeAmount} naira`);
            setLoading(false);
            return false;
        }

        if (Number.parseFloat(amount) > Number.parseFloat(maximumExhibitionStakeAmount)) {
            Alert.alert(`Maximum stake amount is ${maximumExhibitionStakeAmount} naira`);
            setLoading(false);
            return false;
        }
        if (Number.parseFloat(user.walletBalance) < Number.parseFloat(amount)) {
            await analytics().logEvent('exhibition_staking_low_balance', {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            });
            openBottomSheet();
            setLoading(false);
            return
        }
        return true
    }

    const proceed = (amount) => {
        dispatch(setAmountStaked(amount))
        if(Number.parseFloat(amount) < Number.parseFloat(minimumExhibitionStakeAmount) || Number.parseFloat(amount) > Number.parseFloat(maximumExhibitionStakeAmount)){
            closeBottomSheet()
        }else{
            openBottomSheet()
        }
    }

    const submit = () => {
        if (validate()) {
            analytics().logEvent('exhibition_staking_initiated', {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            });
            proceed(amount);
            setLoading(false);
        }
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
                <AppButton text={loading ? <ActivityIndicator size="small" color="#FFFF" /> : "Stake Amount"} onPress={submit} disabled={loading} />
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
                    subComponent={
                        <LowWalletBalance
                            onClose={closeBottomSheet}
                            errorDescription="You do not have enough balance to stake this amount"
                        />}
                />
                :
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={460}
                    subComponent={<AvailableBoosts onClose={closeBottomSheet}
                        amount={amount}
                        user={user}
                    />}
                />
            }

        </ScrollView>
    )

}

const AvailableBoosts = ({ onClose, amount, user }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const boosts = useSelector(state => state.auth.user.boosts);
    const gameCategoryId = useSelector(state => state.game.gameCategory.id);
    const gameTypeId = useSelector(state => state.game.gameType.id);
    const gameMode = useSelector(state => state.game.gameMode);
    const [loading, setLoading] = useState(false);

    const onStartGame = () => {
        setLoading(true);
        dispatch(setIsPlayingTrivia(false))
        dispatch(startGame({
            category: gameCategoryId,
            type: gameTypeId,
            mode: gameMode.id,
            staking_amount: amount
        }))
            .then(unwrapResult)
            .then(result => {
                dispatch(logActionToServer({
                    message: "Game session " + result.data.game.token + " questions recieved for " + user.username,
                    data: result.data.questions
                }))
                    .then(unwrapResult)
                    .then(async result => {
                        await analytics().logEvent("start_exhibition_game_with_staking", {
                            'id': user.username,
                            'phone_number': user.phoneNumber,
                            'email': user.email
                        })
                        // console.log('Action logged to server');
                    })
                    .catch((e) => {
                        // console.log('Failed to log to server');
                    });
                setLoading(false);
                onClose();
                navigation.navigate("GameInProgress")
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(rejectedValueOrSerializedError);
                Alert.alert('The selected category is not available for now, try again later.');
                setLoading(false);
            });
    }

    return (
        <ExhibitionUserAvailableBoosts gameMode={gameMode}
            boosts={boosts} onStartGame={onStartGame}
            loading={loading} onClose={onClose}
        />
    )
}

export default GameStakingScreen;

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
    stakeScoreDigit: {
        fontFamily: "graphik-medium",
        fontSize: ".7rem",
        color: "#333333",
        marginLeft: '.3rem',
        opacity: 0.7
    },
})