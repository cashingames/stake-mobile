import React, { useRef, useState, useEffect } from "react";
import { Text, View, Image, Pressable, ScrollView, Platform } from 'react-native';
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
import { formatCurrency, formatNumber } from "../../utils/stringUtl";
import AppButton from "../../shared/AppButton";
import UserItems from "../../shared/UserItems";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import { randomEnteringAnimation } from "../../utils/utils";
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import useSound from "../../utils/useSound";
import * as InAppPurchases from 'expo-in-app-purchases';
import { Alert } from "react-native";


export default function ({ navigation }) {
    const dispatch = useDispatch();
    useApplyHeaderWorkaround(navigation.setOptions);

    const [loading, setLoading] = useState(false);
    const user = useSelector(state => state.auth.user)
    const storeProducts = useSelector(state => state.inAppPurchase.items);

    const successfulPurchase =  useSound(require('../../../assets/sounds/updated.mp3'))
    const failedPurchase =  useSound(require('../../../assets/sounds/failed.mp3'))

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
        const {product, type} = getProductFromStoreId(productID)
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

    const getProductFromStoreId =  (id) => {
        let product = null;
        let type = null;
        
        switch(id) {
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
        
        return {product, type}
    }

    const getProductID =  (plan, type) => {
        let productID = null;
        if(type === 'plan'){
            switch(plan.id) {
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
                    productID ='game_plan_least';
            }
        }else{
            switch(plan.id) {
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
        const productID =  getProductID(plan, type)
        // console.log(storeProducts)
        const _item = (storeProducts || []).find(_val => (_val.productId === productID))
        
        if(_item !== null){
            const _price = _item?.price || ''
        return _price
        }
        return ''
    }

    const purchaeStoreItem = async (plan, type) => {
        const productID =  getProductID(plan, type)
        await InAppPurchases.purchaseItemAsync(productID)
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <UserItems />
            <GamePlans user={user} purchaeStoreItem={purchaeStoreItem} getStorePrice={getStorePrice}/>
            <GameBoosts user={user} purchaeStoreItem={purchaeStoreItem} getStorePrice={getStorePrice} />
        </ScrollView>
    );
}

const GamePlans = ({ user, purchaeStoreItem, getStorePrice }) => {
    const plans = useSelector(state => state.common.plans);
    return (
        <View style={styles.storeItems}>
            <Text style={styles.title}>Get Games</Text>
            <Text style={styles.storeItemsDescription}>
                You can only play 5 free games daily, Get Games to enjoy
                playing without interruptons
            </Text>
            <View style={styles.storeCards}>
                {plans.map((plan, i) => <GamePlanCard key={i} plan={plan} user={user} purchaeStoreItem={purchaeStoreItem} getStorePrice={getStorePrice} />)}
            </View>
        </View>
    )
}

const GamePlanCard = ({ plan, user, purchaeStoreItem, getStorePrice }) => {
    const { playSound } =  useSound(require('../../../assets/sounds/pop-up.wav'))
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
        <Pressable activeOpacity={0.8} onPress={buyGamePlan}>
            <Animated.View style={styles.storeItemContainer} entering={randomEnteringAnimation().duration(1000)}>
                <PlanCardDetails plan={plan} getStorePrice={getStorePrice}/>
            </Animated.View>

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
                <BuyGamePlan plan={plan} onClose={() => refRBSheet.current.close()} user={user} />
            </RBSheet>
        </Pressable>

    )
}

const PlanCardDetails = ({ plan, getStorePrice}) => {
    return (
        <>
            <Text style={styles.planCount}>{plan.game_count}</Text>
            <View style={styles.boostDetailsContainer}>
                <Text style={styles.storeItemName}>{plan.name}</Text>
                <Text style={styles.cardDescription}>{plan.description}</Text>
            </View>
            <Text style={styles.buyWithCash}>{getStorePrice(plan, 'plan')}</Text>
            {/* <Text style={styles.buyWithCash}>&#8358;{formatCurrency(plan.price)}</Text> */}
        </>
    )
}

const BuyGamePlan = ({ plan, onClose, user }) => {
    const [loading, setLoading] = useState(false);
    const userBalance = useSelector(state => state.auth.user.walletBalance);
    const newUser = useSelector(state => state.auth.user.joinedOn);
    const newUserDate = newUser.slice(0, 10);
    let formattedDate = new Date().toISOString().split('T')[0];

    const canPay = Number(userBalance) >= Number(plan.price);
    const successfulPurchase =  useSound(require('../../../assets/sounds/updated.mp3'))
    const failedPurchase =  useSound(require('../../../assets/sounds/failed.mp3'))
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const buyPlanWallet = () => {
        setLoading(true);
        dispatch(buyPlanFromWallet(plan.id))
            .then(unwrapResult)
            .then(async () => {
                if (formattedDate === newUserDate) {
                    await analytics().logEvent('new_user_plan_purchased', {
                        'transaction_id': user.username,
                        'currency': 'NGN',
                        'value': plan.price,
                        'item_id': user.username,
                        'item_name': plan.name,
                        'item_category': 'ecommerce',
                        'price': plan.price
                    })
                } else {
                    await analytics().logEvent('plan_purchase', {
                        'transaction_id': user.username,
                        'currency': 'NGN',
                        'value': plan.price,
                        'item_id': user.username,
                        'item_name': plan.name,
                        'item_category': 'ecommerce',
                        'price': plan.price
                    })
                }
            })
            .then(result => {
                // console.log(result);
                dispatch(getUser())
                onClose()
                successfulPurchase.playSound()
                navigation.navigate("GamePlanPurchaseSuccessful")
            })
            .catch(async rejectedValueOrSerializedError => {
                setLoading(false);
                // Alert.alert("Notice", "Operation could not be completed, please try again");
                await analytics().logEvent('game_plan_purchased_failed', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email,
                    'item_name': plan.name,
                })
                failedPurchase.playSound()
                navigation.navigate("GameStoreItemsPurchaseFailed")
            });
    }

    return (
        <View style={styles.buyBoost}>
            <View style={styles.buyItemHeader}>
                <Text style={styles.buyItemTitle}>Get Game</Text>
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

const GameBoosts = ({ user, purchaeStoreItem, getStorePrice }) => {
    const boosts = useSelector(state => state.common.boosts);
    return (
        <View style={styles.storeItems}>
            <Text style={styles.title}>Get Boosts</Text>
            <Text style={styles.storeItemsDescription}>
                Boost gives you super powers when you’re playing quizes.
                Get boosts to let you win more games
            </Text>
            <View style={styles.storeCards}>
            {boosts.map((boost, i) => <BoostCard key={i} boost={boost} user={user} purchaeStoreItem={purchaeStoreItem} getStorePrice={getStorePrice} />)}
            </View>
        </View>
    )
}

const BoostCard = ({ boost, user, purchaeStoreItem,getStorePrice }) => {
    const { playSound } =  useSound(require('../../../assets/sounds/achievement-unlocked2.wav'))
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
        <Pressable activeOpacity={0.8} onPress={buyBoost}>
            <Animated.View style={styles.storeItemContainer} entering={randomEnteringAnimation().duration(1000)}>
                <BoostCardDetails boost={boost} getStorePrice={getStorePrice}/>
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
                    <BuyBoost boost={boost} onClose={() => refRBSheet.current.close()} user={user} />
                </RBSheet>
            </Animated.View>
        </Pressable>
    )
}

const BoostCardDetails = ({ boost, getStorePrice }) => {
    return (
        <>
            <Image
                source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${boost.icon}` }}
                style={styles.boostIcon}
            />
            <View style={styles.boostDetailsContainer}>
                <View style={styles.boostNameCount}>
                    <Text style={styles.storeItemName}>{boost.name}</Text>
                    <Text style={styles.number}>x{formatNumber(boost.pack_count)}</Text>
                </View>
                <Text style={styles.cardDescription}>{boost.description}</Text>
            </View>
            <Text style={styles.buyWithCash}>{getStorePrice(boost, 'boost')}</Text>
        </>
    )
}

const BuyBoost = ({ boost, onClose, user }) => {
    const [loading, setLoading] = useState(false);
    const userBalance = useSelector(state => state.auth.user.walletBalance);
    const newUser = useSelector(state => state.auth.user.joinedOn);
    const newUserDate = newUser.slice(0, 10);
    let formattedDate = new Date().toISOString().split('T')[0];
    const canPay = Number(userBalance) >= Number(boost.currency_value);
    const successfulPurchase =  useSound(require('../../../assets/sounds/updated.mp3'))
    const failedPurchase =  useSound(require('../../../assets/sounds/failed.mp3'))
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const buyBoostWallet = () => {
        setLoading(true);
        dispatch(buyBoostFromWallet(boost.id))
            .then(unwrapResult)
            .then(async () => {
                if (formattedDate === newUserDate) {
                    await analytics().logEvent('new_user_boost_purchased', {
                        'transaction_id': user.username,
                        'currency': 'NGN',
                        'value': boost.currency_value,
                        'item_id': user.username,
                        'item_name': boost.name,
                        'item_category': 'ecommerce',
                        'price': boost.currency_value
                    })
                } else {
                    await analytics().logEvent('boost_purchase', {
                        'transaction_id': user.username,
                        'currency': 'NGN',
                        'value': boost.currency_value,
                        'item_id': user.username,
                        'item_name': boost.name,
                        'item_category': 'ecommerce',
                        'price': boost.currency_value
                    })
                }
            })
            .then(result => {
                dispatch(getUser())
                onClose()
                successfulPurchase.playSound()
                navigation.navigate("GameBoostPurchaseSuccessful")
            })
            .catch(async rejectedValueOrSerializedError => {
                setLoading(false);
                // Alert.alert("Notice", "Operation could not be completed, please try again");
                await analytics().logEvent('boost_purchased_failed', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                })
                failedPurchase.playSound()
                navigation.navigate("GameStoreItemsPurchaseFailed")
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
        borderWidth: Platform.OS === 'ios' ? normalize(0.5) : normalize(1),
        borderColor: '#E0E0E0',
        paddingVertical: normalize(13),
        paddingVertical: Platform.OS === 'ios' ? normalize(14) : normalize(13),
        paddingHorizontal: normalize(15),
        flexDirection: 'row',
        justifyContent: 'space-between',
        elevation: 2.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.2,
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
        paddingVertical: responsiveScreenHeight(2.3),
        marginTop: responsiveScreenHeight(5)
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
