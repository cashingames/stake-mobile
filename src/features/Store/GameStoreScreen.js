import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, Image, Alert, Pressable, ScrollView } from 'react-native';
import normalize from '../../utils/normalize';
import { backendUrl } from '../../utils/BaseUrl';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from 'react-redux';
import { buyBoostFromWallet, buyPlanFromWallet } from "./StoreSlice";
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

const GamePlanCard = ({ plan }) => {
    const refRBSheet = useRef();
    return (

        <Pressable activeOpacity={0.8} onPress={() => refRBSheet.current.open()}>
            {!plan.is_free &&
                <View style={styles.storeItemContainer}>
                    <Text style={styles.planCount}>{plan.game_count}</Text>
                    <View>
                        <Text style={styles.storeItemName}>{plan.name}</Text>
                        <Text style={styles.description}>{plan.description}</Text>
                    </View>
                    <Text style={styles.buyWithCash}>&#8358;{formatCurrency(plan.price)}</Text>
                    <RBSheet
                        ref={refRBSheet}
                        closeOnDragDown={true}
                        closeOnPressMask={true}
                        height={380}
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
                </View>
            }
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
            <Text style={styles.buyBoostTitle}>Buy Game</Text>
            <Text style={styles.buyQuestion}>Are you sure you want to purchase this game plan?</Text>
            <UserWalletBalance />
            <View style={styles.buyOption}>
                <AppButton text={loading ? 'Buying...' : 'Pay'} onPress={buyPlanWallet} disabled={!canPay || loading} style={styles.actionButton} />
                <AppButton text={'Cancel'} onPress={onClose} />
            </View>
        </View>
    )

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
            <View style={styles.boostCards}>
                {plans.map((plan, i) => <GamePlanCard key={i} plan={plan} />)}
            </View>
        </View>
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
            <View style={styles.boostCards}>
                {boosts.map((boost, i) => <BoostCard key={i} boost={boost} />)}
            </View>
        </View>
    )
}

const BoostCard = ({ boost }) => {
    const refRBSheet = useRef();
    return (
        <Pressable activeOpacity={0.8} onPress={() => refRBSheet.current.open()}>
            <View style={styles.storeItemContainer}>
                <Image
                    source={{ uri: `${backendUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
                <View>
                    <View style={styles.boostNameCount}>
                        <Text style={styles.storeItemName}>{boost.name}</Text>
                        <Text style={styles.number}>x{formatNumber(boost.pack_count)}</Text>
                    </View>
                    <Text style={styles.description}>{boost.description}</Text>
                </View>
                <View style={styles.buy}>
                    <Text style={styles.buyWithCash}>&#8358;{formatCurrency(boost.currency_value)}</Text>
                </View>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={380}
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
            </View>
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
            <Text style={styles.buyBoostTitle}>Buy Boosts</Text>
            <Text style={styles.buyQuestion}>Are you sure you want to purchase this boost?</Text>
            <UserWalletBalance />
            <View style={styles.buyOption}>
                <AppButton text={loading ? 'Buying...' : 'Pay'} onPress={buyBoostWallet} disabled={!canPay || loading} style={styles.actionButton} />
                <AppButton text={'Cancel'} onPress={onClose} />
            </View>
        </View>
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
        flexDirection: 'column'
    },
    title: {
        fontFamily: 'graphik-bold',
        fontWeight: '900',
        fontSize: normalize(18),
        color: '#151C2F',
    },
    boostCards: {
        display: 'flex',
        flexDirection: 'column',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: normalize(15),

    },
    storeItemContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFF',
        borderRadius: 11,
        marginBottom: normalize(15),
        width: normalize(285),
        borderWidth: normalize(1),
        borderColor: '#E0E0E0',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(10),
        flexDirection: 'row',
        justifyContent: 'space-between'
    },

    iconContainer: {
        backgroundColor: '#FFFF',
        alignItems: 'center',
        height: normalize(75),
        width: normalize(55),
        borderRadius: 10,
        elevation: 12,
    },
    boostIcon: {
        marginTop: normalize(12),
        width: normalize(30),
        height: normalize(30),
    },
    hr: {
        borderBottomColor: '#B1CEFF',
        borderBottomWidth: normalize(1),
        width: normalize(180)
    },
    storeItemName: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
        color: '#EF2F55',
        // marginVertical: normalize(10),
    },
    number: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(10),
        color: '#FF932F',
        marginTop: normalize(4),
        marginLeft: normalize(10)
    },
    description: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(8),
        color: '#828282',
        marginVertical: normalize(4),
        textAlign: 'center',
        lineHeight: normalize(12)
    },
    buy: {
        alignItems: 'center',
        marginTop: normalize(4),
    },
    buyWithCash: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: '#151C2F',
    },
    buyBoost: {
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(15)
    },
    buyBoostTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(15),
        color: '#151C2F',
        marginBottom: normalize(15),
        textAlign: 'center'
    },
    buyQuestion: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(12),
        color: '#151C2F',
        marginBottom: normalize(30),
        textAlign: 'center'
    },
    buyOption: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    actionButton: {
        marginHorizontal: normalize(15),
        width: normalize(100),
    },
    storeItemsDescription: {
        color: '#151C2F',
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        opacity: 0.6,
        lineHeight: normalize(18),
        marginTop: normalize(10)
    },
    planCount: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(45),
        color: '#2F80ED'
    },
    boostNameCount: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    walletBalance: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        paddingVertical: normalize(18),
        borderRadius: 15,
        paddingHorizontal: normalize(10),
        alignItems: 'center'
    },
    userBalance: {
        marginLeft: normalize(20),
    },
    balanceText: {
        color: '#7C7D7F',
        fontFamily: 'graphik-medium',
        fontSize: normalize(10)
    },
    balance: {
        color: '#000000',
        fontFamily: 'graphik-bold',
        fontSize: normalize(15),
        marginTop: normalize(5)
    },
    purseIcon: {
        width: normalize(25),
        height: normalize(25),
    },


});
