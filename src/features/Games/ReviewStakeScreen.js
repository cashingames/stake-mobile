import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Image, Pressable } from 'react-native';
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import normalize from "../../utils/normalize";
import Input from "../../shared/Input";
import AppButton from "../../shared/AppButton";
import { getGameStakes } from "./GameSlice";
import { getUser } from "../Auth/AuthSlice";
import UserWalletBalance from "../../shared/UserWalletBalance";
import StakingPredictionsTable from "../../shared/StakingPredictionsTable";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../../utils/stringUtl";


const ReviewStakeScreen = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector((state) => state.auth.user);
    const gameStakes = useSelector(state => state.game.gameStakes);
    const amountStaked = useSelector(state => state.game.amountStaked);
    const correctCount = useSelector(state => state.game.correctCount);
    const dispatch = useDispatch();
    const [hidden, setHidden] = useState(false);
    const depositBalance = Number.parseFloat(user.walletBalance) - Number.parseFloat(user.withdrawableBalance)


    const toggleSecureText = () => {
        setHidden(!hidden);
    }

    const depositFunds = async () => {
        logToAnalytics("deposit_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('Wallet')
    }

    useEffect(() => {
        dispatch(getGameStakes())
        dispatch(getUser())
    }, [])



    return (
        <ScrollView style={styles.container}>
            {/* <View style={styles.detailsContainer}>
                <View style={styles.totalHeader}>
                    <View style={styles.totalTitleContainer}>
                        <Image
                            source={require('../../../assets/images/wallet-with-cash.png')}
                            style={styles.avatar}
                        />
                        <Text style={styles.totalTitleText}>Total balance</Text>
                    </View>
                    <Ionicons name={hidden ? 'eye-off-outline' : "eye-outline"} size={22} color="#072169" onPress={toggleSecureText} />
                </View>
                <View style={styles.currencyHeader}>
                    <View style={styles.currencyHeaderLeft}>
                        <Text style={styles.currencyText}>NGN</Text>
                        <Text style={styles.currencyAmount}>{formatCurrency(depositBalance ?? 0)}</Text>
                        
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
            </View> */}
            <Input
                label='Enter stake amount'
                value={amountStaked}
                onChangeText={amountStaked}
                autoFocus={false}
                editable={false}
                placeholder="Enter Stake Amount"
                keyboardType="numeric"
            />
            <AppButton text="Stake Amount" disabled disabledStyle={styles.disabled} style={styles.stakeButton} />
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
        backgroundColor: '#F9FBFF',
        paddingBottom: normalize(10),
        paddingTop: normalize(20),
        paddingHorizontal: normalize(18)
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
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        marginLeft: '.4rem'
    },
    avatar: {
        width: '1.35rem',
        height: '1.35rem'
    },
    currencyText: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1.1rem',
        marginRight: '.3rem'
    },
    currencyAmount: {
        color: '#1C453B',
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
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
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
        marginTop: '1rem',
        marginBottom: '3.5rem'
    },
    stakeScoreContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '3rem'
    },
    stakeHeading: {
        textAlign: 'center',
        fontFamily: "gotham-bold",
        fontSize: ".95rem",
        color: "#1C453B",
        marginVertical: '1.1rem',
    },

    stakeScore: {
        fontFamily: "gotham-bold",
        fontSize: ".85rem",
        color: "#1C453B",
    },
    stakeHead: {
        fontFamily: "gotham-bold",
        fontSize: ".85rem",
        color: "#1C453B",
        marginRight: '1rem',
    },
    stakePay: {
        fontFamily: "gotham-bold",
        fontSize: ".85rem",
        color: "#1C453B",
        marginRight: '1rem',
    },
    stakeHeaders: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: normalize(10),
        borderBottomWidth: 1,
        borderColor: '#E0E0E0',
        paddingBottom: '1rem'
    },
    amountWon: {
        backgroundColor: '#008000',
        paddingHorizontal: '.2rem',
        opacity: 0.6
    },
    disabled: {
        backgroundColor: '#EA8663'
    },
    stakeButton: {
        marginVertical: 5,
    }

})