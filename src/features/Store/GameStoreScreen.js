import React, { useRef, useState, useEffect } from "react";
import { Text, View, Image, Pressable, ScrollView, Platform, ImageBackground, ActivityIndicator } from 'react-native';
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
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from '../../utils/normalize';
import useSound from "../../utils/useSound";
import * as InAppPurchases from 'expo-in-app-purchases';
import { Alert } from "react-native";
import MixedContainerBackground from "../../shared/ContainerBackground/MixedContainerBackground";
import AppHeader from "../../shared/AppHeader";
import TopIcons from "../../shared/TopIcons";
import SpecialOffer from "./SpecialOffer";
import GameModal from "../../shared/GameModal";

export default function ({ navigation }) {
    const dispatch = useDispatch();
    useApplyHeaderWorkaround(navigation.setOptions);

    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [updateSuccessful, setUpdateSuccessful] = useState(false)
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
            setLoading(false)
        } else if (responseCode === InAppPurchases.IAPResponseCode.DEFERRED) {
            console.log('User does not have permissions to buy but requested parental approval (iOS only)');
            setLoading(false)
        } else {
            console.warn(`Something went wrong with the purchase. Received errorCode ${errorCode}`);
            setLoading(false)
        }
    });

    useEffect(() => {
        dispatch(getUser());
    }, []);

    const itemBought = async (productID) => {
        const { product, type } = getProductFromStoreId(productID)
        setLoading(true);

        dispatch(buyItemFromStore({
            type,
            item_id: product
        }))
            .then(unwrapResult)
            .then(result => {
                dispatch(getUser())
                setLoading(false);
                setUpdateSuccessful(true)
                setShowModal(true)
                successfulPurchase.playSound()
            })
            .catch(async rejectedValueOrSerializedError => {
                setLoading(false);
                setShowModal(true)
                Alert.alert("Notice", "Operation could not be completed, please try again");
                await analytics().logEvent('game_plan_purchased_failed', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email,
                    'item_name': plan?.name || productID || "",
                })
                failedPurchase.playSound()
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
        const _item = (storeProducts || []).find(_val => (_val.productId === productID))
        // console.log(storeProducts)
        if (_item !== null) {
            const _price = _item?.price || ''
            return _price
        }
        return ''
    }

    const purchaeStoreItem = async (plan, type) => {
        const productID = getProductID(plan, type)
        try {
            setLoading(true);
            await InAppPurchases.purchaseItemAsync(productID)
        } catch (e) {
            setLoading(false);
            Alert.alert('can\'t trigger purchase')
        }
    }

    return (
        <MixedContainerBackground>
            {
                ((loading) && (
                    <View style={styles.loader}>
                        <ActivityIndicator size={'large'} />
                    </View>
                ))
            }
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
            <GameModal
                showModal={showModal}
                setShowModal={setShowModal}
                multipleBtn={true}
                title={updateSuccessful ? 'Payment Successful!' : 'Payment Failed😥'}
                modalBody={updateSuccessful ? 'Your purchased item has been accrued to your account.' : 'Purchase could not be completed, please try again.'}
                btnText='Play'
                btnText_2='Store'
                btnHandler={() => navigation.navigate('Dashboard')}
                btnHandler_2={() => setShowModal(false)}
            />
        </MixedContainerBackground>

    );
}

const GamePlans = ({ user, purchaeStoreItem, getStorePrice }) => {
    const plans = useSelector(state => state.common.plans);
    const boosts = useSelector(state => state.common.boosts);
    return (
        <View style={styles.storeItems}>

            <View style={styles.storeCards}>
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
    return (
        <>
            <View style={styles.giftBoxCase}>
                <Image resizeMode="contain" style={styles.planIcon} source={require('../../../assets/images/heart-plan.png')} />
                <Text style={styles.storeItemName}>{plan.name}</Text>
            </View>
            <View style={styles.boostDetailsContainer}>
                <Text style={styles.cardDescription}>{plan.description}</Text>
            </View>
            <View style={styles.priceContainer}>
                <View style={styles.boostPriceCase}>
                    <Text style={styles.buyWithCash}>{getStorePrice(plan, 'plan')}</Text>
                </View>
            </View>
        </>
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
                    style={styles.boostIcon}
                />
                <Text style={styles.storeItemName}>{formatNumber(boost.pack_count)} {boost.name}</Text>
            </View>
            <View style={styles.boostDetailsContainer}>
                <Text style={styles.cardDescription}>{boost.description}</Text>
            </View>
            <View style={styles.priceContainer}>
                <View style={styles.boostPriceCase}>
                    <Text style={styles.buyWithCash}>{getStorePrice(boost, 'boost')}</Text>
                </View>
            </View>
        </>
    )
}
const styles = EStyleSheet.create({

    container: {
        paddingVertical: responsiveScreenHeight(2),
    },
    storeItems: {
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
        paddingVertical: responsiveHeight(2),
        paddingHorizontal: responsiveWidth(1),
        justifyContent: 'space-between',
        width: responsiveWidth(45),
        height: Platform.OS === "ios" ? responsiveHeight(22.5) : responsiveHeight(25),
        marginHorizontal: '0.5rem',
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
        fontSize: '0.8rem',
        color: '#fff',
        textAlign: 'center',
        marginVertical: Platform.OS === "android" ? 5 : '',
    },
    cardDescription: {
        fontFamily: 'graphik-medium',
        fontSize: '0.5rem',
        color: '#fff',
        width: '10.5rem',
        textAlign: 'center'
    },
    buyWithCash: {
        fontFamily: 'blues-smile',
        fontSize: '1rem',
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
        width: responsiveWidth(30),
        height: responsiveHeight(10),
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
        width: responsiveWidth(30),
        height: responsiveHeight(10),
    },
    priceContainer: {
        alignItems: 'center'
    },
    boostPriceCase: {
        backgroundColor: '#0038B3',
        paddingVertical: normalize(4),
        borderWidth: 2,
        borderColor: '#00EDF1',
        marginTop: 10,
        justifyContent: 'center',
        alignItems: 'center',
        width: responsiveWidth(36)
    },
    loader: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 99,
        backgroundColor: 'rgba(0, 0, 0, 0.3)'
    }

});
