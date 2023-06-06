import React, { useEffect, useState, useRef } from "react";
import { Text, View, ScrollView, Alert, ActivityIndicator, Image, Pressable } from 'react-native';
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import normalize from "../../utils/normalize";
// import { useNavigation } from '@react-navigation/native';
import Input from "../../shared/Input";
import AppButton from "../../shared/AppButton";
import { getGameStakes, setAmountStaked, setIsPlayingTrivia, startGame } from "./GameSlice";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";
import { getUser } from "../Auth/AuthSlice";
import { logActionToServer } from "../CommonSlice";
import { unwrapResult } from "@reduxjs/toolkit";
// import ExhibitionUserAvailableBoosts from "../../shared/ExhibitionUserAvailableBoosts";
import StakingPredictionsTable from "../../shared/StakingPredictionsTable";
import LowWalletBalance from "../../shared/LowWalletBalance";
import UserWalletBalance from "../../shared/UserWalletBalance";
import logToAnalytics from "../../utils/analytics";
import { formatCurrency } from "../../utils/stringUtl";
import { Ionicons } from "@expo/vector-icons";


const GameStakingScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector((state) => state.auth.user);
    const gameStakes = useSelector(state => state.game.gameStakes);
    const maximumExhibitionStakeAmount = useSelector(state => state.common.maximumExhibitionStakeAmount);
    const minimumExhibitionStakeAmount = useSelector(state => state.common.minimumExhibitionStakeAmount);
    const gameCategoryId = useSelector(state => state.game.gameCategory.id);
    const gameTypeId = useSelector(state => state.game.gameType.id);
    const gameMode = useSelector(state => state.game.gameMode);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [canSend, setCanSend] = useState(false);
    const [hidden, setHidden] = useState(false);
    const dispatch = useDispatch();

    const toggleSecureText = () => {
        setHidden(!hidden);
    }

    useEffect(() => {
        dispatch(getGameStakes())
        dispatch(getUser())
    }, [])

    // useEffect(() => {
    //     if (Number.parseFloat(maximumExhibitionStakeAmount) > Number.parseFloat(user.walletBalance)) {
    //         setAmount(user.walletBalance)
    //     } else {
    //         setAmount(maximumExhibitionStakeAmount)
    //     }
    // }, [maximumExhibitionStakeAmount, user.walletBalance])


    useEffect(() => {

        const invalid = amount === '' || amount < minimumExhibitionStakeAmount || amount > Number.parseFloat(user.walletBalance)
        setCanSend(!invalid);

    }, [amount, minimumExhibitionStakeAmount, user.walletBalance])

    const validate = () => {
        setLoading(true);
        // if (Number.parseFloat(amount) < Number.parseFloat(minimumExhibitionStakeAmount)) {
        //     Alert.alert(`Minimum stake amount is ${minimumExhibitionStakeAmount} naira`);
        //     setLoading(false);
        //     return false;
        // }

        // if (Number.parseFloat(amount) > Number.parseFloat(maximumExhibitionStakeAmount)) {
        //     Alert.alert(`Maximum stake amount is ${maximumExhibitionStakeAmount} naira`);
        //     setLoading(false);
        //     return false;
        // }
        // if (Number.parseFloat(user.walletBalance) < Number.parseFloat(amount)) {
        //     logToAnalytics('exhibition_staking_low_balance', {
        //         'id': user.username,
        //         'phone_number': user.phoneNumber,
        //         'email': user.email
        //     });
        //     openBottomSheet();
        //     setLoading(false);
        //     return
        // }
        logToAnalytics('exhibition_staking_initiated', {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        });
        dispatch(setAmountStaked(amount))
        onStartGame()

    }

    const depositFunds = async () => {
        logToAnalytics("deposit_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('Wallet')
    }
    const fundWallet = async () => {
        logToAnalytics("insufficient_balance_fund_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('Wallet')
    }

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
                    .then(result => {
                        logToAnalytics("start_trivia_staking_game", {
                            'id': user.username,
                            'phone_number': user.phoneNumber,
                            'email': user.email
                        })
                        // console.log('Action logged to server');
                    })
                setLoading(false);
                navigation.navigate("GameInProgress")
            })
            .catch((err) => {
                processStartGameError(err)
            }).finally(() => {
                setLoading(false);
            });
    }

    const processStartGameError = async (err) => {
        const errors = err.message;
        Alert.alert(errors)

        const firstError = Array.isArray(errors) ? Object.values(errors, {})[0][0] : errors;
        Alert.alert(firstError)
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.detailsContainer}>
                <View style={styles.totalHeader}>
                    <View style={styles.totalTitleContainer}>
                        <Image
                            source={require('../../../assets/images/wallet-with-cash.png')}
                            style={styles.avatar}
                        />
                        <Text style={styles.totalTitleText}>Total balance</Text>
                    </View>
                    <Ionicons name={hidden ? 'eye-off-outline' : "eye-outline"} size={22} color="#072169" onPress={toggleSecureText} />
                </View>
                <View style={styles.currencyHeader}>
                    <View style={styles.currencyHeaderLeft}>
                        <Text style={styles.currencyText}>NGN</Text>
                        {hidden ?
                            <Text style={styles.currencyAmount}>***</Text>
                            :
                            <Text style={styles.currencyAmount}>{formatCurrency(user.walletBalance ?? 0)}</Text>
                        }
                    </View>
                    <Pressable style={styles.currencyHeaderRight} onPress={depositFunds}>
                        <Text style={styles.depositText}>Deposit</Text>
                        <Ionicons name='chevron-forward-sharp' size={20} color='#072169' />
                    </Pressable>
                </View>
            </View>
            <Input
                label='Enter stake amount'
                placeholder={`Minimum stake amount must be NGN ${minimumExhibitionStakeAmount}`}
                value={amount}
                error={((amount < minimumExhibitionStakeAmount) && `Minimum staking amount is NGN ${minimumExhibitionStakeAmount}`) ||
                ((amount > Number.parseFloat(user.walletBalance)))}
                onChangeText={setAmount}
                isRequired={true}
                keyboardType="numeric"
            />
            {amount > Number.parseFloat(user.walletBalance) &&
                <View style={styles.errorContainer}>
                    <Text style={styles.error}>Insufficient wallet balance</Text>
                    <Pressable style={styles.fundError} onPress={fundWallet}>
                        <Text style={styles.fundText}>Fund wallet</Text>
                    </Pressable>
                </View>
            }
                <AppButton text={loading ? <ActivityIndicator size="small" color="#FFFF" /> : "Stake Amount"} onPress={validate} 
                disabled={loading || !canSend} disabledStyle={styles.disabled} style={styles.stakeButton} />
            <View style={styles.stakeContainer}>
                <Text style={styles.stakeHeading}>HOW TO WIN</Text>
                <View style={styles.stakeHeaders}>
                    <Text style={styles.stakeScore}>OUTCOME</Text>
                    <Text style={styles.stakeHead}>ODDS</Text>
                    <Text style={styles.stakePay}>PAYOUT</Text>
                </View>
                {gameStakes.map((gameStake, i) => <StakingPredictionsTable key={i} gameStake={gameStake} position={i + 1}
                    amount={amount} />)}
            </View>

        </ScrollView>
    )

}




export default GameStakingScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingBottom: normalize(10),
        paddingTop: normalize(20),
        paddingHorizontal: normalize(18)
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
        backgroundColor:'#FFF',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        borderRadius: 13,
        borderColor:'#E5E5E5',
        borderWidth: 1,
        marginTop:'1rem',
        marginBottom:'3.5rem'
    },
    stakeHeading: {
        textAlign: 'center',
        fontFamily: "gotham-bold",
        fontSize: ".95rem",
        color: "#072169",
        marginVertical: '1.1rem',
    },
    stakeHeaders: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: normalize(10),
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        paddingBottom:'1rem'
    },
    stakeScore: {
        fontFamily: "gotham-bold",
        fontSize: ".85rem",
        color: "#072169",
        // marginLeft: '.3rem',
    },
    stakeHead: {
        fontFamily: "gotham-bold",
        fontSize: ".85rem",
        color: "#072169",
        marginRight: '1rem',
    },
    stakePay: {
        fontFamily: "gotham-bold",
        fontSize: ".85rem",
        color: "#072169",
        marginRight: '1rem',
    },
    disabled: {
        backgroundColor: '#EA8663'
    },
    detailsContainer: {
        backgroundColor: '#fff',
        borderRadius: 13,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        paddingHorizontal: '1.3rem',
        paddingVertical: '1.1rem',
        marginBottom: '1.5rem',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
    },
    totalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    totalTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalTitleText: {
        color: '#072169',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        marginLeft: '.4rem'
    },
    avatar: {
        width: '1.35rem',
        height: '1.35rem'
    },
    currencyText: {
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '1.1rem',
        marginRight: '.3rem'
    },
    currencyAmount: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '1.1rem',
    },
    currencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '.7rem',
        justifyContent: 'space-between'
    },
    currencyHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    currencyHeaderRight: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    depositText: {
        color: '#072169',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
    },
    errorContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    error: {
        fontFamily: 'gotham-medium',
        color: '#EF2F55',
        fontSize: normalize(13),
    },
    fundError: {
        borderColor:'#072169',
        borderWidth: 2,
        borderRadius: 15,
        paddingHorizontal:'.8rem',
        paddingVertical:'.3rem'
    },
    fundText: {
        color: '#072169',
        fontFamily: 'gotham-medium',
        fontSize: '.7rem',
    }, 
    stakeButton: {
        marginVertical: 5,
    }
})