import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import normalize, { s } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { ActivityIndicator, Alert, Text, View } from 'react-native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import TransactionsList from './TransactionsList';
import WalletBalance from './WalletBalance';
import { useGetTransactionsQuery } from '../../services/wallets-api';
import TabBarTab from './TabBarTab';


const Tab = createMaterialTopTabNavigator();

export default function WalletScreen() {
    //@TODO make deposit button a reusable button and inject instead of action
    const navigation = useNavigation();
    const user = useSelector(state => state.auth.user);
    const depositBalance = Number.parseFloat(user.walletBalance) - Number.parseFloat(user.withdrawableBalance);
    const winningsBalance = user.withdrawableBalance;
    const bonusBalance = user.bonusBalance;

    return (
        <View style={styles.container}>
            <Tab.Navigator
                tabBar={props => <TabBarTab {...props} />}
                screenOptions={{
                    tabBarLabelStyle: styles.tabBarLabel,
                    activeTabBarLabelContainerStyle: { backgroundColor: '#E15220', borderRadius: 20, },
                    tabBarLabelContainerStyle: { paddingHorizontal: 10, paddingVertical: 5, },
                    tabBarIndicatorStyle: { backgroundColor: 'transparent' },
                    tabBarInactiveTintColor: '#1C453B',
                    tabBarActiveTintColor: '#FFF',
                    tabBarStyle: styles.tabBarStyle,
                    tabBarGap: 0
                }}>
                <Tab.Screen 
                    name="Deposits"
                    listeners={{
                        tabPress: (e) => {
                        //   fetchData("CREDIT_BALANCE")
                        //   e.preventDefault();
                        },
                      }}
                >
                    {(props) => <WalletDetails {...props} walletInfo={{
                        title: "Balance",
                        value: depositBalance,
                        action: {
                            text: "Deposit", clicked: () => {
                                navigation.navigate('FundWallet')
                            }
                        },
                        // transactions: transactionsDeposit
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
                        // transactions: transactionsWinning
                    }} />
                    }
                </Tab.Screen>
                <Tab.Screen name="Bonus">
                    {(props) =>
                        <WalletDetails {...props} walletInfo={{
                            title: "Bonus",
                            value: bonusBalance,
                            // transactions: transactionsBonus
                        }} />
                    }

                </Tab.Screen>
            </Tab.Navigator>
        </View>
    );
}

function transformData(item) {
    return {
        id: item.transactionId,
        description: item.description,
        type: item.type,
        amount: item.amount,
        transactionDate: item.transactionDate
    }
}

function WalletDetails({ route, walletInfo }) {

    const walletKey = getWalletTypeValue(route.name);
    const [pageNo, setPageNo] = useState(1);
    const { data = [], isLoading } = useGetTransactionsQuery({ walletType: walletKey, pageNo: pageNo });

    let transactions = data.map(transformData);

    const fetchMoreTransactions = () => {
        setPageNo((prev) => prev + 1);
    }

    if (isLoading)
        return <ActivityIndicator size="large" color='#072169' />

    return (
        <View style={{ flex: 1, backgroundColor: '#F9FBFF' }}>
            <WalletBalance {...walletInfo} />
            <Text style={styles.transactionsHeader}>Transaction History</Text>
            <TransactionsList transactions={transactions} onFetchMore={fetchMoreTransactions} />
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingHorizontal: '0.8rem',
        paddingVertical: '1.3rem',
    },
    transactionsHeader: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        textAlign: 'center',
        marginBottom: '0.5rem',
        marginTop: '0.5rem'
    },
    tabBarStyle: {
        borderRadius: 35,
        marginBottom: '1.3rem',
        marginTop: 0,
        backgroundColor: '#EFF2F6',
        marginHorizontal: '1.3rem'
    },
    tabBarLabel: {
        fontSize: '0.75rem', 
        fontFamily: 'gotham-bold', 
        textTransform: 'capitalize'
    }
});

function getWalletTypeValue (tabName) {
    if(tabName == "Deposits")
        return "CREDIT_BALANCE";
    else if(tabName == "Winnings")
        return "WINNINGS_BALANCE";
    else if(tabName == "Bonus")
        return "BONUS_BALANCE";
}
