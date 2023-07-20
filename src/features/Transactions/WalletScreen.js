import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import normalize from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TransactionsList from './TransactionsList';
import WalletBalance from './WalletBalance';
import { useGetTransactionsQuery } from '../../services/wallets-api';


const Tab = createMaterialTopTabNavigator();

export default function WalletScreen() {
    //@TODO make deposit button a reusable button and inject instead of action
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);
    const depositBalance = Number.parseFloat(user.walletBalance) - Number.parseFloat(user.withdrawableBalance);
    const winningsBalance = user.withdrawableBalance;
    const bonusBalance = user.bonusBalance;

    const { data = [], isLoading } = useGetTransactionsQuery('CREDIT_BALANCE', 1);
    const { data: dataBonus = [], isLoading: isLoading1 } = useGetTransactionsQuery('BONUS_BALANCE', 1);
    const { data: dataWinnings = [], isLoading: isLoading2 } = useGetTransactionsQuery('WINNINGS_BALANCE', 1);


    function transformData(item) {
        return {
            id: item.transactionId,
            description: item.description,
            type: item.type,
            amount: item.amount,
            transactionDate: item.transactionDate
        }
    }
    const transactionsWinning = dataWinnings.map(transformData);
    const transactionsBonus = dataBonus.map(transformData);
    const transactionsDeposit = data.map(transformData);


    if (isLoading || isLoading1 || isLoading2)
        return <ActivityIndicator size="large" color='#072169' />

    return (
        <View style={styles.container}>
            <Tab.Navigator
                screenOptions={{
                    tabBarLabelStyle: { fontSize: 18, fontFamily: 'gotham-medium', textTransform: 'capitalize' },
                    tabBarActiveTintColor: '#FFF',
                    tabBarInactiveTintColor: '#1C453B',
                    tabBarStyle: { backgroundColor: '#EFF2F6', borderRadius: 35, marginHorizontal: 35, marginVertical: 20 },
                }}>
                <Tab.Screen name="Deposits">
                    {(props) => <WalletDetails {...props} walletInfo={{
                        title: "Balance",
                        value: depositBalance,
                        action: {
                            text: "Deposit", clicked: () => {
                                navigation.navigate('FundWallet')
                            }
                        },
                        transactions: transactionsDeposit
                    }} />}
                </Tab.Screen>
                <Tab.Screen name="Winnings">
                    {(props) => <WalletDetails {...props} walletInfo={{
                        title: "Earned",
                        value: winningsBalance,
                        action: {
                            text: "Withdraw", clicked: () => {
                                navigation.navigate('WithdrawBalance')
                            }
                        },
                        transactions: transactionsWinning
                    }} />
                    }
                </Tab.Screen>
                <Tab.Screen name="Bonus">
                    {(props) =>
                        <WalletDetails {...props} walletInfo={{
                            title: "Bonus",
                            value: bonusBalance,
                            transactions: transactionsBonus
                        }} />
                    }

                </Tab.Screen>
            </Tab.Navigator>
        </View>
    );
}


function WalletDetails({ walletInfo }) {
    return (
        <View style={{ flex: 1, backgroundColor: '#F9FBFF' }}>
            <WalletBalance {...walletInfo} />
            <Text style={styles.transactionsHeader}>Transaction History</Text>
            <TransactionsList transactions={walletInfo.transactions} />
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingVertical: normalize(15)

    },
    transactionsHeader: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        textAlign: 'center',
        marginBottom: '1rem'
    },
});
