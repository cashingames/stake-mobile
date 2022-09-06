import React, { useEffect, useState, useRef } from "react";
import { Text, View, ScrollView, Alert, Pressable, Image } from 'react-native';
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { formatCurrency } from "../../utils/stringUtl";
import Input from "../../shared/Input";
import AppButton from "../../shared/AppButton";
import { getGameStakes } from "./GameSlice";
import { Ionicons } from '@expo/vector-icons';
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";
import NoGame from "../../shared/NoGame";


const GameStakingScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector((state) => state.auth.user);
    const gameStakes = useSelector(state => state.game.gameStakes);
    console.log(gameStakes)
    const [amount, setAmount] = useState("");
    const dispatch = useDispatch();
    const refRBSheet = useRef();

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }

    useEffect(() => {
        dispatch(getGameStakes())
    }, [])

    const startGame = () => {
        if (user.walletBalance < amount) {
            openBottomSheet();
            console.log("low balance")
        }
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
            <UniversalBottomSheet
                refBottomSheet={refRBSheet}
                height={300}
                subComponent={<NotEnoughBalance onClose={closeBottomSheet} />}
            />
        </ScrollView>
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

const NotEnoughBalance = ()=>{
    return (
        <View style={styles.noGames}>
            <Image style={styles.sadEmoji}
                source={require('../../../assets/images/sad-face-emoji.png')}

            />
            <Text style={styles.noGamesText}>Sorry,</Text>
            <Text style={styles.noGamesText}>You do not have enough balance to stake this amount</Text>
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
        fontFamily: "graphik-bold",
        fontSize: "1.7rem",
        color: "#333333",
        marginVertical: normalize(10),
        opacity: 0.65
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
})