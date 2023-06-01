import React, { useState } from 'react';
import { ActivityIndicator, Alert, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Text, View, Pressable } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import AppButton from '../../../shared/AppButton';
import Input from '../../../shared/Input';
import UserWalletBalance from '../../../shared/UserWalletBalance';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../../utils/normalize';
import useApplyHeaderWorkaround from '../../../utils/useApplyHeaderWorkaround';
import Constants from 'expo-constants';
import { isTrue } from '../../../utils/stringUtl';
import { unwrapResult } from '@reduxjs/toolkit';
import { startChallengeRequest } from './TriviaChallengeGameSlice';
import logToAnalytics from '../../../utils/analytics';



const ChallengeStakingScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const boosts = useSelector(state => state.common.boosts);
    const minimumChallengeStakeAmount = useSelector(state => state.common.minimumChallengeStakeAmount);
    const maximumChallengeStakeAmount = useSelector(state => state.common.maximumChallengeStakeAmount);
    const gameCategoryId = useSelector(state => state.game.gameCategory.id);
    const [amount, setAmount] = useState('200');
    const [loading, setLoading] = useState(false);

    const goToStore = () => {
        logToAnalytics("trivia_challenge_get_boost_clicked")
        navigation.navigate('GameStore');
    }


    const stakeAmount = async () => {
        setLoading(true);

        if (Number.parseFloat(amount) < Number.parseFloat(minimumChallengeStakeAmount)) {
            Alert.alert(`Minimum stake amount is ${minimumChallengeStakeAmount} naira`);
            setLoading(false);
            return false;
        }

        if (Number.parseFloat(amount) > Number.parseFloat(maximumChallengeStakeAmount)) {
            Alert.alert(`Maximum stake amount is ${maximumChallengeStakeAmount} naira`);
            setLoading(false);
            return false;
        }

        // if (Number.parseFloat(user.walletBalance) < Number.parseFloat(amount)) {
        //     Alert.alert(`Your demo wallet has been exhausted. Fund your wallet now`);
        //     setLoading(false);
        //     return false;
        // }

        if (Number.parseFloat(user.walletBalance) < Number.parseFloat(amount)) {
            Alert.alert(`Insufficient balance in your wallet. Please fund your wallet`);
            setLoading(false);
            return false;
        }


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
                Alert.alert("Something went wrong. Please try again or contact support")
                setLoading(false)
            });
    }

    return (
        <>
            <ImageBackground source={require('../../../../assets/images/quiz-stage.jpg')}
                style={{ flex: 1 }}
                resizeMethod="resize">
                <KeyboardAvoidingView
                    behavior={Platform.OS === "ios" ? "padding" : "height"}
                    style={styles.headContainer}
                >

                    <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'center', flex: 1 }}>
                        <View style={styles.purchaseBoost}>
                            <Text style={styles.boostText}>Score higher with boosts</Text>
                            <View style={styles.boostContainer}>
                                {boosts.map((boost, i) => <BoostCardDetails key={i} boost={boost} />)}
                            </View>
                            {Platform.OS === "android" &&
                                <Pressable onPress={goToStore} style={styles.storeLink}>
                                    <Text style={styles.matchingText} onPress={goToStore}>Get boosts</Text>
                                </Pressable>
                            }
                        </View>
                        <SelectedPlayers user={user} />
                        <InputStakeAmount balance={user.walletBalance}
                            stakeAmount={stakeAmount}
                            loading={loading}
                            amount={amount}
                            setAmount={setAmount}
                        />

                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </>
    )
}

const SelectedPlayers = ({ user }) => {
    return (
        <>
            <ImageBackground source={require('../../../../assets/images/challenge-stage.png')}
                style={styles.playerImage} imageStyle={{ borderRadius: 20 }} resizeMode="cover">
                <SelectedPlayer playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")} />

                <Image
                    source={require('../../../../assets/images/versus.png')}
                />
                <SelectedPlayer playerName="...." playerAvatar={require("../../../../assets/images/question.png")} />
            </ImageBackground></>
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

const InputStakeAmount = ({ balance, stakeAmount, loading, amount, setAmount }) => {
    return (
        <View
            style={styles.stakeAmountContainer}
        >
            <UserWalletBalance balance={balance} style={styles.walletContainer} textstyle={styles.walletText} />
            <View style={styles.fundContainer}
            >
                <Input
                    style={styles.fundAmount}
                    value={amount}
                    defaultValue="Enter Amount"
                    keyboardType="numeric"
                    onChangeText={setAmount}
                    autoFocus={true}
                    placeholder="Enter Stake Amount"
                    min
                />
            </View>
            <AppButton text={loading ? <ActivityIndicator size="small" color="#FFFF" /> : "Stake Amount"} onPress={stakeAmount} disabled={loading}
                style={styles.stakeButton} disabledStyle={styles.disabled} />

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
            <View style={styles.boostDetailsContainer}>
                <View style={styles.boostNameCount}>
                    <Text style={styles.storeItemName}>{boost.name}</Text>
                </View>
            </View>
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
        // justifyContent: 'center',
        // backgroundColor: '#EDDA74',
        // flex: 1,
    },
    playerImage: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: '1rem',
    },
    avatarBackground: {
        alignItems: 'center'
    },
    avatar: {
        width: normalize(45),
        height: normalize(45),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    username: {
        fontSize: '0.75rem',
        fontFamily: 'graphik-regular',
        color: '#FFFF',
        width: responsiveScreenWidth(25),
        textAlign: 'center',
        marginTop: '.8rem'
    },
    stakeAmountContainer: {
        backgroundColor: '#EDDA74',
        // paddingHorizontal: normalize(18),
        paddingTop: normalize(20),
        borderRadius: 15,
    },
    walletContainer: {
        backgroundColor: '#301934',
        color: "#FFFF",
        marginHorizontal: normalize(18),
    },
    walletText: {
        color: "#FFFF",
    },
    fundContainer: {
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
    },
    fundAmount: {
        fontFamily: "graphik-medium",
        fontSize: "1.5rem",
        color: "#333333",
        marginVertical: normalize(2),
        opacity: 0.65,
        textAlign: "center",
    },
    stakeButton: {
        marginHorizontal: normalize(18),
        marginTop: 20,
    },
    boostDetailsHead: {
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '1rem',
        marginHorizontal: '1rem'
    },
    boostDetailsContainer: {
        flexDirection: 'column',
    },
    boostNameCount: {
        alignItems: 'center',
    },
    storeItemName: {
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem',
        color: '#EF2F55',
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
        fontSize: '.8rem',
        fontFamily: 'graphik-medium',
        color: '#FFFF',
        textAlign: 'center',
        lineHeight: '1.2rem',
    },
    boostIcon: {
        marginBottom: normalize(5),
        width: responsiveScreenWidth(7),
        height: responsiveScreenWidth(7),
    },
    boostContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'center'
    },
    storeItemName: {
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem',
        color: '#FFFF',
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
        fontFamily: 'graphik-regular',
        color: '#FFF',
        textAlign: 'center',
        lineHeight: '2rem',
        textDecorationStyle: 'dashed',
        textDecorationColor: '#fff',
        textDecorationLine: 'underline',
    },
    purchaseBoost: {
        backgroundColor: '#301934',
        marginVertical: normalize(15),
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(18),
        borderRadius: 15,
        alignItems: 'center'
    },
    storeLink: {
        marginTop: '.6rem'
    },
    disabled: {
        backgroundColor: '#EA8663'
    },

})
