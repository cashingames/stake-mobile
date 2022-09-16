import React, { useEffect, useState, useRef } from "react";
import { Text, View, ScrollView, Alert, Pressable, Image } from 'react-native';
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { formatCurrency } from "../../utils/stringUtl";
import Input from "../../shared/Input";
import AppButton from "../../shared/AppButton";
import { canStake, getGameStakes, setIsPlayingTrivia, startGame } from "./GameSlice";
import { Ionicons } from '@expo/vector-icons';
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";
import FundWalletComponent from "../../shared/FundWalletComponent";
import { getUser } from "../Auth/AuthSlice";
import { logActionToServer } from "../CommonSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import UserAvailableBoost from "../../shared/UserAvailableBoost";
import GoToStore from "../../shared/GoToStore";
import analytics from '@react-native-firebase/analytics';


const GameStakingScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector((state) => state.auth.user);
    const gameStakes = useSelector(state => state.game.gameStakes);
    // console.log(gameStakes)
    const [amount, setAmount] = useState(500);
    const dispatch = useDispatch();
    const refRBSheet = useRef();

    const openBottomSheet = () => {
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
        // dispatch(canStake({staking_amount: amount}))
        //     .then(result => {
                if (Number.parseFloat(user.walletBalance) < Number.parseFloat(amount)) {
                    await analytics().logEvent('staking_low_balance', {
                        'action': 'initiate'
                    });
                    openBottomSheet();
                }
                openBottomSheet()
            // })
        // var inputedAmount =
        //     amount.trim().length === 0 ? 0 : Number.parseFloat(amount);
        // // console.log(Number.parseFloat(amount));
        // if (inputedAmount < 100) {
        //     Alert.alert("Amount cannot be less than 100 naira");
        //     return false;
        // }
        // if (inputedAmount > 1000) {
        //     Alert.alert("Amount cannot be greater than 1000 naira");
        //     return false;
        // }
        // if (Number.parseFloat(user.walletBalance) < Number.parseFloat(amount)) {
        //     openBottomSheet();
        // }
        // openBottomSheet()
    }


    return (
        <ScrollView style={styles.container}>
            <View style={styles.amountContainer}>
                <UserWalletBalance balance={user.walletBalance} />
                <Input
                    style={styles.fundAmount}
                    value={amount}
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
                    {/* <View style={styles.stakeNumber}> */}
                    {/* <Text style={styles.stakeIndex}></Text> */}
                    <Text style={styles.stakeHead}>WINNINGS</Text>
                    {/* </View> */}
                    {/* <View style={styles.stakeScoreContainer}> */}
                    <Text style={styles.stakeScore}>SCORE</Text>
                    {/* </View> */}
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
                    subComponent={<AvailableBoosts onClose={closeBottomSheet} amount={amount} />}
                />
            }

        </ScrollView>
    )

}

const AvailableBoosts = ({ onClose, amount }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const boosts = useSelector(state => state.auth.user.boosts);
    const gameCategoryId = useSelector(state => state.game.gameCategory.id);
    const gameTypeId = useSelector(state => state.game.gameType.id);
    const gameModeId = useSelector(state => state.game.gameMode.id);
    const gameMode = useSelector(state => state.game.gameMode);
    // const challengeType = useSelector(state => state.game.challengeDetails.gameModeId);
    // const challengeCategory = useSelector(state => state.game.challengeDetails.categoryId);
    // const challengeId = useSelector(state => state.game.challengeDetails.challenegeId);
    const user = useSelector(state => state.auth.user);
    const [loading, setLoading] = useState(false);

    const onStartGame = () => {
        setLoading(true);
        dispatch(setIsPlayingTrivia(false))
        dispatch(startGame({
            category: gameCategoryId,
            type: gameTypeId,
            mode: gameModeId,
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
                Alert.alert(rejectedValueOrSerializedError.message)
                setLoading(false);
            });
    }

    // const startChallenge = () => {
    //   setLoading(true);
    //   dispatch(startChallengeGame({
    //     category: challengeCategory,
    //     type: gameTypeId,
    //     challenge_id: challengeId
    //   }))
    //     .then(unwrapResult)
    //     .then(result => {
    //       // console.log(result);
    //       dispatch(logActionToServer({
    //         message: "Challenge Game session " + result.data.game.token + " questions recieved for " + user.username,
    //         data: result.data.questions
    //       }))
    //         .then(unwrapResult)
    //         .then(result => {
    //           // console.log('Action logged to server');
    //         })
    //         .catch(() => {
    //           // console.log('failed to log to server');
    //         });
    //       setLoading(false);
    //       onClose();
    //       navigation.navigate("ChallengeGameInProgress")
    //     })
    //     .catch((rejectedValueOrSerializedError) => {
    //       // console.log(rejectedValueOrSerializedError);
    //       Alert.alert('Failed to start game')
    //       // Alert.alert(rejectedValueOrSerializedError.message)
    //       setLoading(false);
    //     });
    // }


    const visitStore = () => {
        onClose();
        navigation.navigate('GameStore')
    }

    const boostsToDisplay = () => {
        if (gameMode.name === "CHALLENGE") {
            return boosts.filter(x => x.name.toUpperCase() !== "SKIP");
        }
        return boosts;
    }

    return (
        <View style={styles.availableBoosts}>
            <Text style={styles.title}>Available Boosts</Text>
            {boosts?.length > 0 ?
                <View style={styles.boosts}>
                    {boostsToDisplay().map((boost, i) => <UserAvailableBoost boost={boost} key={i} />
                    )}
                </View>
                :
                <Text style={styles.noBoosts}>No boost available, go to store to purchase boost</Text>
            }
            <View style={styles.storeLinks}>
                <GoToStore onPress={visitStore} />
            </View>
            {gameMode.name === "EXHIBITION" && <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={onStartGame} disabled={loading} />}
            {/* {gameMode.name === "CHALLENGE" && <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={startChallenge} disabled={loading} />} */}

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
                <Text style={styles.stakeScoreDigit}>{gameStake.score}</Text>
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
export default GameStakingScreen;

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

})