import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
// import currency from "../services/currency";
import { SafeAreaView } from 'react-native-safe-area-context';
import PageHeader from '../components/PageHeader';

export default function TransactionScreen({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <PageHeader title="Transactions" />
                <FundTransactions
                    naration="Fund Received"
                    amount="&#8358;2,000"
                    details="Card deposit"
                    date="20 Apr, 2021"
                    arrow={require('../../assets/images/up_arrow.png')}
                />
                <FundTransactions
                    naration="Fund Withdrawal"
                    amount="&#8358;2,000"
                    details="3 Answer wipe x2"
                    date="20 Apr, 2021"
                    arrow={require('../../assets/images/up_arrow.png')}
                />
                <FundTransactions
                    naration="Fund Received"
                    amount="&#8358;2,000"
                    details="Card deposit"
                    date="20 Apr, 2021"
                    arrow={require('../../assets/images/up_arrow.png')}
                />
                <FundTransactions
                    naration="Fund Received"
                    amount="&#8358;2,000"
                    details="Card deposit"
                    date="20 Apr, 2021"
                    arrow={require('../../assets/images/up_arrow.png')}
                />
            </ScrollView>
        </SafeAreaView>
    );
}

const FundTransactions = ({ naration, amount, details, date, arrow }) => {
    return (
        <View style={styles.transactionDetails}>
            <View style={styles.narationDetails}>
                <View style={styles.naration}>
                    <Image
                        source={arrow}
                    />
                    <Text style={styles.narationTitle}>{naration}</Text>
                </View>
                <Text style={styles.transactionAmountReceived}>{amount}</Text>
            </View>
            <View style={styles.typeAndDate}>
                <Text style={styles.transactionType}>{details}</Text>
                <Text style={styles.transactionType}>{date}</Text>
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
        color: '#219653'
    },
    narationTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        marginLeft: normalize(10),
        color: '#4F4F4F'
    },
    transactionType: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(12),
        color: '#C4C4C4'
    },
});
