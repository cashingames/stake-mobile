import React, { useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, ImageBackground, KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import AppButton from '../../../shared/AppButton';
import Input from '../../../shared/Input';
import UserWalletBalance from '../../../shared/UserWalletBalance';
import normalize, { responsiveScreenWidth } from '../../../utils/normalize';
import useApplyHeaderWorkaround from '../../../utils/useApplyHeaderWorkaround';
import Constants from 'expo-constants';
import { isTrue } from '../../../utils/stringUtl';
import { unwrapResult } from '@reduxjs/toolkit';
import { startChallengeRequest } from './TriviaChallengeGameSlice';


const ChallengeStakingScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const minimumChallengeStakeAmount = useSelector(state => state.common.minimumChallengeStakeAmount);
    const gameCategoryId = useSelector(state => state.game.gameCategory.id);
    const [amount, setAmount] = useState('200');
    const [loading, setLoading] = useState(false);


    const stakeAmount = async () => {
        setLoading(true);

        if (Number.parseFloat(amount) < Number.parseFloat(minimumChallengeStakeAmount)) {
            Alert.alert(`Minimum stake amount is ${minimumChallengeStakeAmount} naira`);
            setLoading(false);
            return false;
        }
        dispatch(startChallengeRequest({
            category: gameCategoryId,
            amount: amount
        })).then(unwrapResult)
        .then(result => {
            setLoading(false)
            navigation.navigate('ChallengeMatching')
        })
        .catch((rejectedValueOrSerializedError) => {
            console.log('failed')
            // navigation.navigate('ChallengerMatching')
            setLoading(false)
        });
    }
    
    return (
        <ImageBackground source={require('../../../../assets/images/quiz-stage.jpg')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.headContainer}
            >
                <ScrollView style={styles.container}>

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
    walletText: {
        color: "#FFFF",
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