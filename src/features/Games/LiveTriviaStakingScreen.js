import React, { useEffect, useState, useRef } from "react";
import { Text, View, ScrollView, Alert, Pressable, Image } from 'react-native';
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { useNavigation, } from '@react-navigation/native';
import { formatCurrency, formatNumber } from "../../utils/stringUtl";
import Input from "../../shared/Input";
import AppButton from "../../shared/AppButton";
import { canStake, getGameStakes, setGameDuration, setIsPlayingTrivia, setQuestionsCount, startGame } from "./GameSlice";
import { Ionicons } from '@expo/vector-icons';
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";
import FundWalletComponent from "../../shared/FundWalletComponent";
import { getUser } from "../Auth/AuthSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import GoToStore from "../../shared/GoToStore";
import analytics from '@react-native-firebase/analytics';
import Constants from 'expo-constants';



const LiveTriviaStakingScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector((state) => state.auth.user);
    const gameStakes = useSelector(state => state.game.gameStakes);
    const params = route.params;

    const [amount, setAmount] = useState(100);
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

        if (Number.parseFloat(user.walletBalance) < Number.parseFloat(amount)) {
            await analytics().logEvent('live_trivia_staking_low_balance', {
                'id': user.username,
                'phone_number': user.phoneNumber,
                'email': user.email
            });
            openBottomSheet();
            return
        }

        canStake({ staking_amount: amount })
            .then(async response => {
                await analytics().logEvent('live_trivia_staking_initiated_successfully', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                });
                openBottomSheet();
            },
                err => {
                    if (!err || !err.response || err.response === undefined) {
                        Alert.alert("Your Network is Offline.");
                    }
                    else if (err.response.status === 400) {
                        Alert.alert(err.response.data.message);

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
                    defaultValue="100"
                    keyboardType="numeric"
                    onChangeText={setAmount}
                    autoFocus={true}
                    placeholder="Enter Stake Amount"
                    min
                />
            </View>
            <View style={styles.buttonContainer}>
                <AppButton text="Stake Amount" onPress={startGame} />
            </View>
            <View style={styles.stakeContainer}>
                <Text style={styles.stakeHeading}>Predictions Table</Text>
                <View style={styles.stakeHeaders}>
                    <Text style={styles.stakeHead}>WINNINGS</Text>
                    <Text style={styles.stakeScore}>SCORE</Text>
                    <Text style={styles.stakeHead}>ODDS</Text>
                </View>
                {gameStakes.map((gameStake, i) => <StakeAmount key={i} gameStake={gameStake} position={i + 1}
                    amount={amount} />)}
            </View>

            {Number.parseFloat(user.walletBalance) < Number.parseFloat(amount) ?
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={620}
                    subComponent={<NotEnoughBalance onClose={closeBottomSheet} />}
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
            .catch((rejectedValueOrSerializedError) => {
                // console.log(rejectedValueOrSerializedError);
                Alert.alert(rejectedValueOrSerializedError.message)
                setLoading(false);
            });
    }



    const visitStore = () => {
        onClose();
        navigation.navigate('GameStore')
    }

    return (
        <View style={styles.availableBoosts}>
            <Text style={styles.title}>Available Boosts</Text>
            <View style={styles.boosts}>
                {boosts.map((boost, i) => <AvailableBoost boost={boost} key={i} />
                )}
            </View>
            <GoToStore onPress={visitStore} />
            <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={onStartGame} disabled={loading} />
        </View>
    )
}

const AvailableBoost = ({ boost }) => {
    return (
        <View style={styles.boostContent}>
            <View style={styles.boostAmount}>
                <Image
                    source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
                <Text style={styles.amount}>x{formatNumber(boost.count)}</Text>
            </View>
            <View style={styles.boostDetails}>
                <Text style={styles.boostName}>{boost.name}</Text>
                <Text style={styles.boostDescription}>{boost.description}</Text>
            </View>
        </View>
    )
}


const UserWalletBalance = ({ balance }) => {
    return (
        <Text style={styles.availableAmount}>
            Wallet Balance: &#8358;{formatCurrency(balance)}
        </Text>
    );
}

const StakeAmount = ({ gameStake, position, amount }) => {
    return (
        <View style={styles.stakeSub}>
            {/* <View style={styles.stakeNumber}> */}
            {/* <Text style={styles.stakeIndex}>{position}</Text> */}
            <Text style={styles.stakeWinnings}>&#8358;{formatCurrency(amount * gameStake.odd)}</Text>
            {/* </View> */}
            <View style={styles.stakeScoreContainer}>
                <Ionicons name="checkmark-circle-outline" size={16} color="#333333" />
                <Text style={styles.stakeScoreDigit}>{gameStake.score}/10</Text>
            </View>
            <View style={styles.stakeNumber}>
                <Ionicons name="time-outline" size={16} color="#FF932F" />
                <Text style={styles.stakeOddDigit}>x{gameStake.odd}</Text>
            </View>
        </View>
    )
}

const NotEnoughBalance = ({ onClose }) => {
    return (
        <View style={styles.noGames}>
            <Image style={styles.sadEmoji}
                source={require('../../../assets/images/sad-face-emoji.png')}

            />
            <Text style={styles.noGamesText}>Sorry,</Text>
            <Text style={styles.noGamesText}>You do not have enough balance to stake this amount</Text>
            <FundWalletComponent onClose={onClose} />
        </View>
    )
}
const StakingAmountOutOfRange = ({ onClose }) => {
    return (
        <View style={styles.noGames}>
            <Image style={styles.sadEmoji}
                source={require('../../../assets/images/sad-face-emoji.png')}

            />
            <Text style={styles.noGamesText}>Sorry,</Text>
            <Text style={styles.noGamesText}>You can only stake between &#8358;{formatCurrency(100)} and {formatCurrency(1000)}</Text>
        </View>
    )
}
export default LiveTriviaStakingScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        // paddingHorizontal: normalize(18),
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
    availableAmount: {
        fontFamily: "graphik-medium",
        fontSize: "0.7rem",
        color: "#01A7DB",
        textAlign: "center",
        backgroundColor: "#F3F3F3",
        paddingVertical: normalize(12),
        paddingHorizontal: responsiveScreenWidth(8),
        borderRadius: 64,
    },
    fundAmount: {
        fontFamily: "graphik-medium",
        fontSize: "1.7rem",
        color: "#333333",
        marginVertical: normalize(10),
        opacity: 0.65,
        textAlign: "center",
        // width: responsiveScreenWidth(100),
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
    stakeNumber: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '3rem'
    },
    stakeScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '3rem'
    },
    stakeHeading: {
        textAlign: 'center',
        fontFamily: "graphik-medium",
        fontSize: "1rem",
        color: "#EF2F55",
        marginVertical: '1rem',
        // opacity:0.7
    },
    stakeHeaders: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: normalize(10),
    },
    stakeSub: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        paddingVertical: normalize(20),

    },
    stakeIndex: {
        marginRight: '1rem'
    },
    stakeScore: {
        fontFamily: "graphik-medium",
        fontSize: ".8rem",
        color: "#333333",
    },
    stakeHead: {
        fontFamily: "graphik-medium",
        fontSize: ".8rem",
        color: "#333333",
        // marginRight: '.7rem',
        // width: '5rem',
    },
    stakeOddDigit: {
        fontFamily: "graphik-medium",
        fontSize: ".7rem",
        color: "#FF932F",
        marginLeft: '.3rem',
    },
    stakeScoreDigit: {
        fontFamily: "graphik-medium",
        fontSize: ".7rem",
        color: "#333333",
        marginLeft: '.3rem',
        opacity: 0.7
    },
    stakeWinnings: {
        fontFamily: "graphik-medium",
        fontSize: ".7rem",
        color: "#333333",
        width: '5rem',
    },
    noGames: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
    },
    sadEmoji: {
        width: normalize(50),
        height: normalize(50),
        marginBottom: normalize(20)
    },
    needGames: {
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#000',
        marginTop: normalize(15)
    },
    noGamesText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        // width: normalize(130),
        textAlign: 'center',
        color: '#000',
        lineHeight: normalize(24)
    },
    storeLinks: {
        alignItems: 'center',
    },
    amount: {
        fontFamily: 'graphik-bold',
        fontSize: '0.8rem',
        color: '#FF932F'
    },
    title: {
        fontSize: '0.85rem',
        fontFamily: 'graphik-medium',
        color: '#000',
        lineHeight: 23,
        marginBottom: normalize(15)
    },
    boosts: {
        // alignItems: ''
    },
    noBoosts: {
        textAlign: 'center',
        fontSize: '0.85rem',
        fontFamily: 'graphik-regular',
        marginVertical: '1rem'
    },
    boostContent: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        marginBottom: normalize(17)
    },
    boostAmount: {
        display: 'flex',
        flexDirection: 'row',
    },
    availableBoosts: {
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(20),
    },
    boostDetails: {
        display: 'flex',
        alignItems: 'flex-start',
        marginBottom: normalize(15),
        justifyContent: 'center'
    },
    boostName: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-bold',
        color: '#151C2F',
        lineHeight: '1.2rem',
    },
    boostDescription: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
        color: '#828282',
        lineHeight: '1.2rem',
        width: responsiveScreenWidth(60),
    },
    storeLink: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    needBoost: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
        color: '#000',
    },
    moreBoost: {
        alignItems: 'center',
    },
    startContainer: {
        marginTop: normalize(50),
    },
    proceedButton: {
        marginVertical: 10,
    },
    boostIcon: {
        width: normalize(35),
        height: normalize(35)
    },

})