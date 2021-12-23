import React, { useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';

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
        <ScrollView>
            <View style={styles.container}>
                <WalletBalance balance={user.walletBalance} />
                <FundButton />
                <UserEarnings point={user.points} />
                <TransactionLink /></View>
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
        <TouchableOpacity onPress={() => navigation.navigate('Transactions')}>
            <View style={styles.link}>
                <Text style={styles.linkTitle}>See Transactions</Text>
                <Ionicons name="md-arrow-forward-sharp" size={24} color="#EF2F55" />
            </View>
        </TouchableOpacity>
    )
};


const styles = StyleSheet.create({
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
        borderBottomWidth: normalize(1),
        paddingVertical: normalize(20),
        backgroundColor: '#fff',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(32),
        marginHorizontal: normalize(18),
        borderRadius: 12,
        elevation: 3,
    },
    fundButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#FFFF'
    },
    earnings: {
        backgroundColor: '#fff',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(15),
        marginHorizontal: normalize(18),
        marginVertical: normalize(18),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    earningText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: 'rgba(0, 0, 0, 0.5)'
    },
    earningAmount: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(22),
        color: 'black'
    },
    earningContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    earningLink: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
    },
    link: {
        backgroundColor: '#E5E5E5',
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(15),
        marginHorizontal: normalize(18),
        marginVertical: normalize(5),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    linkTitle: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
    }
});
