import React, { useEffect } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Auth/AuthSlice';
import normalize, {responsiveScreenWidth} from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';

export default function TransactionScreen({ navigation }) {

    const dispatch = useDispatch();
    const transactions = useSelector(state => state.auth.user.transactions);

    useEffect(() => {
        dispatch(getUser());
    }, []);

    return (
        <ScrollView style={styles.container}>
            {transactions && (
                transactions.map((x, i) => <FundTransactions key={i} transaction={x} />)
            )}
        </ScrollView>
    );

}

const FundTransactions = ({ transaction }) => {

    return (
        <View style={styles.transactionDetails}>
            <View style={styles.narationDetails}>
                <View style={styles.naration}>
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


const styles = EStyleSheet.create({
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
    narationTitle: {
        fontFamily: 'graphik-medium',
        fontSize: '0.75rem',
        color: '#4F4F4F'
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
        fontSize: '0.8rem',
        color: '#219653'
    },
    transactionAmountWithdraw: {
        fontFamily: 'graphik-bold',
        fontSize: '0.8rem',
        color: '#EB5757'
    },
    transactionType: {
        fontFamily: 'graphik-regular',
        fontSize:'0.6rem',
        color: '#C4C4C4'
    },
});
