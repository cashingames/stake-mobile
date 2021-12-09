import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import normalize from '../../utils/normalize';
// import currency from "../services/currency";
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { getUser } from '../Auth/AuthSlice';
import PageHeader from '../../shared/PageHeader';

export default function TransactionScreen({ navigation }) {
    const dispatch = useDispatch();
    const transactions = useSelector(state => state.auth.user.transactions)
    useEffect(() => {
        dispatch(getUser('v3/user/profile'));
        // console.log(JSON.stringify(user.transactions) + 'madam');
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                {transactions && (
                    <View>
                        {transactions.map((x, i) => <FundTransactions key={i} transaction={x} />)}
                        {transactions.length === 0 && <Text>No recent transactions</Text>}
                    </View>
                )}
            </ScrollView>
        </SafeAreaView>
    );
}

const FundTransactions = ({ transaction}) => {
    return (
        <View style={styles.transactionDetails}>
            <View style={styles.narationDetails}>
                <View style={styles.naration}>
                    {/* <Image
                        source={arrow}
                    /> */}
                    <Text style={styles.narationTitle}>{transaction.type}</Text>
                </View>
                <Text style={transaction.type === "DEBIT" ? styles.transactionAmountWithdraw : styles.transactionAmountReceived}>{transaction.amount}</Text>
            </View>
            <View style={styles.typeAndDate}>
                <Text style={styles.transactionType}>{transaction.description}</Text>
                <Text style={styles.transactionType}>{transaction.transactionDate}</Text>
            </View>
        </View>
    )
                }


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    transactionDetails: {
        display: 'flex',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(20),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
    },
    narationDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    naration: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    typeAndDate: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(7),
    },
    transactionAmountReceived: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(14),
        color: '#219653'
    },
    transactionAmountWithdraw: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(14),
        color: '#EB5757'
    },
    narationTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#4F4F4F'
    },
    transactionType: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(10),
        color: '#C4C4C4'
    },
});
