import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable, Image, RefreshControl, ImageBackground, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Auth/AuthSlice';
import { formatCurrency } from '../../utils/stringUtl';
// import AppButton from '../../shared/AppButton';
// import { fetchUserTransactions } from '../CommonSlice';
import { useGetTransactionsQuery } from '../../services/wallets-api';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function WalletScreen() {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const [refreshing, setRefreshing] = useState(false);
    const [mainWalletActive, setMainWalletActive] = useState(true);
    const [winningsWalletActive, setWinningsWalletActive] = useState(false);
    const [bonusWalletActive, setBonusWalletActive] = useState(false);
    const depositBalance = Number.parseFloat(user.walletBalance) - Number.parseFloat(user.withdrawableBalance)



    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        dispatch(getUser());
        wait(2000).then(() => setRefreshing(false));
    }, []);


    const toggleMainWallet = () => {
        setBonusWalletActive(false);
        setWinningsWalletActive(false);
        setMainWalletActive(true);
    }

    const toggleWinningsWallet = () => {
        setBonusWalletActive(false);
        setMainWalletActive(false);
        setWinningsWalletActive(true);
    }

    const toggleBonusWallet = () => {
        setMainWalletActive(false);
        setWinningsWalletActive(false);
        setBonusWalletActive(true);
    }

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getUser());
        }, [])
    );



    return (
        <ScrollView style={styles.container}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#FFFF"
                />
            }
        >
            <WalletsButtton toggleBonusWallet={toggleBonusWallet} toggleMainWallet={toggleMainWallet}
                mainWalletActive={mainWalletActive} bonusWalletActive={bonusWalletActive} toggleWinningsWallet={toggleWinningsWallet}
                winningsWalletActive={winningsWalletActive} />
            <WalletBalanceDetails balance={depositBalance} bonusBalance={user.bonusBalance} bonusWalletActive={bonusWalletActive}
                mainWalletActive={mainWalletActive} winningsBalance={user.withdrawableBalance} winningsWalletActive={winningsWalletActive} />
            <TransactionsContainer
                mainWalletActive={mainWalletActive}
                bonusWalletActive={bonusWalletActive}
                winningsWalletActive={winningsWalletActive}

            />
        </ScrollView>
    );
}

const WalletsButtton = ({ toggleMainWallet, toggleBonusWallet, mainWalletActive, bonusWalletActive, toggleWinningsWallet, winningsWalletActive }) => {
    return (
        <View style={styles.walletsButtton}>
            <View style={styles.wallets}>
                <Pressable style={mainWalletActive ? styles.walletButton : styles.inactiveWalletButton} onPress={toggleMainWallet}>
                    <Text style={[styles.mainText, mainWalletActive ? styles.walletText : styles.inactiveWalletText]}>Deposits</Text>
                </Pressable>
                <Pressable style={winningsWalletActive ? styles.walletButton : styles.inactiveBonusWalletText} onPress={toggleWinningsWallet}>
                    <Text style={[styles.bonusText, winningsWalletActive ? styles.walletText : styles.inactiveWalletText]}>Winnings</Text>
                </Pressable>
                <Pressable style={bonusWalletActive ? styles.walletButton : styles.inactiveBonusWalletText} onPress={toggleBonusWallet}>
                    <Text style={[styles.bonusText, bonusWalletActive ? styles.walletText : styles.inactiveWalletText]}>Bonus</Text>
                </Pressable>
            </View>
        </View>
    )
}

const WalletBalanceDetails = ({ balance, bonusWalletActive, mainWalletActive, bonusBalance, winningsWalletActive, winningsBalance }) => {
    const navigation = useNavigation();

    const [hidden, setHidden] = useState(false);

    const toggleSecureText = () => {
        setHidden(!hidden);
    }
    return (
        <View style={styles.detailsContainer}>
            {mainWalletActive &&
                <View style={styles.fundingContainer}>
                    <View>
                        <View style={styles.totalHeader}>
                            <View style={styles.totalTitleContainer}>
                                <Text style={styles.totalTitleText}>Balance</Text>
                            </View>
                        </View>
                        <View style={styles.currencyHeader}>
                            <Text style={styles.currencyText}>NGN</Text>
                            <Text style={styles.currencyAmount}>{formatCurrency(balance)}</Text>
                        </View>
                    </View>
                    <Pressable style={styles.fundingButton} onPress={() => navigation.navigate('FundWallet')}>
                        <Text style={styles.fundingText}>Deposit</Text>
                        <Ionicons name="chevron-forward" size={22} color="#fff" />
                    </Pressable>
                </View>
            }
            {winningsWalletActive &&
                <View style={styles.fundingContainer}>
                    <View>
                        <View style={styles.totalHeader}>
                            <View style={styles.totalTitleContainer}>
                                <Text style={styles.totalTitleText}>Earned</Text>
                            </View>
                        </View>
                        <View style={styles.currencyHeader}>
                            <Text style={styles.currencyText}>NGN</Text>
                            <Text style={styles.currencyAmount}>{formatCurrency(winningsBalance)}</Text>
                        </View>
                    </View>
                    <Pressable style={styles.fundingButton} onPress={() => navigation.navigate('WithdrawBalance')}>
                        <Text style={styles.fundingText}>Withdraw</Text>
                        <Ionicons name="chevron-forward" size={22} color="#fff" />
                    </Pressable>
                </View>
            }
            {bonusWalletActive &&
                <View>
                    <View style={styles.totalHeader}>
                        <View style={styles.totalTitleContainer}>
                            <Text style={styles.totalTitleTexti}>Bonus</Text>
                        </View>
                    </View>
                    <View style={styles.currencyHeader}>
                        <Text style={styles.currencyText}>NGN</Text>
                        <Text style={styles.currencyAmount}>{formatCurrency(bonusBalance)}</Text>
                    </View>
                </View>
            }
        </View>
    )
}

const TransactionsContainer = ({ mainWalletActive, bonusWalletActive, winningsWalletActive }) => {
    const dispatch = useDispatch();
    const walletKey = getWalletTypeValue();
    const { data = [], isLoading } = useGetTransactionsQuery({ walletType: walletKey, pageNo: pageNumber });
    let transactions = data;
    const [pageNumber] = useState(1);

    function getWalletTypeValue() {
        if (mainWalletActive)
            return "CREDIT_BALANCE";
        else if (winningsWalletActive)
            return "WINNINGS_BALANCE";
        else if (bonusWalletActive)
            return "BONUS_BALANCE";
    }

    // const data = useSelector(state => state.common.userTransactions);
    // let transactions = data;
    // const [pageNumber] = useState(1);
    // const [isLoading, setIsLoading] = useState(true)

    // useEffect(() => {
    //     dispatch(fetchUserTransactions({ wallet_type: walletKey, pageNo: pageNumber })).then(() => setIsLoading(false));
    // },[pageNumber,walletKey])


    const [allTransactions, setAllTransactions] = useState(true);
    const [creditTransactions, setCreditTransactions] = useState(false);
    const [debitTransactions, setDebitTransactions] = useState(false);

    const toggleAllTransactions = () => {
        setCreditTransactions(false);
        setDebitTransactions(false);
        setAllTransactions(true);
    }

    const toggleCreditTransactions = () => {
        setAllTransactions(false);
        setDebitTransactions(false);
        setCreditTransactions(true);
    }


    const toggleDebitTransactions = () => {
        setAllTransactions(false);
        setCreditTransactions(false);
        setDebitTransactions(true);
    }

    const mainCreditTransactions = () => {
        if (mainWalletActive) {
            return transactions.filter(x => x.type.toUpperCase() === "CREDIT");
        }
        return transactions;
    }
    const mainDebitTransactions = () => {
        if (mainWalletActive) {
            return transactions.filter(x => x.type.toUpperCase() === "DEBIT");
        }
        return transactions;
    }
    const winningsCreditTransactions = () => {
        if (winningsWalletActive) {
            return transactions.filter(x => x.type.toUpperCase() === "CREDIT");
        }
        return transactions;
    }
    const winningsDebitTransactions = () => {
        if (winningsWalletActive) {
            return transactions.filter(x => x.type.toUpperCase() === "DEBIT");
        }
        return transactions;
    }
    const bonusCreditTransactions = () => {
        if (bonusWalletActive) {
            return transactions.filter(x => x.type.toUpperCase() === "CREDIT");
        }
        return transactions;
    }
    const bonusDebitTransactions = () => {
        if (bonusWalletActive) {
            return transactions.filter(x => x.type.toUpperCase() === "DEBIT");
        }
        return transactions;
    }

    return (

        <ScrollView style={styles.transactionsContainer}>
            <Text style={styles.transactionsHeader}>Transaction History</Text>
            <View style={styles.walletsButtton}>
                <View style={styles.wallets}>
                    <Pressable style={allTransactions ? styles.walletButton : styles.inactiveWalletButton} onPress={toggleAllTransactions}>
                        <Text style={[styles.mainText, allTransactions ? styles.walletText : styles.inactiveWalletTexta]}>All</Text>
                    </Pressable>
                    <Pressable style={creditTransactions ? styles.walletButton : styles.inactiveWalletButton} onPress={toggleCreditTransactions}>
                        <Text style={[styles.mainText, creditTransactions ? styles.walletText : styles.inactiveWalletTexti]}>Credit</Text>
                    </Pressable>
                    <Pressable style={debitTransactions ? styles.walletButton : styles.inactiveWalletButton} onPress={toggleDebitTransactions}>
                        <Text style={[styles.mainText, debitTransactions ? styles.walletText : styles.inactiveWalletTextd]}>Debit</Text>
                    </Pressable>
                </View>
            </View>
            {isLoading ?
                <ActivityIndicator size="large" color='#072169' />
                :
                <>

                    {mainWalletActive && allTransactions &&
                        <>
                            {
                                transactions.length > 0 ?
                                    <View style={styles.transactionsSubContainer}>
                                        {
                                            transactions.map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                            />)
                                        }

                                        {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} /> */}
                                    </View>
                                    :
                                    <View style={styles.noTransactionContainer}>
                                        <Text style={styles.noTransaction}>
                                            No transaction records
                                        </Text>
                                    </View>

                            }
                        </>
                    }
                    {mainWalletActive && creditTransactions &&
                        <>
                            {
                                mainCreditTransactions().length > 0 ?
                                    <View style={styles.transactionsSubContainer}>
                                        {
                                            mainCreditTransactions().map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                            />)
                                        }

                                        {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} /> */}
                                    </View>
                                    :
                                    <View style={styles.noTransactionContainer}>
                                        <Text style={styles.noTransaction}>
                                            No transaction records
                                        </Text>
                                    </View>

                            }
                        </>
                    }
                    {mainWalletActive && debitTransactions &&
                        <>
                            {
                                mainDebitTransactions().length > 0 ?
                                    <View style={styles.transactionsSubContainer}>
                                        {
                                            mainDebitTransactions().map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                            />)
                                        }

                                        {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} /> */}
                                    </View>
                                    :
                                    <View style={styles.noTransactionContainer}>
                                        <Text style={styles.noTransaction}>
                                            No transaction records
                                        </Text>
                                    </View>

                            }
                        </>
                    }

                    {winningsWalletActive && allTransactions &&
                        <>
                            {
                                transactions.length > 0 ?
                                    <View style={styles.transactionsSubContainer}>
                                        {
                                            transactions.map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                            />)
                                        }

                                        {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} /> */}
                                    </View>
                                    :
                                    <View style={styles.noTransactionContainer}>
                                        <Text style={styles.noTransaction}>
                                            No transaction records
                                        </Text>
                                    </View>

                            }
                        </>
                    }

                    {winningsWalletActive && creditTransactions &&
                        <>
                            {
                                winningsCreditTransactions().length > 0 ?
                                    <View style={styles.transactionsSubContainer}>
                                        {
                                            winningsCreditTransactions().map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                            />)
                                        }

                                        {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} /> */}
                                    </View>
                                    :
                                    <View style={styles.noTransactionContainer}>
                                        <Text style={styles.noTransaction}>
                                            No transaction records
                                        </Text>
                                    </View>

                            }
                        </>
                    }

                    {winningsWalletActive && debitTransactions &&
                        <>
                            {
                                winningsDebitTransactions().length > 0 ?
                                    <View style={styles.transactionsSubContainer}>
                                        {
                                            winningsDebitTransactions().map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                            />)
                                        }

                                        {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} /> */}
                                    </View>
                                    :
                                    <View style={styles.noTransactionContainer}>
                                        <Text style={styles.noTransaction}>
                                            No transaction records
                                        </Text>
                                    </View>

                            }
                        </>
                    }

                    {bonusWalletActive && allTransactions &&
                        <>
                            {
                                transactions.length > 0 ?
                                    <View style={styles.transactionsSubContainer}>
                                        {
                                            transactions.map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                            />)
                                        }

                                        {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} /> */}
                                    </View>
                                    :
                                    <View style={styles.noTransactionContainer}>
                                        <Text style={styles.noTransaction}>
                                            No transaction records
                                        </Text>
                                    </View>

                            }
                        </>
                    }
                    {bonusWalletActive && creditTransactions &&
                        <>
                            {
                                bonusCreditTransactions().length > 0 ?
                                    <View style={styles.transactionsSubContainer}>
                                        {
                                            bonusCreditTransactions().map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                            />)
                                        }

                                        {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} /> */}
                                    </View>
                                    :
                                    <View style={styles.noTransactionContainer}>
                                        <Text style={styles.noTransaction}>
                                            No transaction records
                                        </Text>
                                    </View>

                            }
                        </>
                    }
                    {bonusWalletActive && debitTransactions &&
                        <>
                            {
                                bonusDebitTransactions().length > 0 ?
                                    <View style={styles.transactionsSubContainer}>
                                        {
                                            bonusDebitTransactions().map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                            />)
                                        }
                                        {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} style={styles.appButton} onPress={() => navigation.navigate('Transactions')} /> */}
                                    </View>

                                    :
                                    <View style={styles.noTransactionContainer}>
                                        <Text style={styles.noTransaction}>
                                            No transaction records
                                        </Text>
                                    </View>

                            }
                        </>
                    }

                </>
            }

        </ScrollView>



    )
}

const FundTransactions = ({ transaction }) => {

    return (
        <View style={styles.transactionDetails}>
            <View style={styles.narationDetails}>
                <Ionicons name="ellipse" size={30} color={transaction.type === "DEBIT" ? '#EB2121' : '#00FFA3'} />
                <View style={styles.typeAndDate}>
                    <Text style={styles.transactionType}>{transaction.description}</Text>
                    <Text style={styles.transactionDate}>{transaction.transactionDate}</Text>
                </View>
            </View>
            <View>
                <View style={styles.amountDetails}>
                    {transaction.type === "DEBIT" ?
                        <Ionicons name="remove" size={22} color='#072169' style={{ fontFamily: 'gotham-medium' }} />
                        : <Ionicons name="add" size={22} color='#072169' style={{ fontFamily: 'gotham-medium' }} />
                    }
                    <Text style={styles.transactionAmount}>&#8358;{formatCurrency(transaction.amount)}</Text>
                </View>
                {/* <Text style={styles.transactionAmount}>{transaction.type}</Text> */}
            </View>
        </View>
    )

}


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingTop: '1.5rem',
        // paddingBottom: '1.5rem',

    },

    walletsButtton: {
        marginBottom: '1.5rem',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    wallets: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EFF2F6',
        borderRadius: 35,
        paddingVertical: '.3rem',
        paddingHorizontal: '.4rem'
    },
    walletButton: {
        backgroundColor: '#E15220',
        borderRadius: 35,
        paddingHorizontal: '.6rem',
        paddingVertical: '.4rem',
    },
    walletText: {
        color: '#fff',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
    },
    inactiveBonusWalletText: {
        color: '#535761',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        opacity: 0.5,
        marginLeft: '.5rem'
    },
    inactiveWalletText: {
        color: '#535761',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        opacity: 0.5,
        marginRight: '.5rem'
    },
    inactiveWalletTexti: {
        color: '#535761',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        opacity: 0.5,
        marginHorizontal: '.5rem'
    },
    inactiveWalletTextd: {
        color: '#535761',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        opacity: 0.5,
        marginLeft: '.5rem'
    },
    inactiveWalletTexta: {
        color: '#535761',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        opacity: 0.5,
        marginRight: '.5rem'
    },
    avatar: {
        width: '1.3rem',
        height: '1.3rem'
    },
    avatari: {
        width: '1.2rem',
        height: '1.2rem',
        marginRight: '.3rem'
    },
    bonusText: {
    },
    mainText: {
    },
    detailsContainer: {
        backgroundColor: '#fff',
        marginHorizontal: normalize(18),
        borderRadius: 13,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        paddingHorizontal: '1rem',
        paddingVertical: '1.2rem',
        marginBottom: '1.5rem',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.25,
    },
    totalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    totalTitleContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    totalTitleText: {
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '1rem',
    },
    totalTitleTexti: {
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '1rem',
        // marginLeft: '.2rem'
    },
    currencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '.5rem'
    },
    currencyText: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1.2rem',
        marginRight: '.5rem'
    },
    currencyAmount: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '1.2rem',
    },
    fundingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        // marginTop: '1rem'

    },
    fundingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: '.6rem',
        paddingVertical: '.4rem',
        backgroundColor: '#E15220'
    },
    fundingText: {
        color: '#FFF',
        fontFamily: 'gotham-medium',
        fontSize: '.85rem',
        // width:'5.7rem'
    },
    fundingTexti: {
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        // width: '8rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    transactionsContainer: {
        flex: 1,
        marginHorizontal: normalize(18),
        marginBottom: '3rem'
    },
    transactionsHeader: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1rem',
        textAlign: 'center',
        marginBottom: '1rem'
    },
    noTransaction: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '1.5rem',
        textAlign: 'center',
        marginTop: '8rem'
    },
    transactionDetails: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1.8rem'

    },
    transactionsSubContainer: {
        // flex:1
        // justifyContent: 'space-between',
        // marginBottom:'50rem'
    },
    narationDetails: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    typeAndDate: {
        marginLeft: '.5rem'
    },
    transactionType: {
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        width: '10.5rem',
        marginBottom: '.4rem'
    },
    transactionDate: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '.7rem',
        width: '10.5rem'
    },
    amountDetails: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    transactionAmount: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '.9rem',
        // width: '4rem',
    },

    walletTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: '#7C7D7F'
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },
    // appButton: {
    //     marginTop:'10rem'
    // },
});