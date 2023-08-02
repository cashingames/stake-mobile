import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Text, View, Pressable } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import AppButton from '../../../shared/AppButton';
import Input from '../../../shared/Input';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../../utils/normalize';
import Constants from 'expo-constants';
import { formatCurrency, formatNumber } from '../../../utils/stringUtl';
import { unwrapResult } from '@reduxjs/toolkit';
import { startChallengeRequest, startPracticeChallengeRequest } from './TriviaChallengeGameSlice';
import logToAnalytics from '../../../utils/analytics';
import CustomAlert from '../../../shared/CustomAlert';
import { SelectList } from 'react-native-dropdown-select-list';
import { getUser } from '../../Auth/AuthSlice';



const ChallengeStakingScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const boosts = useSelector(state => state.auth.user.boosts);
    const minimumChallengeStakeAmount = useSelector(state => state.common.minimumChallengeStakeAmount);
    const maximumChallengeStakeAmount = useSelector(state => state.common.maximumChallengeStakeAmount);
    const gameCategoryId = useSelector(state => state.game.gameCategory.id);
    const [amount, setAmount] = useState('');
    const [loading, setLoading] = useState(false);
    const [canSend, setCanSend] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [selected, setSelected] = useState('');
    const [walletType, setWalletType] = useState('');
    const depositBalance = Number.parseFloat(user.walletBalance) - Number.parseFloat(user.withdrawableBalance);
    const depositBalanceSelected = selected === 1 && Number.parseFloat(depositBalance) >= amount && amount >= Number.parseFloat(minimumChallengeStakeAmount)
    const bonusSelected = selected === 2 && Number.parseFloat(user.bonusBalance) >= amount && amount >= Number.parseFloat(minimumChallengeStakeAmount)
    const cashMode = useSelector(state => state.game.cashMode);
    const practiceMode = useSelector(state => state.game.practiceMode);

    const stakeAmount = async () => {
        setLoading(true);
        dispatch(startChallengeRequest({
            category: gameCategoryId,
            amount: amount,
            wallet_type: walletType
        })).then(unwrapResult)
            .then(async result => {
                setLoading(false)
                logToAnalytics("cash_challenge_stake_now_clicked", {
                    'amount': amount,
                })
                navigation.navigate('ChallengeMatching')
            })
            .catch((rejectedValueOrSerializedError) => {
                setModalVisible(true)
                setAlertMessage("Something went wrong. Please try again or contact support");
                setLoading(false)
            });
    }

    const stakePracticeAmount = async () => {
        setLoading(true);
        dispatch(startPracticeChallengeRequest({
            category: gameCategoryId,
            amount: amount,
            wallet_type: walletType
        })).then(unwrapResult)
            .then(async result => {
                setLoading(false)
                logToAnalytics("practice_challenge_stake_now_clicked", {
                    'amount': amount,
                })
                navigation.navigate('ChallengeMatching')
            })
            .catch((rejectedValueOrSerializedError) => {
                setModalVisible(true)
                setAlertMessage("Something went wrong. Please try again or contact support");
                setLoading(false)
            });
    }

    const fundWallet = async () => {
        logToAnalytics("insufficient_challenge_balance_fund_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('FundWallet')
    }

    const close = () => {

    }

    useEffect(() => {
        dispatch(getUser());
    },[])

    useEffect(() => {
        if (cashMode && selected === 1) {
            setWalletType('CREDIT_BALANCE')
        }
        if (cashMode && selected === 2) {
            setWalletType('BONUS_BALANCE')
        }
        if (practiceMode && selected === 1) {
            setWalletType('DEMO_CREDIT_BALANCE')
        }
        if (practiceMode && selected === 2) {
            setWalletType('DEMO_BONUS_BALANCE')
        }
    }, [selected])

    useEffect(() => {
        const canSend = selected !== '' && (depositBalanceSelected === true || bonusSelected === true) && amount !== ''
        setCanSend(canSend);
    }, [amount, minimumChallengeStakeAmount, selected, depositBalance, user.bonusBalance])

    return (
        <>
            <ImageBackground source={require('../../../../assets/images/match-background.png')}
                style={{ flex: 1 }}
                resizeMethod="resize">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.headContainer}
                >

                    <ScrollView style={styles.container}>

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
                        <SelectedPlayers user={user} />
                        <WalletDetails user={user} cashMode={cashMode} practiceMode={practiceMode} depositBalance={depositBalance} />
                        {cashMode &&
                            <StakingBalances setSelected={setSelected} depositBalance={depositBalance} user={user} />
                        }
                        {practiceMode &&
                            <PracticeStakingBalances setSelected={setSelected} />
                        }
                        {cashMode &&
                            <>
                                <Input
                                    label='Enter amount'
                                    placeholder={`Minimum amount is NGN ${minimumChallengeStakeAmount}`}
                                    value={amount}
                                    error={((selected === 1 && amount < Number.parseFloat(minimumChallengeStakeAmount)) && `Minimum staking amount is NGN ${minimumChallengeStakeAmount}`) ||
                                        ((selected === 2 && amount < Number.parseFloat(minimumChallengeStakeAmount)) && `Minimum staking amount is NGN ${minimumChallengeStakeAmount}`) ||
                                        ((amount > Number.parseFloat(maximumChallengeStakeAmount)) && `Maximum amount is NGN ${maximumChallengeStakeAmount}`) ||
                                        ((amount < Number.parseFloat(minimumChallengeStakeAmount)) && `Minimum amount is NGN ${minimumChallengeStakeAmount}`)
                                    }
                                    onChangeText={setAmount}
                                    isRequired={true}
                                    keyboardType="numeric"
                                />
                                {(selected === 1 && amount > Number.parseFloat(depositBalance)) &&
                                    <View style={styles.errorContainer}>
                                        <Text style={styles.error}>Insufficient wallet balance</Text>
                                        <Pressable style={styles.fundError} onPress={fundWallet}>
                                            <Text style={styles.fundText}>Fund wallet</Text>
                                        </Pressable>
                                    </View>
                                }
                                {(selected === 2 && amount > Number.parseFloat(user.bonusBalance)) &&
                                    <View style={styles.errorContainer}>
                                        <Text style={styles.error}>Insufficient bonus balance, stake from another balance</Text>
                                    </View>
                                }
                            </>
                        }
                        {practiceMode &&
                            <Input
                                label='Enter amount'
                                placeholder={`Minimum amount is NGN ${minimumChallengeStakeAmount}`}
                                value={amount}
                                error={((amount < Number.parseFloat(minimumChallengeStakeAmount)) && `Minimum staking amount is NGN ${minimumChallengeStakeAmount}`) ||
                                ((amount > Number.parseFloat(maximumChallengeStakeAmount)) && `Maximum amount is NGN ${maximumChallengeStakeAmount}`)
                            }
                                onChangeText={setAmount}
                                isRequired={true}
                                keyboardType="numeric"
                            />
                        }

                        {cashMode &&
                            <AppButton text={loading ? <ActivityIndicator size="small" color="#FFFF" /> : "Stake amount"} onPress={stakeAmount} disabled={loading || !canSend}
                                style={styles.stakeButton} disabledStyle={styles.disabled} isIcon={true} iconColor="#FFF" />
                        }
                        {practiceMode &&
                            <AppButton text={loading ? <ActivityIndicator size="small" color="#FFFF" /> : "Stake amount"} onPress={stakePracticeAmount} disabled={loading || amount === '' || selected === ''}
                                style={styles.stakeButton} disabledStyle={styles.disabled} isIcon={true} iconColor="#FFF" />
                        }
                        <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                            textLabel={alertMessage} buttonLabel='Ok, got it'
                            alertImage={require('../../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} doAction={close} />

                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </>
    )
}

const SelectedPlayers = ({ user }) => {
    const username = user.username?.charAt(0) + user.username?.charAt(1);

    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerName={user.username} playerAvatar={username} backgroundColor='#ccded48c' />

            <Image
                source={require('../../../../assets/images/versus.png')}
                style={styles.versus}
            />
            <SelectedPlayer playerName="...." playerAvatar="?" backgroundColor='#FEECE7' />
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

const WalletDetails = ({ practiceMode, cashMode, depositBalance }) => {
    return (
        <View style={styles.detailsContainer}>
            <View style={styles.totalHeader}>
                <View style={styles.totalTitleContainer}>
                    {practiceMode &&
                        <Text style={styles.totalTitleText}>Demo Balance</Text>
                    }
                    {cashMode &&
                        <Text style={styles.totalTitleText}>Deposit Balance</Text>
                    }

                </View>
            </View>
            <View style={styles.currencyHeader}>
                <View style={styles.currencyHeaderLeft}>
                    <Text style={styles.currencyText}>NGN</Text>
                    {cashMode &&
                        <Text style={styles.currencyAmount}>{formatCurrency(depositBalance ?? 0)}</Text>
                    }
                    {practiceMode &&
                        <Text style={styles.currencyAmount}>{formatCurrency(100000)}</Text>
                    }

                </View>
            </View>
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

const StakingBalances = ({ depositBalance, user, setSelected }) => {
    const balanceAccounts = [
        {
            key: 1,
            value: `Deposit (NGN ${formatCurrency(depositBalance)})`,
            disabled: depositBalance == 0,
        },
        {
            key: 2,
            value: `Bonus (NGN ${formatCurrency(user.bonusBalance)})`,
            disabled: user.bonusBalance == 0,
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
                save="key"
                onSelect={() => setSelected(balanceName)}
                placeholder="Select Wallet"
                fontFamily='sansation-bold'
                boxStyles={{ height: normalize(52), alignItems: 'center', borderColor: '#D9D9D9', backgroundColor: '#fff' }}
                inputStyles={{ fontSize: 17, color: '#1C453B' }}
                dropdownTextStyles={{ fontSize: 18, color: '#1C453B' }}
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
            key: 1,
            value: `Deposit (NGN ${formatCurrency(100000)})`,
        },
        {
            key: 2,
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
                save="key"
                onSelect={() => setSelected(balanceName)}
                placeholder="Select Wallet"
                fontFamily='sansation-bold'
                boxStyles={{ height: normalize(52), alignItems: 'center', borderColor: '#D9D9D9', backgroundColor: '#fff' }}
                inputStyles={{ fontSize: 17, color: '#1C453B' }}
                dropdownTextStyles={{ fontSize: 18, color: '#1C453B' }}
                dropdownItemStyles={{ borderBottomWidth: 1, borderBottomColor: '#D9D9D9' }}
                disabledTextStyles={{ fontSize: 18 }}
                disabledItemStyles={{ backgroundColor: '#F9FBFF' }}
            />
        </View>
    )
}

export default ChallengeStakingScreen;

const styles = EStyleSheet.create({
    headContainer: {
        flex: 1,
    },
    container: {
        paddingHorizontal: normalize(18),
        flex: 1
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
    stakeButton: {
        marginTop: 20,
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
    cardDescription: {
        fontFamily: 'graphik-medium',
        fontSize: '0.73rem',
        color: '#828282',
        lineHeight: responsiveScreenHeight(2.5),
        width: responsiveScreenWidth(38),
        textAlign: 'center'
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
    cardDescription: {
        fontFamily: 'graphik-medium',
        fontSize: '0.73rem',
        color: '#FFFF',
        lineHeight: responsiveScreenHeight(2.5),
        width: responsiveScreenWidth(38),
        textAlign: 'center'
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
    disabled: {
        backgroundColor: '#EA8663'
    },

    detailsContainer: {
        backgroundColor: '#fff',
        borderRadius: 13,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        paddingHorizontal: '1.3rem',
        paddingVertical: '1rem',
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
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '.95rem',
    },
    versus: {
        width: '3.2rem',
        height: '7.9rem'
    },
    currencyText: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1.2rem',
        marginRight: '.3rem'
    },
    currencyAmount: {
        color: '#1C453B',
        fontFamily: 'sansation-bold',
        fontSize: '1.2rem',
    },
    currencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '.4rem',
        justifyContent: 'space-between'
    },
    currencyHeaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
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
        borderColor: '#1C453B',
        borderWidth: 2,
        borderRadius: 15,
        paddingHorizontal: '.8rem',
        paddingVertical: '.3rem'
    },
    fundText: {
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '.7rem',
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
    balanceLabel: {
        fontFamily: 'gotham-bold',
        color: '#1C453B',
        fontSize: '0.9rem',

    },
    requiredText: {
        fontFamily: 'gotham-bold',
        color: '#E15220',
        fontSize: '0.85rem',
    },

})
