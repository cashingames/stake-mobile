import React, { useEffect, useState } from "react";
import { Text, View, ScrollView } from 'react-native';
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { formatCurrency } from "../../utils/stringUtl";
import Input from "../../shared/Input";
import AppButton from "../../shared/AppButton";
import { getGameStakes } from "./GameSlice";
import { Ionicons } from '@expo/vector-icons';
import { getUser } from "../Auth/AuthSlice";
import UserWalletBalance from "../../shared/UserWalletBalance";
import StakingPredictionsTable from "../../shared/StakingPredictionsTable";


const ReviewStakeScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector((state) => state.auth.user);
    const gameStakes = useSelector(state => state.game.gameStakes);
    const amountStaked = useSelector(state => state.game.amountStaked);
    const correctCount = useSelector(state => state.game.correctCount);
    // const [amount, setAmount] = useState(amountStaked);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getGameStakes())
        dispatch(getUser())
    }, [])



    return (
        <ScrollView style={styles.container}>
            <View style={styles.amountContainer}>
                <UserWalletBalance balance={user.walletBalance} />
                <Input
                    style={styles.fundAmount}
                    value={amountStaked}
                    defaultValue={amountStaked}
                    keyboardType="numeric"
                    onChangeText={amountStaked}
                    autoFocus={false}
                    editable={false}
                    placeholder="Enter Stake Amount"
                    min
                />
            </View>
            <View style={styles.buttonContainer}>
                <AppButton text="Stake Amount" disabled />
            </View>
            <View style={styles.stakeContainer}>
                <Text style={styles.stakeHeading}>HOW TO WIN</Text>
                <View style={styles.stakeHeaders}>
                    <Text style={styles.stakeScore}>OUTCOME</Text>
                    <Text style={styles.stakeHead}>ODDS</Text>
                    <Text style={styles.stakePay}>PAYOUT</Text>
                </View>
                {gameStakes.map((gameStake, i) => <StakingPredictionsTable key={i} gameStake={gameStake} position={i + 1}
                    amount={amountStaked}
                    containerStyle={correctCount == (gameStake.score) ? styles.amountWon : {}}
                />)}
            </View>

        </ScrollView>
    )

}


export default ReviewStakeScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
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
        color: "#fab700",
        marginVertical: '1rem',
    },
 
    stakeScore: {
        fontFamily: "graphik-medium",
        fontSize: "1rem",
        color: "#006ac6",
        // marginLeft: '.3rem',
    },
    stakeHead: {
        fontFamily: "graphik-medium",
        fontSize: "1rem",
        color: "#006ac6",
        marginRight: '1rem',
    },
    stakePay: {
        fontFamily: "graphik-medium",
        fontSize: "1rem",
        color: "#006ac6",
        marginRight: '1rem',
    },
    stakeHeaders: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: normalize(10),
    },

})