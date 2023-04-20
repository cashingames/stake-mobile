import React, { useRef, useState, useEffect } from "react";
import { Text, View, Image, Pressable, ScrollView, Platform, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from 'react-redux';
import Animated from "react-native-reanimated";
import { Ionicons } from '@expo/vector-icons';
import { unwrapResult } from "@reduxjs/toolkit";
import EStyleSheet from "react-native-extended-stylesheet";
import analytics from '@react-native-firebase/analytics';
import { buyBoostFromWallet, buyItemFromStore, buyPlanFromWallet } from "./StoreSlice";
import { getUser } from "../Auth/AuthSlice";
import { formatCurrency, formatNumber, isTrue } from "../../utils/stringUtl";
import AppButton from "../../shared/AppButton";
import UserItems from "../../shared/UserItems";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import { randomEnteringAnimation } from "../../utils/utils";
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import useSound from "../../utils/useSound";
import * as InAppPurchases from 'expo-in-app-purchases';
import { Alert } from "react-native";
import MixedContainerBackground from "../../shared/ContainerBackground/MixedContainerBackground";
import AppHeader from "../../shared/AppHeader";
import TopIcons from "../../shared/TopIcons";
import SpecialOffer from "./SpecialOffer";


export default function ({ navigation }) {
    const dispatch = useDispatch();
    useApplyHeaderWorkaround(navigation.setOptions);

    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.auth.user)
    const storeProducts = useSelector(state => state.inAppPurchase.items);

    const successfulPurchase = useSound(require('../../../assets/sounds/updated.mp3'))
    const failedPurchase = useSound(require('../../../assets/sounds/failed.mp3'))

    InAppPurchases.setPurchaseListener(({ responseCode, results, errorCode }) => {
        // Purchase was successful
        if (responseCode === InAppPurchases.IAPResponseCode.OK) {
            results.forEach(purchase => {
                if (!purchase.acknowledged) {
                    console.log(`Successfully purchased ${purchase.productId}`);
                    // Process transaction here and unlock content...
                    //   acknowledge payment
                    InAppPurchases.finishTransactionAsync(purchase, true);

                    // Then when you're done
                    //   InAppPurchases.finishTransactionAsync(purchase, true);
                    itemBought(purchase.productId)
                    // Alert.alert('successfully purchased product',purchase.productId)
                }
            });
        } else if (responseCode === InAppPurchases.IAPResponseCode.USER_CANCELED) {
            console.log('User canceled the transaction');
        } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
            console.log('User does not have permissions to buy but requested parental approval (iOS only)');
        } else {
            console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
        }
    });

    useEffect(() => {
        dispatch(getUser());
    }, []);

    // useEffect(()=>{
    //     itemBought('game_plan_ultimate')
    // }, [])

    const itemBought = async (productID) => {
        Alert.alert('init')
        const { product, type } = getProductFromStoreId(productID)
        setLoading(false);
        Alert.alert('before triggering a call to server')

        dispatch(buyItemFromStore({
            type,
            item_id: product
        }))
            .then(unwrapResult)
            .then(result => {
                Alert.alert('handshake with server successful')
                dispatch(getUser())
                // onClose()
                successfulPurchase.playSound()
                navigation.navigate("GameBoostPurchaseSuccessful")
            })
            .catch(async rejectedValueOrSerializedError => {
                setLoading(false);
                Alert.alert("Notice", "Operation could not be completed, please try again");
                await analytics().logEvent('game_plan_purchased_failed', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email,
                    'item_name': plan?.name || productID || "",
                })
                failedPurchase.playSound()
                navigation.navigate("GameStoreItemsPurchaseFailed")
            })
    }

    const getProductFromStoreId = (id) => {
        let product = null;
        let type = null;

        switch (id) {
            case 'game_plan_doubleo':
                product = 2;
                type = 'PLAN';
                break;
            case 'game_plan_dicey_multiples':
                product = 3;
                type = 'PLAN';
                break;
            case 'game_plan_ultimate':
                product = 4;
                type = 'PLAN';
                break;
            case 'game_plan_least':
                product = 7;
                type = 'PLAN';
                break;
            case 'game_plan_mini':
                product = 8;
                type = 'PLAN';
                break;
            case 'boost_plan_skip':
                product = 6;
                type = 'BOOST';
                break;
            case 'boost_plan_bomb':
                product = 7;
                type = 'BOOST';
                break;
            case 'boost_plan_time_freeze':
                product = 8;
                type = 'BOOST';
                break;
            default:
                product = 8;
                type = 'BOOST';
        }

        return { product, type }
    }

    const getProductID = (plan, type) => {
        let productID = null;
        if (type === 'plan') {
            switch (plan.id) {
                case 2:
                    productID = 'game_plan_doubleo';
                    break;
                case 3:
                    productID = 'game_plan_dicey_multiples';
                    break;
                case 4:
                    productID = 'game_plan_ultimate';
                    break;
                case 7:
                    productID = 'game_plan_least';
                    break;
                case 8:
                    productID = 'game_plan_mini';
                    break;
                default:
                    productID = 'game_plan_least';
            }
        } else {
            switch (plan.id) {
                case 6:
                    productID = 'boost_plan_skip';
                    break;
                case 7:
                    productID = 'boost_plan_bomb';
                    break;
                case 8:
                    productID = 'boost_plan_time_freeze';
                    break;
                default:
                    productID = 'boost_plan_skip';
            }
        }
        return productID
    }

    const getStorePrice = (plan, type) => {
        const productID = getProductID(plan, type)
        // console.log(storeProducts)
        const _item = (storeProducts || []).find(_val => (_val.productId === productID))

        if (_item !== null) {
            const _price = _item?.price || ''
            return _price
        }
        return ''
    }

    const purchaeStoreItem = async (plan, type) => {
        const productID = getProductID(plan, type)
        await InAppPurchases.purchaseItemAsync(productID)
    }

    return (
        <MixedContainerBackground>
            <ScrollView contentContainerStyle={styles.container}>
                <TopIcons />
                <AppHeader />
                <View style={styles.header}>
                    <Image
                        style={styles.avatar}
                        source={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}

                    />
                    <View style={styles.headerTextCase}>
                        <Text style={styles.headerText}>Store</Text>
                    </View>
                </View>
                <GamePlans user={user} purchaeStoreItem={purchaeStoreItem} getStorePrice={getStorePrice} />
                {/* <GameBoosts user={user} purchaeStoreItem={purchaeStoreItem} getStorePrice={getStorePrice} /> */}
                {/* <SpecialOffer /> */}
            </ScrollView>
        </MixedContainerBackground>

    );
}

const GamePlans = ({ user, purchaeStoreItem, getStorePrice }) => {
    const plans = useSelector(state => state.common.plans);
    const boosts = useSelector(state => state.common.boosts);
    return (
        <View style={styles.storeItems}>

            <View style={styles.storeCards}>
                {/* <View>
                    <ImageBackground style={styles.storeItemContainer} source={require('../../../assets/images/store-items-bg.png')}>
                        <Animated.View entering={randomEnteringAnimation().duration(1000)}>
                            <View style={styles.giftBoxCase}>
                                <View>
                                    <Image style={styles.giftBox} source={require('../../../assets/images/free-gift.png')} />
                                </View>
                                <Text style={styles.storeItemName}>Daily Gift</Text>
                            </View>
                            <View style={styles.boostDetailsContainer}>
                                <Text style={styles.cardDescription}>Get free daily gifts</Text>
                            </View>
                            <View style={styles.boostPriceCase}>
                                <Text style={styles.buyWithCash}>Free</Text>
                            </View>
                        </Animated.View>
                    </ImageBackground>
                </View> */}
                {plans.map((plan, i) => <GamePlanCard key={i} plan={plan} user={user} purchaeStoreItem={purchaeStoreItem} getStorePrice={getStorePrice} />)}
                {boosts.map((boost, i) => <BoostCard key={i} boost={boost} user={user} purchaeStoreItem={purchaeStoreItem} getStorePrice={getStorePrice} />)}
            </View>
        </View>
    )
}

const GamePlanCard = ({ plan, user, purchaeStoreItem, getStorePrice }) => {
    const { playSound } = useSound(require('../../../assets/sounds/pop-up.wav'))
    const refRBSheet = useRef();
    const buyGamePlan = async () => {
        await analytics().logEvent('initiate_plan_purchase', {
            'transaction_id': user.username,
            'currency': 'NGN',
            'value': plan.price,
            'item_id': user.username,
            'item_name': plan.name,
            'item_category': 'ecommerce',
            'price': plan.price
        })
        purchaeStoreItem(plan, 'plan')
        playSound()
        // refRBSheet.current.open()
    }
    return (
        <ImageBackground resizeMode="contain" style={styles.storeItemContainer} source={require('../../../assets/images/store-items-bg.png')}>
            <Pressable onPress={buyGamePlan}>
                <Animated.View entering={randomEnteringAnimation().duration(1000)}>
                    <PlanCardDetails plan={plan} getStorePrice={getStorePrice} />
                </Animated.View>
            </Pressable>
        </ImageBackground>
    )
}

const PlanCardDetails = ({ plan, getStorePrice }) => {
    console.log(plan)
    return (
        <>
            <View style={styles.giftBoxCase}>
                <Image resizeMode="contain" style={styles.planIcon} source={require('../../../assets/images/heart-plan.png')} />
                <Text style={styles.storeItemName}>{plan.name}</Text>
            </View>
            {/* <Text style={styles.planCount}>{plan.game_count}</Text> */}
            <View style={styles.boostDetailsContainer}>
                <Text style={styles.cardDescription}>{plan.description}</Text>
            </View>
            <View style={styles.boostPriceCase}>
                <Text style={styles.buyWithCash}>{getStorePrice(plan, 'plan')}</Text>
            </View>
        </>
    )
}


const GameBoosts = ({ user, purchaeStoreItem, getStorePrice }) => {
    const boosts = useSelector(state => state.common.boosts);
    return (
        <View style={styles.storeItems}>
            <View style={styles.storeCards}>
                {boosts.map((boost, i) => <BoostCard key={i} boost={boost} user={user} purchaeStoreItem={purchaeStoreItem} getStorePrice={getStorePrice} />)}
            </View>
        </View>
    )
}

const BoostCard = ({ boost, user, purchaeStoreItem, getStorePrice }) => {
    const { playSound } = useSound(require('../../../assets/sounds/achievement-unlocked2.wav'))
    const refRBSheet = useRef();
    const buyBoost = async () => {
        await analytics().logEvent('initiate_boost_purchase', {
            'transaction_id': user.username,
            'currency': 'NGN',
            'value': boost.currency_value,
            'item_id': user.username,
            'item_name': boost.name,
            'item_category': 'ecommerce',
            'price': boost.currency_value
        })
        purchaeStoreItem(boost, 'boost')
        playSound()
        // refRBSheet.current.open()
    }
    return (
        <ImageBackground resizeMode="contain" style={styles.storeItemContainer} source={require('../../../assets/images/store-items-bg.png')}>
            <Pressable activeOpacity={0.8} onPress={buyBoost}>
                <Animated.View entering={randomEnteringAnimation().duration(1000)}>
                    <BoostCardDetails boost={boost} getStorePrice={getStorePrice} />
                </Animated.View>
            </Pressable>
        </ImageBackground>

    )
}

const BoostCardDetails = ({ boost, getStorePrice }) => {
    return (
        <>
            <View style={styles.giftBoxCase}>
                <Image resizeMode="contain"
                    source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${boost.icon}` }}
                    style={ styles.boostIcon}
                />
                <Text style={styles.storeItemName}>{formatNumber(boost.pack_count)} {boost.name}</Text>
            </View>
            <View style={styles.boostDetailsContainer}>
                <Text style={styles.cardDescription}>{boost.description}</Text>
            </View>
            <View style={styles.boostPriceCase}>
                <Text style={styles.buyWithCash}>{getStorePrice(boost, 'boost')}</Text>
            </View>
        </>
    )
}
const styles = EStyleSheet.create({

    container: {
        paddingTop: responsiveScreenHeight(2),
        paddingBottom: responsiveScreenHeight(10)
    },
    storeItems: {
        // paddingBottom: normalize(20),
        flexDirection: 'column',
        // backgroundColor: 'yellow',
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
        // marginVertical: normalize(18)
    },
    storeCards: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    storeItemContainer: {
        alignItems: 'center',
        marginBottom: normalize(20),
        paddingVertical: responsiveScreenHeight(2),
        justifyContent: 'space-between',
        width: 160,
        height: 180,
        marginHorizontal:'0.5rem'
    },
    buyItemCard: {
        alignItems: 'center',
        backgroundColor: '#F8F9FD',
        borderRadius: 11,
        marginVertical: normalize(22),
        borderWidth: Platform.OS === 'ios' ? normalize(1) : normalize(2.4),
        borderColor: '#E0E0E0',
        paddingVertical: normalize(13),
        paddingHorizontal: normalize(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    planCountContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    planCount: {
        fontFamily: 'graphik-bold',
        fontSize: '2.1rem',
        color: '#2F80ED',
    },
    storeItemName: {
        fontFamily: 'blues-smile',
        fontSize: '1rem',
        color: '#fff',
        textAlign: 'center'
    },
    cardDescription: {
        fontFamily: 'graphik-medium',
        fontSize: '0.5rem',
        color: '#fff',
        // lineHeight: responsiveScreenHeight(2.5),
        width: responsiveScreenWidth(38),
        textAlign: 'center'
    },
    buyWithCash: {
        fontFamily: 'blues-smile',
        fontSize: '1.2rem',
        color: '#fff',
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
        paddingVertical: responsiveScreenHeight(2.3),
        marginTop: responsiveScreenHeight(5)
    },
    boostIcon: {
        width: normalize(75),
        height: normalize(75),
    },
    boostDetailsContainer: {
        alignItems: 'center',
    },
    boostNameCount: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#2D53A0',
        borderColor: '#FFAA00',
        borderBottomWidth: 4,
        justifyContent: 'space-around',
        height: 50,
        alignItems: 'center',
        marginVertical: normalize(20)
    },
    avatar: {
        height: 71,
        width: 71,
        borderRadius: 50,
        borderColor: '#FFAA00',
        borderWidth: 2,
        marginTop: -25,
        backgroundColor: '#fff'
    },
    headerTextCase: {
        width: '50%',
        alignItems: "flex-start",
        marginVertical: '2rem'
    },
    headerText: {
        fontFamily: 'blues-smile',
        color: '#fff',
        fontSize: '2rem'
    },
    giftBoxCase: {
        alignItems: 'center',
    },
    giftBox: {
        height: normalize(95),
        width: normalize(96)
    },
    planIcon: {
        height: 75,
        width: 75
    },
    boostPriceCase: {
        backgroundColor: '#0038B3',
        paddingVertical: normalize(4),
        // width: normalize(158),
        borderWidth: 2,
        borderColor: '#00EDF1',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },

});
