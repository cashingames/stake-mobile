import React, { useEffect } from 'react';
import { Text, View, ScrollView, Pressable, ImageBackground, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Auth/AuthSlice';
import WalletBalance from './WalletBalance';
import { formatCurrency, formatNumber } from '../../utils/stringUtl';
import AppButton from '../../shared/AppButton';

export default function WalletScreen() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    useEffect(() => {
        dispatch(getUser());
    }, []);

    return (
        <ImageBackground source={require('../../../assets/images/vector-coin-background.jpg')}
            style={{ width: Dimensions.get("screen").width, height: Dimensions.get("screen").height }}
            resizeMethod="resize">
            <ScrollView style={styles.container}>
                <WalletBalance balance={user.walletBalance} />
                <WithdrawableWalletBalance
                    withdrawableBalance={user.withdrawableBalance}
                    bookBalance={user.bookBalance}
                />
                {/* <UserEarnings point={user.points} /> */}
                <TransactionLink />
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

const WithdrawableWalletBalance = ({ withdrawableBalance, bookBalance }) => {
    return (
        <View style={styles.earningsContainer}>
            <View style={styles.earnings}>
                <Text style={styles.earningText}>Withdrawable Balance</Text>
                <Text style={styles.earningAmount}>&#8358;{formatCurrency(withdrawableBalance)}</Text>
                <AppButton text="Withdraw" textStyle={styles.fundButton} style={styles.button}/>
            </View>
            <View style={styles.earnings}>
                <Text style={styles.earningText}>Pending Winnings</Text>
                <Text style={styles.earningAmount}>&#8358;{formatCurrency(bookBalance)}</Text>
            </View>
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
        opacity:0.8,
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
        textAlign:'center'
    },
    earningAmount: {
        fontFamily: 'graphik-medium',
        fontSize: '1.4rem',
        color: '#FFFF',
        textAlign:'center',
        // marginVertical: Platform.OS === 'ios' ? normalize(8) : normalize(5),
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
    }
});
