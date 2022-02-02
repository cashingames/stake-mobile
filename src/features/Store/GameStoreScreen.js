import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Alert, Pressable, ScrollView } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { backendUrl } from '../../utils/BaseUrl';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from 'react-redux';
import { buyBoostFromWallet, buyPlanFromWallet } from "./StoreSlice";
import { Ionicons } from '@expo/vector-icons';
import { unwrapResult } from "@reduxjs/toolkit";
import { getUser } from "../Auth/AuthSlice";
import { formatCurrency, formatNumber } from "../../utils/stringUtl";
import AppButton from "../../shared/AppButton";
import UserItems from "../../shared/UserPurchasedItems";
import EStyleSheet from "react-native-extended-stylesheet";


export default function () {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getUser());
    }, []);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <UserItems />
            <GamePlans />
            <GameBoosts />
        </ScrollView>
    );
}

const GamePlans = () => {
    const plans = useSelector(state => state.common.plans);

    return (
        <View style={styles.storeItems}>
            <Text style={styles.title}>Buy Games</Text>
            <Text style={styles.storeItemsDescription}>
                You can only play 10 free games daily, Buy Games to enjoy
                playing without interruptons
            </Text>
            <View style={styles.storeCards}>
                {plans.map((plan, i) => <GamePlanCard key={i} plan={plan} />)}
            </View>
        </View>
    )
}

const GamePlanCard = ({ plan }) => {
    const refRBSheet = useRef();
    return (

        <Pressable activeOpacity={0.8} onPress={() => refRBSheet.current.open()}
            style={styles.storeItemContainer}>
            <PlanCardDetails plan={plan} />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={440}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    },
                    draggableIcon: {
                        backgroundColor: "#000",
                    },
                    container: {
                        borderTopStartRadius: 25,
                        borderTopEndRadius: 25,
                    }
                }}
            >
                <BuyGamePlan plan={plan} onClose={() => refRBSheet.current.close()} />
            </RBSheet>
        </Pressable>

    )
}

const BuyGamePlan = ({ plan, onClose }) => {
    const [loading, setLoading] = useState(false);
    const userBalance = useSelector(state => state.auth.user.walletBalance);

    const canPay = Number(userBalance) >= Number(plan.price);

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const buyPlanWallet = () => {
        setLoading(true);

        dispatch(buyPlanFromWallet(plan.id))
            .then(unwrapResult)
            .then(result => {
                console.log(result);
                dispatch(getUser())
                onClose()
                navigation.navigate("GamePlanPurchaseSuccessful")
            })
            .catch((rejectedValueOrSerializedError) => {
                setLoading(false);
                // after login eager get commond data for the whole app
                Alert.alert("Notice", "Operation could not be completed, please try again");
                console.log(rejectedValueOrSerializedError)
            });
    }

    return (
        <View style={styles.buyBoost}>
            <View style={styles.buyItemHeader}>
                <Text style={styles.buyItemTitle}>Buy Game</Text>
                <Ionicons name="close-outline" size={20} color="#292D32" onPress={onClose} />
            </View>
            <View style={styles.buyItemCard}>
                <PlanCardDetails plan={plan} />
            </View>
            <UserWalletBalance />
            <AppButton text={loading ? 'Buying...' : 'Confirm'} onPress={buyPlanWallet} disabled={!canPay || loading} style={styles.actionButton} />
        </View>
    )

}
const PlanCardDetails = ({ plan }) => {
    return (
        <>
            <Text style={styles.planCount}>{plan.game_count}</Text>
            <View style={styles.boostDetailsContainer}>
                <Text style={styles.storeItemName}>{plan.name}</Text>
                <Text style={styles.cardDescription}>{plan.description}</Text>
            </View>
            <Text style={styles.buyWithCash}>&#8358;{formatCurrency(plan.price)}</Text>
        </>
    )
}


const GameBoosts = () => {
    const boosts = useSelector(state => state.common.boosts);
    return (
        <View style={styles.storeItems}>
            <Text style={styles.title}>Buy Boosts</Text>
            <Text style={styles.storeItemsDescription}>
                Boost gives you super powers when you’re playing quizes.
                Buy boosts to let you win more games
            </Text>
            <View style={styles.storeCards}>
                {boosts.map((boost, i) => <BoostCard key={i} boost={boost} />)}
            </View>
        </View>
    )
}

const BoostCard = ({ boost }) => {
    const refRBSheet = useRef();
    return (
        <Pressable activeOpacity={0.8} onPress={() => refRBSheet.current.open()} style={styles.storeItemContainer}>
            <BoostCardDetails boost={boost} />
            <RBSheet
                ref={refRBSheet}
                closeOnDragDown={true}
                closeOnPressMask={true}
                height={440}
                customStyles={{
                    wrapper: {
                        backgroundColor: "rgba(0, 0, 0, 0.5)"
                    },
                    draggableIcon: {
                        backgroundColor: "#000",
                    },
                    container: {
                        borderTopStartRadius: 25,
                        borderTopEndRadius: 25,
                    }
                }}
            >
                <BuyBoost boost={boost} onClose={() => refRBSheet.current.close()} />
            </RBSheet>
        </Pressable>
    )
}

const BuyBoost = ({ boost, onClose }) => {
    const [loading, setLoading] = useState(false);
    const userBalance = useSelector(state => state.auth.user.walletBalance);

    const canPay = Number(userBalance) >= Number(boost.currency_value);

    const navigation = useNavigation();
    const dispatch = useDispatch();

    const buyBoostWallet = () => {
        setLoading(true);

        dispatch(buyBoostFromWallet(boost.id))
            .then(unwrapResult)
            .then(result => {
                dispatch(getUser())
                onClose()
                navigation.navigate("GameBoostPurchaseSuccessful")
            })
            .catch(rejectedValueOrSerializedError => {
                setLoading(false);
                Alert.alert("Notice", "Operation could not be completed, please try again");
            });
    }

    return (
        <View style={styles.buyBoost}>
            <View style={styles.buyItemHeader}>
                <Text style={styles.buyItemTitle}>Buy Boost</Text>
                <Ionicons name="close-outline" size={20} color="#292D32" onPress={onClose} />
            </View>
            <View style={styles.buyItemCard}>
                <BoostCardDetails boost={boost} />
            </View>
            <UserWalletBalance />
            <AppButton text={loading ? 'Buying...' : 'Confirm'} onPress={buyBoostWallet} disabled={!canPay || loading} style={styles.actionButton} />
        </View>
    )
}

const BoostCardDetails = ({ boost }) => {
    return (
        <>
            <Image
                source={{ uri: `${backendUrl}/${boost.icon}` }}
                style={styles.boostIcon}
            />
            <View style={styles.boostDetailsContainer}>
                <View style={styles.boostNameCount}>
                    <Text style={styles.storeItemName}>{boost.name}</Text>
                    <Text style={styles.number}>x{formatNumber(boost.pack_count)}</Text>
                </View>
                <Text style={styles.cardDescription}>{boost.description}</Text>
            </View>
            <Text style={styles.buyWithCash}>&#8358;{formatCurrency(boost.currency_value)}</Text>
        </>
    )
}

const UserWalletBalance = () => {
    const userBalance = useSelector(state => state.auth.user.walletBalance);
    return (
        <View style={styles.walletBalance}>
            <Image
                style={styles.purseIcon}
                source={require('../../../assets/images/store-purse.png')}
            />
            <View style={styles.userBalance}>
                <Text style={styles.balanceText}>Wallet Balance</Text>
                <Text style={styles.balance}>&#8358;{formatCurrency(userBalance)}</Text>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({

    container: {
        backgroundColor: '#F2F5FF',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(20),
    },
    storeItems: {
        marginTop: normalize(20),
        flexDirection: 'column',
    },
    title: {
        fontFamily: 'graphik-bold',
        fontWeight: '900',
        fontSize: '1.2rem',
        color: '#151C2F',
    },
    storeItemsDescription: {
        color: '#151C2F',
        fontSize: '0.7rem',
        fontFamily: 'graphik-regular',
        opacity: 0.6,
        lineHeight: responsiveScreenHeight(2.6),
        marginVertical: normalize(18)
    },
    storeCards: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        marginTop: normalize(15),
    },
    storeItemContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFF',
        borderRadius: 11,
        marginBottom: normalize(15),
        borderWidth: normalize(1),
        borderColor: '#E0E0E0',
        paddingVertical: normalize(13),
        paddingHorizontal: normalize(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 3.3,
    },
    buyItemCard: {
        alignItems: 'center',
        backgroundColor: '#F8F9FD',
        borderRadius: 11,
        marginVertical: normalize(22),
        borderWidth: normalize(1),
        borderColor: '#E0E0E0',
        paddingVertical: normalize(13),
        paddingHorizontal: normalize(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    planCount: {
        fontFamily: 'graphik-bold',
        fontSize: '2.1rem',
        color: '#2F80ED',
    },
    storeItemName: {
        fontFamily: 'graphik-medium',
        fontSize: '0.78rem',
        color: '#EF2F55',
    },
    cardDescription: {
        fontFamily: 'graphik-medium',
        fontSize: '0.73rem',
        color: '#828282',
        lineHeight: responsiveScreenHeight(2.5),
        width: responsiveScreenWidth(38)
    },
    buyWithCash: {
        fontFamily: 'graphik-bold',
        fontSize: '0.69rem',
        color: '#151C2F',
    },
    buyBoost: {
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(15)
    },
    buyItemHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    buyItemTitle: {
        fontFamily: 'graphik-medium',
        fontSize: '1rem',
        color: '#151C2F',
        marginBottom: normalize(10),
    },
    actionButton: {
       paddingVertical: normalize(16),
       marginTop: responsiveScreenHeight(6)
    },
    boostIcon: {
        marginTop: normalize(12),
        width: responsiveScreenHeight(6),
        height: responsiveScreenHeight(6),
    },
    boostDetailsContainer: {
        flexDirection: 'column'
    },
    boostNameCount: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    number: {
        fontFamily: 'graphik-bold',
        fontSize: '0.6rem',
        color: '#FF932F',
        marginTop: normalize(4),
        marginLeft: normalize(10)
    },
    walletBalance: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingVertical: normalize(15),
        borderRadius: 15,
        paddingHorizontal: normalize(10),
        alignItems: 'center',
        marginVertical: normalize(15)
    },
    purseIcon: {
        width: normalize(25),
        height: normalize(25),
    },
    userBalance: {
        marginLeft: normalize(20),
    },
    balanceText: {
        color: '#7C7D7F',
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem'
    },
    balance: {
        color: '#000000',
        fontFamily: 'graphik-bold',
        fontSize: '0.9rem',
        marginTop: normalize(5)
    },
});
