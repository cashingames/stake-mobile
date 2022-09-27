import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, Pressable, ImageBackground, Dimensions, Alert, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Auth/AuthSlice';
import WalletBalance from './WalletBalance';
import { formatCurrency, formatNumber } from '../../utils/stringUtl';
import AppButton from '../../shared/AppButton';
import analytics from '@react-native-firebase/analytics';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import { unwrapResult } from '@reduxjs/toolkit';
import { withdrawWinnings } from '../CommonSlice';


export default function WalletScreen() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const [withdraw, setWithdraw] = useState(false)

    const refRBSheet = useRef();

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        dispatch(getUser());
        refRBSheet.current.close()
    }
    useEffect(() => {
        dispatch(getUser());
    }, []);

    const withdrawBalance = () => {
        setWithdraw(true)
        withdrawWinnings()
            .then(async response => {
                await analytics().logEvent('winnings_withdrawn_successfully', {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                });
                openBottomSheet();
                setWithdraw(false)
                dispatch(getUser())
            },
                err => {
                    if (!err || !err.response || err.response === undefined) {
                        Alert.alert("Your Network is Offline.");
                        setWithdraw(false)
                    }
                    else if (err.response.status === 400) {
                        Alert.alert(err.response.data.message);
                        setWithdraw(false)

                    }
                }

            )
    }

    return (
        <ImageBackground source={require('../../../assets/images/vector-coin-background.jpg')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
            <ScrollView style={styles.container}>
                <WalletBalance balance={user.walletBalance} />
                <WithdrawableWalletBalance
                    withdrawableBalance={user.withdrawableBalance}
                    bookBalance={user.bookBalance}
                    onPress={withdrawBalance}
                    withdraw={withdraw}
                />
                {/* <UserEarnings point={user.points} /> */}
                <TransactionLink />
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={300}
                    subComponent={<WithdrawnBalance onClose={closeBottomSheet}
                    />}
                />
            </ScrollView>
        </ImageBackground>
    );
}


const UserEarnings = ({ point }) => {
    return (
        <View style={styles.earnings}>
            <Text style={styles.earningText}>Your available point balance</Text>
            <Text style={styles.earningAmount}>{formatNumber(point)} pts</Text>
        </View>
    )
};

const TransactionLink = () => {
    const navigation = useNavigation();
    return (
        <Pressable onPress={() => navigation.navigate('Transactions')} style={styles.link}>
            <Text style={styles.linkTitle}>See Transactions</Text>
            <Ionicons name="md-arrow-forward-sharp" size={24} color="#EF2F55" />
        </Pressable>
    )
};

const WithdrawableWalletBalance = ({ withdrawableBalance, bookBalance, onPress, withdraw }) => {
    const features = useSelector(state => state.common.featureFlags);

    const isWithdrawFeatureEnabled = features['withdrawable_wallet'] !== undefined && features['withdrawable_wallet'].enabled == true;

    if (!isWithdrawFeatureEnabled) {
        return null;
    }
    return (
        <View style={styles.earningsContainer}>
            <View style={styles.earnings}>
                <Text style={styles.earningText}>Withdrawable Balance</Text>
                <Text style={styles.earningAmount}>&#8358;{formatCurrency(withdrawableBalance)}</Text>
                <AppButton text="Withdraw" textStyle={styles.fundButton}
                    style={styles.button} onPress={onPress}
                    disabled={withdraw}
                />
            </View>
            <View style={styles.earnings}>
                <Text style={styles.earningText}>Pending Winnings</Text>
                <Text style={styles.earningAmount}>&#8358;{formatCurrency(bookBalance)}</Text>
                <Text style={styles.earningNote}>Note: Your pending winnings becomes withdrawable after 24hours</Text>

            </View>
        </View>
    )
}

const WithdrawnBalance = ({ onClose, withdrawableBalance }) => {
    return (
        <View style={styles.withdrawn}>
            <Image style={styles.emoji}
                source={require('../../../assets/images/thumbs_up.png')}

            />
            <Text style={styles.withdrawSuccessText}>Congratulations,</Text>
            <Text style={styles.withdrawSuccessText}>Your withdrawal request is being processed to your bank account
            </Text>
        </View>
    )
}


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: '#F2F5FF',
        paddingTop: '3rem',
    },

    walletTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: '#7C7D7F'
    },
    availableAmount: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(30),
        color: '#333333'
    },
    buttonContainer: {
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3),
        paddingBottom: normalize(10),
        backgroundColor: '#fff',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(15),
        paddingHorizontal: normalize(28),
        marginHorizontal: normalize(18),
        borderRadius: 12,
        elevation: 3,
        marginVertical: 10,

    },
    fundButton: {
        // lineHeight: '1rem',
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'graphik-medium',
        fontSize: '0.85rem'
    },
    earnings: {
        backgroundColor: '#000059',
        opacity: 0.8,
        paddingVertical: Platform.OS === 'ios' ? normalize(15) : normalize(12),
        marginHorizontal: normalize(18),
        marginBottom: normalize(18),
        borderRadius: 8,
        borderWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    earningsContainer: {
        backgroundColor: 'rgba(239, 47, 85, 0.86)',
        paddingTop: Platform.OS === 'ios' ? normalize(15) : normalize(18),
        paddingHorizontal: normalize(10),
        marginHorizontal: normalize(30),
        marginBottom: normalize(18),
        marginTop: responsiveScreenWidth(5),
        borderRadius: 8,
        borderWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    earningText: {
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
        color: '#7C7D7F',
        textAlign: 'center'
    },
    earningNote: {
        fontFamily: 'graphik-regular',
        fontSize: '0.7rem',
        color: '#FFFF',
        textAlign: 'center',
        opacity: 0.8,
        marginTop: normalize(15),
        lineHeight:'1rem'
    },
    earningAmount: {
        fontFamily: 'graphik-medium',
        fontSize: '1.4rem',
        color: '#FFFF',
        textAlign: 'center',
        marginVertical: normalize(5),
    },
    link: {
        backgroundColor: '#FFE900',
        opacity: 0.8,
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(15),
        marginHorizontal: normalize(30),
        marginBottom: '8rem',
        borderRadius: 8,
        borderWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    linkTitle: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
    },
    withdrawn: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
    },
    emoji: {
        width: normalize(80),
        height: normalize(80),
        marginBottom: normalize(20)
    },
    withdrawSuccessText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        // width: normalize(130),
        textAlign: 'center',
        color: '#000',
        lineHeight: normalize(24)
    },
});
