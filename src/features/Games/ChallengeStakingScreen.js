import React, { useRef, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import AppButton from '../../shared/AppButton';
import Input from '../../shared/Input';
import UserWalletBalance from '../../shared/UserWalletBalance';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import analytics from '@react-native-firebase/analytics';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import LowWalletBalance from '../../shared/LowWalletBalance';
import Constants from 'expo-constants';
import ChallengeInviteSuccessText from '../../shared/ChallengeInviteSuccessText';
import { getUser } from '../Auth/AuthSlice';
import { isTrue } from '../../utils/stringUtl';
import { sendFriendInvite } from './GameSlice';
import { unwrapResult } from '@reduxjs/toolkit';


const ChallengeStakingScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const params = route.params;
    console.log(params)
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const maximumStakeAmount = useSelector(state => state.common.maximumStakeAmount);
    const minimumStakeAmount = useSelector(state => state.common.minimumStakeAmount);
    const activeCategory = useSelector(state => state.game.gameCategory);
    const [amount, setAmount] = useState(200);
    const [loading, setLoading] = useState(false);
    const [staking, setStaking] = useState(false);
    const refRBSheet = useRef();

    const openBottomSheet = async () => {
        setStaking(true)
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        dispatch(getUser());
        refRBSheet.current.close()
    }

    const stakeAmount = async () => {
        setLoading(true);
        if (Number.parseFloat(user.walletBalance) < Number.parseFloat(amount)) {
            await analytics().logEvent('challenge_staking_low_balance', {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            });
            openBottomSheet();
            setLoading(false);
            return
        }

        if (Number.parseFloat(amount) < Number.parseFloat(minimumStakeAmount)) {
            Alert.alert(`Minimum stake amount is ${minimumStakeAmount} naira`);
            setLoading(false);
            return false;
        }

        if (Number.parseFloat(amount) > Number.parseFloat(maximumStakeAmount)) {
            Alert.alert(`Maximum stake amount is ${maximumStakeAmount} naira`);
            setLoading(false);
            return false;
        }
        dispatch(sendFriendInvite({
            opponentId: params.selectedOpponents.map(opponent => opponent.id),
            categoryId: activeCategory.id,
            staking_amount: amount
        }
        ))
            .then(unwrapResult)
            .then(async result => {
                openBottomSheet()
                await analytics().logEvent("challenge_invite_sent_with_staking", {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                })
            })
            .catch((rejectedValueOrSerializedError) => {
                setLoading(false);
                Alert.alert(rejectedValueOrSerializedError.message)
            });
    }


    return (
        <ImageBackground source={require('../../../assets/images/quiz-stage.jpg')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.headContainer}
            >
                <ScrollView style={styles.container}>

                    <SelectedPlayers challengeDetails={params.selectedOpponents[0]} user={user} />
                    <InputStakeAmount balance={user.walletBalance}
                        stakeAmount={stakeAmount}
                        loading={loading}
                        amount={amount}
                        setAmount={setAmount}
                    />
                </ScrollView>
            </KeyboardAvoidingView>

            {Number.parseFloat(user.walletBalance) < Number.parseFloat(amount) ?
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={620}
                    subComponent={<LowWalletBalance onClose={closeBottomSheet} />}
                />
                :
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={450}
                    subComponent={<ChallengeInviteSuccessText
                        onClose={closeBottomSheet}
                        staking={staking}
                        amount={amount}
                    />}
                />
            }
        </ImageBackground>
    )
}

const SelectedPlayers = ({ challengeDetails, user }) => {
    return (
        <>
            <ImageBackground source={require('../../../assets/images/challenge-stage.png')}
                style={styles.playerImage} imageStyle={{ borderRadius: 20 }} resizeMode="cover">
                <SelectedPlayer playerName={user.username} playerAvatar={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")} />

                <Image
                    source={require('../../../assets/images/versus.png')}
                />
                <SelectedPlayer playerName={challengeDetails.username} playerAvatar={isTrue(challengeDetails.avatar) ? { uri: challengeDetails.avatar } : require("../../../assets/images/user-icon.png")} />
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
            <UserWalletBalance balance={balance} style={styles.walletContainer} />
            <View style={styles.fundContainer}
            >
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
            <AppButton text={loading ? <ActivityIndicator size="small" color="#FFFF" /> : "Stake Amount"} onPress={stakeAmount} disabled={loading} style={styles.stakeButton} />

        </View>
    )
}

export default ChallengeStakingScreen;

const styles = EStyleSheet.create({
    headContainer: {
        flex: 1
    },
    container: {
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(40)
    },
    playerImage: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: normalize(40),
        paddingHorizontal: normalize(20),
        alignItems: 'center',
        borderRadius: 20,
        marginBottom: '2rem',
    },
    avatarBackground: {
        alignItems: 'center'
    },
    avatar: {
        width: normalize(65),
        height: normalize(65),
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
    fundContainer: {
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
    },
    fundAmount: {
        fontFamily: "graphik-medium",
        fontSize: "1.7rem",
        color: "#333333",
        marginVertical: normalize(10),
        opacity: 0.65,
        textAlign: "center",
    },
    stakeButton: {
        marginHorizontal: normalize(18),
        marginTop: 25,
    }
})