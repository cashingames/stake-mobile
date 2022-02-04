import React, { useEffect } from 'react';
import { Text, View, ScrollView, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';
import AppButton from "../../shared/AppButton";
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Auth/AuthSlice';
import WalletBalance from './WalletBalance';
import { formatNumber } from '../../utils/stringUtl';

export default function WalletScreen({ navigation }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    useEffect(() => {
        dispatch(getUser());
    }, []);

    return (
        <ScrollView style={styles.container}>
            <WalletBalance balance={user.walletBalance} />
            <FundButton />
            <UserEarnings point={user.points} />
            <TransactionLink />
        </ScrollView>
    );
}

const FundButton = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.buttonContainer}>
            <Pressable
                onPress={() => navigation.navigate('FundWallet')}
                style={() => [
                    {
                        backgroundColor:
                            '#EF2F55'
                    },
                    styles.button
                ]}
            >
                <Text style={styles.fundButton}>Fund Wallet</Text>
            </Pressable>
        </View>
    )
};

const UserEarnings = ({ point }) => {
    return (
        <View style={styles.earnings}>
            <Text style={styles.earningText}>Your available point balance</Text>
            <View style={styles.earningContainer}>
                <Text style={styles.earningAmount}>{formatNumber(point)} pts</Text>
            </View>
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


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5FF'
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
        borderBottomWidth: normalize(3),
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
        marginVertical: 30,

    },
    fundButton: {
        // lineHeight: '1rem',
        letterSpacing: 0.25,
        color: 'white',
        fontFamily: 'graphik-medium',
        fontSize: '0.85rem'
    },
    earnings: {
        backgroundColor: '#fff',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(15),
        marginHorizontal: normalize(18),
        marginVertical: normalize(18),
        borderRadius: 8,
        borderWidth: normalize(3),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    earningText: {
        fontFamily: 'graphik-medium',
        fontSize: '0.65rem',
        color: 'rgba(0, 0, 0, 0.5)'
    },
    earningAmount: {
        fontFamily: 'graphik-medium',
        fontSize: '1.6rem',
        color: 'black'
    },
    link: {
        backgroundColor: '#E5E5E5',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(15),
        marginHorizontal: normalize(18),
        marginVertical: normalize(5),
        borderRadius: 8,
        borderWidth: normalize(3),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    linkTitle: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
    }
});
