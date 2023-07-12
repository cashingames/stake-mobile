import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, ActivityIndicator, Image, Pressable, TextInput, Alert } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import Input from "../../shared/Input";
import AppButton from "../../shared/AppButton";
import { geBonusStakes, getGameStakes, setAmountStaked, setIsPlayingTrivia, setWalletSource, startGame, startPracticeGame } from "./GameSlice";
import { getUser } from "../Auth/AuthSlice";
import { logActionToServer } from "../CommonSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import StakingPredictionsTable from "../../shared/StakingPredictionsTable";
import logToAnalytics from "../../utils/analytics";
import { formatCurrency } from "../../utils/stringUtl";
import CustomAlert from "../../shared/CustomAlert";
import { SelectList } from "react-native-dropdown-select-list";


const GameStakingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const gameStakes = useSelector(state => state.game.gameStakes);
    const bonusStakes = useSelector(state => state.game.bonusStakes);
    const minimumExhibitionStakeAmount = useSelector(state => state.common.minimumExhibitionStakeAmount);
    const gameCategoryId = useSelector(state => state.game.gameCategory.id);
    const gameTypeId = useSelector(state => state.game.gameType.id);
    const gameMode = useSelector(state => state.game.gameMode);
    const cashMode = useSelector(state => state.game.cashMode);
    const practiceMode = useSelector(state => state.game.practiceMode);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [canSend, setCanSend] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [selected, setSelected] = useState('');
    const [walletType, setWalletType] = useState('');
    const depositBalance = Number.parseFloat(user.walletBalance) - Number.parseFloat(user.withdrawableBalance)
    const depositBalanceSelected = selected === `Deposit (NGN ${formatCurrency(depositBalance)})` && Number.parseFloat(depositBalance) >= amount && amount >= Number.parseFloat(minimumExhibitionStakeAmount)
    const bonusSelected = selected === `Bonus (NGN ${formatCurrency(user.bonusBalance)})` && Number.parseFloat(user.bonusBalance) >= amount && amount >= Number.parseFloat(minimumExhibitionStakeAmount)

    useEffect(() => {
        if (cashMode && selected === `Deposit (NGN ${formatCurrency(depositBalance)})`) {
            setWalletType('deposit_balance')
        }
        if (cashMode && selected === `Bonus (NGN ${formatCurrency(user.bonusBalance)})`) {
            setWalletType('bonus_balance')
        }
        if (practiceMode && selected === `Deposit (NGN ${formatCurrency(100000)})`) {
            setWalletType('demo_deposit_balance')
        }
        if (practiceMode && selected === `Bonus (NGN ${formatCurrency(100000)})`) {
            setWalletType('demo_bonus_balance')
        }
    }, [selected])
    useEffect(() => {
        dispatch(getGameStakes())
        dispatch(geBonusStakes())
        dispatch(getUser())
    }, [])


    useEffect(() => {
        const canSend = selected !== '' && (depositBalanceSelected === true || bonusSelected === true) && amount !== ''
        // const canSend = amount !== '' && (amount >= Number.parseFloat(minimumExhibitionStakeAmount) && amount <= totalBalance);
        setCanSend(canSend);
    }, [amount, minimumExhibitionStakeAmount, selected, depositBalance, user.bonusBalance])

    const validate = () => {
        setLoading(true);
        logToAnalytics('exhibition_staking_initiated', {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        });
        dispatch(setAmountStaked(amount))
        onStartGame()

    }

    const fundWallet = async () => {
        logToAnalytics("insufficient_balance_fund_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('FundWallet')
    }

    const onStartGame = () => {
        setLoading(true);
        dispatch(setIsPlayingTrivia(false))
        if (practiceMode) {
            console.log('started practice')
            dispatch(setWalletSource(walletType))
            dispatch(startPracticeGame({
                category: gameCategoryId,
                amount: amount,
                wallet_type: walletType
            }))
                .then(unwrapResult)
                .then(result => {
                    dispatch(logActionToServer({
                        message: "Game session " + result.data.game.token + " questions recieved for " + user.username,
                        data: result.data.questions
                    }))
                        .then(unwrapResult)
                        .then(result => {
                            logToAnalytics("start_trivia_practice_game", {
                                'id': user.username,
                                'phone_number': user.phoneNumber,
                                'email': user.email
                            })
                        })
                    setLoading(false);
                    navigation.navigate("GamePracticeTour")
                })
                .catch((err) => {
                    processStartGameError(err)
                }).finally(() => {
                    setLoading(false);
                });
        }
        if (cashMode) {
            console.log('started normal')
            dispatch(setWalletSource(walletType))

            dispatch(startGame({
                category: gameCategoryId,
                type: gameTypeId,
                mode: gameMode.id,
                staking_amount: amount,
                wallet_type: walletType
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

    }

    const processStartGameError = async (err) => {
        const errors = err.message;
        setModalVisible(true)
        setAlertMessage(errors);

        const firstError = Array.isArray(errors) ? Object.values(errors, {})[0][0] : errors;
        setModalVisible(true)
        setAlertMessage(firstError);
    }

    const close = () => {

    }

    return (
        <ScrollView style={styles.container}>
            {cashMode &&
                <StakingBalances setSelected={setSelected} depositBalance={depositBalance} user={user} minimumExhibitionStakeAmount={minimumExhibitionStakeAmount} />
            }
            {practiceMode &&
                <PracticeStakingBalances setSelected={setSelected} />
            }
            {cashMode &&
                <>
                    <Input
                        label='Enter stake amount'
                        placeholder={`Minimum amount is NGN ${minimumExhibitionStakeAmount}`}
                        value={amount}
                        error={((selected === `Deposit (NGN ${formatCurrency(depositBalance)})` && amount < Number.parseFloat(minimumExhibitionStakeAmount)) && `Minimum staking amount is NGN ${minimumExhibitionStakeAmount}`) ||
                            ((selected === `Bonus (NGN ${formatCurrency(user.bonusBalance)})` && amount < Number.parseFloat(minimumExhibitionStakeAmount)) && `Minimum staking amount is NGN ${minimumExhibitionStakeAmount}`)}
                        onChangeText={setAmount}
                        isRequired={true}
                        keyboardType="numeric"
                    />
                    {(selected === `Deposit (NGN ${formatCurrency(depositBalance)})` && amount > Number.parseFloat(depositBalance)) &&
                        <View style={styles.errorContainer}>
                            <Text style={styles.error}>Insufficient wallet balance</Text>
                            <Pressable style={styles.fundError} onPress={fundWallet}>
                                <Text style={styles.fundText}>Fund wallet</Text>
                            </Pressable>
                        </View>
                    }
                    {(selected === `Bonus (NGN ${formatCurrency(user.bonusBalance)})` && amount > Number.parseFloat(user.bonusBalance)) &&
                        <View style={styles.errorContainer}>
                            <Text style={styles.error}>Insufficient bonus balance, stake from another balance</Text>
                        </View>
                    }
                </>
            }
            {practiceMode &&
                <View style={styles.inputContainer}>
                    <Text style={styles.inputLabel}>Enter stake amount</Text>
                    <TextInput style={styles.input} placeholder={`Minimum amount is NGN ${minimumExhibitionStakeAmount}`} value={amount}
                        onChangeText={setAmount}
                        keyboardType="numeric" />
                </View>
            }
            <View style={[styles.stakeContainer, { marginBottom: 0 }]}>
                <Text style={styles.stakeHeading}>Winning Odds</Text>
                <View style={styles.stakeHeaders}>
                    <Text style={styles.stakeScore}>OUTCOME</Text>
                    <Text style={styles.stakeHead}>ODDS</Text>
                    <Text style={styles.stakePay}>PAYOUT</Text>
                </View>
                {walletType === 'demo_deposit_balance' &&
                    <>
                        {gameStakes.map((gameStake, i) => <StakingPredictionsTable key={i} gameStake={gameStake} position={i + 1}
                            amount={amount} />)
                        }
                    </>
                }
                {walletType === 'deposit_balance' &&
                    <>
                        {gameStakes.map((gameStake, i) => <StakingPredictionsTable key={i} gameStake={gameStake} position={i + 1}
                            amount={amount} />)
                        }
                    </>
                }
                {walletType === '' &&
                    <>
                        {gameStakes.map((gameStake, i) => <StakingPredictionsTable key={i} gameStake={gameStake} position={i + 1}
                            amount={amount} />)
                        }
                    </>
                }
                {walletType === 'bonus_balance' &&
                    <>
                        {bonusStakes.map((gameStake, i) => <StakingPredictionsTable key={i} gameStake={gameStake} position={i + 1}
                            amount={amount} />)
                        }
                    </>
                }
                 {walletType === 'demo_bonus_balance' &&
                    <>
                        {bonusStakes.map((gameStake, i) => <StakingPredictionsTable key={i} gameStake={gameStake} position={i + 1}
                            amount={amount} />)
                        }
                    </>
                }
            </View>
            {/* <Pressable style={styles.instructionsContainer}>
                <Text style={styles.instructionsTitle}>Odds instructions</Text>
                <Ionicons name="chevron-forward" size={30} color='#072169' />
            </Pressable> */}
            {cashMode &&
                <AppButton text={loading ? <ActivityIndicator size="small" color="#FFFF" /> : "Stake Amount"} onPress={validate}
                    disabled={loading || !canSend} disabledStyle={styles.disabled} style={styles.stakeButtoni} />
            }
            {practiceMode &&
                <AppButton text={loading ? <ActivityIndicator size="small" color="#FFFF" /> : "Stake Amount"} onPress={validate}
                    disabled={loading || amount === '' || selected === ''} style={styles.stakeButtoni} />
            }
            <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                textLabel={alertMessage} buttonLabel='Ok, got it'
                alertImage={require('../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} doAction={close} />

        </ScrollView>
    )

}

const StakingBalances = ({ depositBalance, user, minimumExhibitionStakeAmount, setSelected }) => {
    const balanceAccounts = [
        {
            key: '1',
            value: `Deposit (NGN ${formatCurrency(depositBalance)})`,
            disabled: depositBalance < minimumExhibitionStakeAmount,
        },
        {
            key: '2',
            value: `Bonus (NGN ${formatCurrency(user.bonusBalance)})`,
            disabled: user.bonusBalance < minimumExhibitionStakeAmount,
        }
    ]
    const [balanceName, setBalanceName] = useState('')
    return (
        <View style={styles.balancesContainer}>
            <View style={styles.labelContainer}>
                <Text style={styles.balanceLabel}>Where are you staking from ?</Text>
                <Text style={styles.requiredText}>Required</Text>
            </View>
            <SelectList
                setSelected={(balanceName) => setBalanceName(balanceName)}
                data={balanceAccounts}
                save="value"
                onSelect={() => setSelected(balanceName)}
                placeholder="Select Wallet"
                fontFamily='sansation-regular'
                boxStyles={{ height: normalize(52), alignItems: 'center', borderColor: '#D9D9D9', backgroundColor: '#fff' }}
                inputStyles={{ fontSize: 18, color: '#072169' }}
                dropdownTextStyles={{ fontSize: 18, color: '#072169' }}
                dropdownItemStyles={{ borderBottomWidth: 1, borderBottomColor: '#D9D9D9' }}
                disabledTextStyles={{ fontSize: 18 }}
                disabledItemStyles={{ backgroundColor: '#F9FBFF' }}
            />
        </View>
    )
}

const PracticeStakingBalances = ({ setSelected }) => {
    const balanceAccounts = [
        {
            key: '1',
            value: `Deposit (NGN ${formatCurrency(100000)})`,
        },
        {
            key: '2',
            value: `Bonus (NGN ${formatCurrency(100000)})`,
        }
    ]
    const [balanceName, setBalanceName] = useState('')
    return (
        <View style={styles.balancesContainer}>
            <View style={styles.labelContainer}>
                <Text style={styles.balanceLabel}>Where are you staking from ?</Text>
                <Text style={styles.requiredText}>Required</Text>
            </View>
            <SelectList
                setSelected={(balanceName) => setBalanceName(balanceName)}
                data={balanceAccounts}
                save="value"
                onSelect={() => setSelected(balanceName)}
                placeholder="Select Wallet"
                fontFamily='sansation-regular'
                boxStyles={{ height: normalize(52), alignItems: 'center', borderColor: '#D9D9D9', backgroundColor: '#fff' }}
                inputStyles={{ fontSize: 18, color: '#072169' }}
                dropdownTextStyles={{ fontSize: 18, color: '#072169' }}
                dropdownItemStyles={{ borderBottomWidth: 1, borderBottomColor: '#D9D9D9' }}
                disabledTextStyles={{ fontSize: 18 }}
                disabledItemStyles={{ backgroundColor: '#F9FBFF' }}
            />
        </View>
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
    balancesContainer: {
        marginBottom: '1rem'
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '.6rem'
    },
    stakeContainer: {
        paddingHorizontal: normalize(20),
        paddingVertical: normalize(6),
        backgroundColor: '#FFF',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
        borderRadius: 13,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        marginTop: 0,
    },
    inputContainer: {
        marginTop: '.5rem',
        marginBottom: '.8rem'
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
        paddingBottom: '1rem'
    },
    stakeScore: {
        fontFamily: "gotham-bold",
        fontSize: ".85rem",
        color: "#072169",
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
    note: {
        fontFamily: "gotham-medium",
        fontSize: ".8rem",
        color: "#DF5921",
        lineHeight: '1.2rem',
        marginTop: '1rem'
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
        borderColor: '#072169',
        borderWidth: 2,
        borderRadius: 15,
        paddingHorizontal: '.8rem',
        paddingVertical: '.3rem'
    },
    fundText: {
        color: '#072169',
        fontFamily: 'gotham-medium',
        fontSize: '.7rem',
    },
    stakeButton: {
        marginVertical: 5,
    },
    stakeButtoni: {
        marginBottom: responsiveScreenWidth(20),
        marginTop: '.7rem'
    },
    input: {
        height: normalize(52),
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: normalize(13),
        paddingRight: normalize(13),
        borderColor: '#000000',
        fontFamily: 'sansation-regular',
        color: '#072169',
        fontSize: '0.85rem',
        backgroundColor: '#fff',
    },
    inputLabel: {
        fontFamily: 'gotham-medium',
        color: '#072169',
        fontSize: '0.98rem',
        marginBottom: normalize(7),

    },
    balanceLabel: {
        fontFamily: 'gotham-medium',
        color: '#072169',
        fontSize: '0.85rem',

    },
    requiredText: {
        fontFamily: 'sansation-regular',
        color: '#E15220',
        fontSize: '0.85rem',
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
    },
    instructionsTitle: {
        fontSize: '.85rem',
        color: '#072169',
        fontFamily: 'gotham-bold',
    },
})
