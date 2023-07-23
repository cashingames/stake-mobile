import React, { useRef, useState, useEffect } from "react";
import { Text, View, Image, Pressable, ScrollView, Platform, ImageBackground } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/native';
import RBSheet from "react-native-raw-bottom-sheet";
import { useDispatch, useSelector } from 'react-redux';
import Animated from "react-native-reanimated";
import { unwrapResult } from "@reduxjs/toolkit";
import EStyleSheet from "react-native-extended-stylesheet";
import { buyBoostFromWallet } from "./StoreSlice";
import { getUser } from "../Auth/AuthSlice";
import { formatCurrency, formatNumber } from "../../utils/stringUtl";
import AppButton from "../../shared/AppButton";
import { randomEnteringAnimation } from "../../utils/utils";
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import logToAnalytics from "../../utils/analytics";
import { SelectList } from "react-native-dropdown-select-list";
import { setWalletSource } from "../Games/GameSlice";


export default function () {

    const boosts = useSelector(state => state.common.boosts);

    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView contentContainerStyle={styles.container} >
                <View style={styles.storeCards}>
                    {boosts.map((boost, i) => <BoostCard key={i} boost={boost} />)}
                </View>
            </ScrollView>
        </ImageBackground>
    );
}


const BoostCard = ({ boost }) => {
    const user = useSelector(state => state.auth.user)

    const refRBSheet = useRef();
    const buyBoost = () => {
        logToAnalytics('initiate_boost_purchase', {
            'transaction_id': user.username,
            'currency': 'NGN',
            'value': boost.currency_value,
            'item_id': user.username,
            'item_name': boost.name,
            'item_category': 'ecommerce',
            'price': boost.currency_value
        })

        refRBSheet.current.open()
    }
    return (
        <Pressable activeOpacity={0.8} onPress={buyBoost}>
            <Animated.View style={styles.storeItemContainer} entering={randomEnteringAnimation().duration(1000)}>
                <BoostCardDetails boost={boost} />
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={500}
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
            </Animated.View>
        </Pressable>
    )
}

const BoostCardDetails = ({ boost }) => {
    return (
        <>
            <View style={styles.boostDetailsContainer}>
                <Image
                    source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${boost.icon}` }}
                    style={styles.boostIcon}
                />
                <Text style={styles.number}>x{formatNumber(boost.pack_count)}</Text>
            </View>
            <View style={styles.boostNameCount}>
                <Text style={styles.storeItemName}>{boost.name}</Text>
                <Text style={styles.cardDescription}>{boost.description}</Text>
            </View>
            <View style={styles.amountContainer}>
                <Text style={styles.buyWithCash}>Buy &#8358;{boost.currency_value}</Text>
            </View>
        </>
    )
}

const BuyBoost = ({ boost, onClose }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const user = useSelector((state) => state.auth.user);
    const userBalance = useSelector(state => state.auth.user.walletBalance);
    const newUser = useSelector(state => state.auth.user.joinedOn);
    const newUserDate = newUser.slice(0, 10);
    let formattedDate = new Date().toISOString().split('T')[0];
    const canPay = Number(userBalance) >= Number(boost.currency_value);
    const depositBalance = Number.parseFloat(user.walletBalance) - Number.parseFloat(user.withdrawableBalance)
    const minimumExhibitionStakeAmount = useSelector(state => state.common.minimumExhibitionStakeAmount);
    const [selected, setSelected] = useState('');
    const [walletType, setWalletType] = useState('');
    console.log(walletType)


    useEffect(() => {
        if (selected === `Deposit (NGN ${formatCurrency(depositBalance)})`) {
            setWalletType('deposit_balance')
        }
        if (selected === `Bonus (NGN ${formatCurrency(user.bonusBalance)})`) {
            setWalletType('bonus_balance')
        }
    }, [selected])

    const buyBoostWallet = () => {
        setLoading(true);
        dispatch(setWalletSource(walletType))
        dispatch(buyBoostFromWallet(
            boost.id, 
            {wallet_type:walletType}
            ))
            .then(unwrapResult)
            .then(async () => {
                if (formattedDate === newUserDate) {
                    logToAnalytics('new_user_boost_purchased', {
                        'transaction_id': user.username,
                        'currency': 'NGN',
                        'value': boost.currency_value,
                        'item_id': user.username,
                        'item_name': boost.name,
                        'item_category': 'ecommerce',
                        'price': boost.currency_value
                    })
                } else {
                    logToAnalytics('boost_purchase', {
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
                navigation.navigate("GameBoostPurchaseSuccessful",
                    {
                        boost_name: boost.name,
                        boost_price: boost.currency_value,
                        boost_image: boost.icon
                    })
            })
            .catch(rejectedValueOrSerializedError => {
                setLoading(false);
                // Alert.alert("Notice", "Operation could not be completed, please try again");
                logToAnalytics('boost_purchased_failed', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                })
                onClose()
                navigation.navigate("GameStoreItemsPurchaseFailed",
                    {
                        boost_name: boost.name,
                        boost_price: boost.currency_value,
                        boost_image: boost.icon
                    }
                )
            });
    }

    return (
        <View style={styles.buyBoost}>
            <View style={styles.buyItemHeader}>
                <Text style={styles.buyItemTitle}>Purchase {boost.name}</Text>
            </View>
            <View style={styles.buyItemCard}>
                <BoostCardDetails boost={boost} />
            </View>
            <WalletBalances depositBalance={depositBalance} user={user} minimumExhibitionStakeAmount={minimumExhibitionStakeAmount} setSelected={setSelected} boost={boost} />
            <AppButton text={loading ? 'Buying...' : 'Purchase Boost'} onPress={buyBoostWallet} disabled={!canPay || loading || selected === ''} style={styles.actionButton} />
        </View>
    )
}


const WalletBalances = ({ depositBalance, user, setSelected , boost}) => {
    const balanceAccounts = [
        {
            key: '1',
            value: `Deposit (NGN ${formatCurrency(depositBalance)})`,
            disabled: depositBalance < boost.currency_value,
        },
        {
            key: '2',
            value: `Bonus (NGN ${formatCurrency(user.bonusBalance)})`,
            disabled: true
        }
    ]
    const [balanceName, setBalanceName] = useState('')
    return (
        <View style={styles.balancesContainer}>
            <View style={styles.labelContainer}>
                <Text style={styles.balanceLabel}>Purchase boost from ?</Text>
                <Text style={styles.requiredText}>Required</Text>
            </View>
            <SelectList
                setSelected={(balanceName) => setBalanceName(balanceName)}
                data={balanceAccounts}
                save="value"
                onSelect={() => setSelected(balanceName)}
                placeholder="Select Wallet"
                fontFamily='sansation-regular'
                boxStyles={{ height: normalize(52), alignItems: 'center', borderColor: '#D9D9D9', backgroundColor: '#fff' }}
                inputStyles={{ fontSize: 18, color: '#072169' }}
                dropdownTextStyles={{ fontSize: 18, color: '#072169' }}
                dropdownItemStyles={{ borderBottomWidth: 1, borderBottomColor: '#D9D9D9' }}
                disabledTextStyles={{ fontSize: 18 }}
                disabledItemStyles={{ backgroundColor: '#F9FBFF' }}
            />
        </View>
    )
}

const styles = EStyleSheet.create({

    container: {
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(20),
        flex: 1
    },
    storeItems: {
        // marginTop: normalize(20),
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
        backgroundColor: '#FFF',
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
        fontFamily: 'gotham-bold',
        fontSize: '0.85rem',
        color: '#072169',
    },
    cardDescription: {
        fontFamily: 'gotham-medium',
        fontSize: '0.7rem',
        color: '#072169',
        lineHeight: responsiveScreenHeight(2),
        width: responsiveScreenWidth(38)
    },
    buyWithCash: {
        fontFamily: 'gotham-medium',
        fontSize: '0.63rem',
        color: '#F9FBFF',
    },
    buyBoost: {
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(15),
        backgroundColor: '#F9FBFF'
    },
    buyItemHeader: {
        alignItems: 'center'
    },
    buyItemTitle: {
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        color: '#072169',
        marginBottom: normalize(10),
    },
    actionButton: {
        paddingVertical: responsiveScreenHeight(2.3),
        marginTop: responsiveScreenHeight(5)
    },
    boostIcon: {
        width: '3.2rem',
        height: '3.2rem'
    },
    boostDetailsContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        // backgroundColor:'#fff'
    },
    boostNameCount: {
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    amountContainer: {
        backgroundColor: '#FA5F4A',
        borderRadius: 30,
        paddingHorizontal: '.3rem',
        paddingVertical: '.2rem'
    },
    number: {
        fontSize: '.85rem',
        color: '#fff',
        fontFamily: 'gotham-bold',
        textShadowColor: '#000000',
        textShadowRadius: 1,
        textShadowOffset: {
            width: 0.5,
            height: 0.5,
        },
        position: 'absolute',
        left: 35,
        top: 10
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
    balancesContainer: {
        marginBottom: '1rem'
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '.6rem'
    },
    requiredText: {
        fontFamily: 'sansation-regular',
        color: '#E15220',
        fontSize: '0.85rem',
    },
    balanceLabel: {
        fontFamily: 'gotham-bold',
        color: '#072169',
        fontSize: '0.85rem',

    },
});
