import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Text, View, Pressable } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import AppButton from '../../../shared/AppButton';
import Input from '../../../shared/Input';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../../utils/normalize';
import Constants from 'expo-constants';
import { formatCurrency, formatNumber, isTrue } from '../../../utils/stringUtl';
import { unwrapResult } from '@reduxjs/toolkit';
import { startChallengeRequest } from './TriviaChallengeGameSlice';
import logToAnalytics from '../../../utils/analytics';
import { Ionicons } from '@expo/vector-icons';
import CustomAlert from '../../../shared/CustomAlert';



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


    const goToStore = () => {
        logToAnalytics("trivia_challenge_get_boost_clicked")
        navigation.navigate('GameStore');
    }


    const stakeAmount = async () => {
        setLoading(true);
        dispatch(startChallengeRequest({
            category: gameCategoryId,
            amount: amount
        })).then(unwrapResult)
            .then(async result => {
                setLoading(false)
                logToAnalytics("trivia_challenge_stake_now_clicked", {
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

    const depositFunds = async () => {
        logToAnalytics("challenge_deposit_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('FundWallet')
    }

    const fundWallet = async () => {
        logToAnalytics("insufficient_challenge_balance_fund_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('FundWallet')
    }

    useEffect(() => {

        const invalid = amount === '' || amount < Number.parseFloat(minimumChallengeStakeAmount) || amount > Number.parseFloat(maximumChallengeStakeAmount)
            || amount > Number.parseFloat(user.walletBalance)
        setCanSend(!invalid);

    }, [amount])

    return (
        <>
            <ImageBackground source={require('../../../../assets/images/game-play-background.png')}
                style={{ flex: 1 }}
                resizeMethod="resize">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.headContainer}
                >

                    <ScrollView style={styles.container}>

                        <View style={styles.purchaseBoost}>
                            <Text style={styles.boostText}>{user.username}, score higher with boosts</Text>
                            <View>
                                {boosts?.length > 0 ?
                                    <View style={styles.boostContainer}>
                                        {boosts.map((boost, i) => <BoostCardDetails key={i} boost={boost} />)}
                                    </View>
                                    :
                                    <Text style={styles.noBoostText}>You dont have any available boost</Text>
                                }
                            </View>
                            {Platform.OS === "android" &&
                                <Pressable onPress={goToStore} style={styles.storeLink}>
                                    <Text style={styles.matchingText} onPress={goToStore}>Get boosts</Text>
                                </Pressable>
                            }
                        </View>
                        <SelectedPlayers user={user} />
                        <WalletDetails user={user} depositFunds={depositFunds} />
                        <Input
                            label='Enter stake amount'
                            placeholder={`Minimum amount is NGN ${minimumChallengeStakeAmount}`}
                            value={amount}
                            error={((amount < Number.parseFloat(minimumChallengeStakeAmount)) && `Minimum amount is NGN ${minimumChallengeStakeAmount}`) ||
                                ((amount > Number.parseFloat(maximumChallengeStakeAmount)) && `Maximum amount is NGN ${maximumChallengeStakeAmount}`) ||
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

                        <AppButton text={loading ? <ActivityIndicator size="small" color="#FFFF" /> : "Stake amount"} onPress={stakeAmount} disabled={loading || !canSend}
                            style={styles.stakeButton} disabledStyle={styles.disabled} isIcon={true} iconColor="#FFF" />
                        <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                             textLabel={alertMessage} buttonLabel='Ok, got it'
                            alertImage={require('../../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} />

                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </>
    )
}

const SelectedPlayers = ({ user }) => {
    return (
        <View style={styles.playerImage}>
            <SelectedPlayer playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />

            <Image
                source={require('../../../../assets/images/versus.png')}
            />
            <SelectedPlayer playerName="...." playerAvatar={require("../../../../assets/images/question.png")} />
        </View>
    )
}

const SelectedPlayer = ({ playerName, playerAvatar }) => {
    return (
        <View style={styles.avatarBackground}>
            <Image
                source={playerAvatar}
                style={styles.avatar}
            />
            <Text style={styles.username}>@{playerName}</Text>
        </View>
    )
}

const WalletDetails = ({ user, depositFunds }) => {
    const [hidden, setHidden] = useState(false);

    const toggleSecureText = () => {
        setHidden(!hidden);
    }
    return (
        <View style={styles.detailsContainer}>
            <View style={styles.totalHeader}>
                <View style={styles.totalTitleContainer}>
                    <Image
                        source={require('../../../../assets/images/wallet-with-cash.png')}
                        style={styles.cashAvatar}
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
        paddingVertical: normalize(15),
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
        alignItems: 'center'
    },
    avatar: {
        width: normalize(65),
        height: normalize(65),
        backgroundColor: '#F6F4FF',
        borderRadius: 50,
    },
    username: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-bold',
        color: '#072169',
        width: responsiveScreenWidth(25),
        textAlign: 'center',
        marginTop: '.8rem'
    },
    stakeButton: {
        marginTop: 20,
    },
    boostDetailsHead: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginHorizontal: '.5rem'
    },
    boostDetailsContainer: {
        flexDirection: 'column',
    },
    boostNameCount: {
        alignItems: 'center',
    },
    storeItemName: {
        fontFamily: 'graphik-bold',
        fontSize: '0.8rem',
        color: '#FFF',
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
        fontSize: '.85rem',
        fontFamily: 'gotham-bold',
        color: '#072169',
        textAlign: 'center',
    },
    boostIcon: {
        width: '2rem',
        height: '2rem',
    },
    noBoost: {
        fontSize: '.75rem',
        fontFamily: 'gotham-medium',
        color: '#072169',
        textAlign: 'center',
        marginTop: '.5rem'
    },
    noBoostText: {
        fontSize: '.75rem',
        fontFamily: 'gotham-medium',
        color: '#072169',
        textAlign: 'center',
        marginTop: '.5rem'
    },
    boostContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
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
    matchingText: {
        fontSize: '.8rem',
        fontFamily: 'gotham-medium',
        color: '#E15220',
        textAlign: 'center',
        textDecorationColor: '#E15220',
        textDecorationLine: 'underline',
    },
    purchaseBoost: {
        backgroundColor: '#AAD880',
        marginVertical: normalize(15),
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(18),
        borderRadius: 13,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E5E5E5',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.1,
    },
    storeLink: {
        marginTop: '.6rem'
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
    cashAvatar: {
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

})
