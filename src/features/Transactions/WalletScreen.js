import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Pressable, Image, RefreshControl, ImageBackground, ActivityIndicator, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Auth/AuthSlice';
import { formatCurrency } from '../../utils/stringUtl';
import AppButton from '../../shared/AppButton';
import { fetchUserTransactions } from '../CommonSlice';


const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
}

export default function WalletScreen({ navigation }) {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const [refreshing, setRefreshing] = useState(false);
    const [loading, setLoading] = useState(true)
    const [mainWalletActive, setMainWalletActive] = useState(true);
    const transactions = useSelector(state => state.common.userTransactions);

    // console.log(transactions)
    const [bonusWalletActive, setBonusWalletActive] = useState(false);


    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        dispatch(getUser());
        dispatch(fetchUserTransactions())
        wait(2000).then(() => setRefreshing(false));
    }, []);


    const toggleMainWallet = () => {
        setBonusWalletActive(false);
        setMainWalletActive(true);
    }

    const toggleBonusWallet = () => {
        setMainWalletActive(false);
        setBonusWalletActive(true);
    }

    useEffect(() => {
        // setLoading(true)
        dispatch(fetchUserTransactions())
            .then(() => {
                console.log("fetching page ",)
                setLoading(false)
            })
    }, []);

    // const transactions = {
    //     bonusTransactions: [
    //         {
    //             "id": 1,
    //             "type": 'DEBIT',
    //             "amount": '500',
    //             "description": "Trivia challenge"
    //         },
    //         {
    //             "id": 2,
    //             "type": 'CREDIT',
    //             "amount": '700',
    //             "description": "Trivia challenge"
    //         }

    //     ],
    //     mainTransactions: [
    //         {
    //             "id": 1,
    //             "type": 'DEBIT',
    //             "amount": '200',
    //             "description": "Trivia challenge"
    //         },
    //         {
    //             "id": 2,
    //             "type": 'CREDIT',
    //             "amount": '800',
    //             "description": "Trivia challenge"
    //         }
    //     ]
    // }

    console.log(transactions)



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
                mainWalletActive={mainWalletActive} bonusWalletActive={bonusWalletActive} />
            <WalletBalanceDetails balance={user.walletBalance} bonusBalance={user.bonusBalance} bonusWalletActive={bonusWalletActive}
                mainWalletActive={mainWalletActive} />
            <TransactionsContainer
                loading={loading}
                transactions={transactions}
                mainWalletActive={mainWalletActive}
                bonusWalletActive={bonusWalletActive}

            />
        </ScrollView>
    );
}

const WalletsButtton = ({ toggleMainWallet, toggleBonusWallet, mainWalletActive, bonusWalletActive }) => {
    return (
        <View style={styles.walletsButtton}>
            <View style={styles.wallets}>
                <Pressable style={mainWalletActive ? styles.walletButton : styles.inactiveWalletButton} onPress={toggleMainWallet}>
                    <Text style={[styles.mainText, mainWalletActive ? styles.walletText : styles.inactiveWalletText]}>Main wallet</Text>
                </Pressable>
                <Pressable style={bonusWalletActive ? styles.walletButton : styles.inactiveBonusWalletText} onPress={toggleBonusWallet}>
                    <Text style={[styles.bonusText, bonusWalletActive ? styles.walletText : styles.inactiveWalletText]}>Bonus wallet</Text>
                </Pressable>
            </View>
        </View>
    )
}

const WalletBalanceDetails = ({ balance, bonusWalletActive, mainWalletActive, bonusBalance }) => {
    const navigation = useNavigation();

    const [hidden, setHidden] = useState(false);

    const toggleSecureText = () => {
        setHidden(!hidden);
    }
    return (
        <View style={styles.detailsContainer}>
            {mainWalletActive &&
                <View>
                    <View style={styles.totalHeader}>
                        <View style={styles.totalTitleContainer}>
                            <Image
                                source={require('../../../assets/images/wallet-with-cash.png')}
                                style={styles.avatar}
                            />
                            <Text style={styles.totalTitleText}>Total balance</Text>
                        </View>
                        <Ionicons name={hidden ? 'eye-off-outline' : "eye-outline"} size={22} color="#072169" onPress={toggleSecureText} />
                    </View>
                    <View style={styles.currencyHeader}>
                        <Text style={styles.currencyText}>NGN</Text>
                        {hidden ?
                            <Text style={styles.currencyAmount}>***</Text>
                            :
                            <Text style={styles.currencyAmount}>{formatCurrency(balance)}</Text>
                        }
                    </View>
                    <View style={styles.fundingContainer}>
                        <Pressable style={styles.fundingButton} onPress={() => navigation.navigate('FundWallet')}>
                            <Image
                                source={require('../../../assets/images/cash.png')}
                                style={styles.avatari}
                            />
                            <Text style={styles.fundingText}>Deposit</Text>

                        </Pressable>
                        <Pressable style={styles.fundingButton} onPress={() => navigation.navigate('WithdrawBalance')}>
                            <Image
                                source={require('../../../assets/images/cost-benefit.png')}
                                style={styles.avatari}
                            />
                            <Text style={styles.fundingTexti}>Cash withdrawal</Text>

                        </Pressable>
                    </View>
                </View>
            }
            {bonusWalletActive &&
                <View>
                    <View style={styles.totalHeader}>
                        <View style={styles.totalTitleContainer}>
                            <Image
                                source={require('../../../assets/images/sale.png')}
                                style={styles.avatari}
                            />
                            <Text style={styles.totalTitleTexti}>Bonus balance</Text>
                        </View>
                        <Ionicons name={hidden ? 'eye-off-outline' : "eye-outline"} size={22} color="#072169" onPress={toggleSecureText} />
                    </View>
                    <View style={styles.currencyHeader}>
                        <Text style={styles.currencyText}>NGN</Text>
                        {hidden ?
                            <Text style={styles.currencyAmount}>***</Text>
                            :
                            <Text style={styles.currencyAmount}>{formatCurrency(bonusBalance)}</Text>
                        }
                    </View>
                </View>
            }
        </View>
    )
}

const TransactionsContainer = ({ transactions, loading, mainWalletActive, bonusWalletActive }) => {
    const navigation = useNavigation();
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
            return transactions.mainTransactions.filter(x => x.type.toUpperCase() !== "DEBIT");
        }
        return transactions.mainTransactions;
    }
    const mainDebitTransactions = () => {
        if (mainWalletActive) {
            return transactions.mainTransactions.filter(x => x.type.toUpperCase() !== "CREDIT");
        }
        return transactions.mainTransactions;
    }
    const bonusCreditTransactions = () => {
        if (bonusWalletActive) {
            return transactions.bonusTransactions.filter(x => x.type.toUpperCase() !== "DEBIT");
        }
        return transactions.bonusTransactions;
    }
    const bonusDebitTransactions = () => {
        if (bonusWalletActive) {
            return transactions.bonusTransactions.filter(x => x.type.toUpperCase() !== "CREDIT");
        }
        return transactions.bonusTransactions;
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
                {loading ?
                    <ActivityIndicator size="large" color='#072169' />
                    :
                    <>
                        <ImageBackground source={transactions.mainTransactions.length > 0 || transactions.bonusTransactions.length > 0 ? require('../../../assets/images/coins-background.png') : require('../../../assets/images/qr-code.png')}
                        style={{ flex: 1 }}

                        resizeMethod="resize">

                        {mainWalletActive && allTransactions &&
                            <>
                                {
                                    transactions.mainTransactions.length > 0 ?
                                        <View style={styles.transactionsSubContainer}>
                                            {
                                                transactions.mainTransactions.map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                                />)
                                            }

                                            <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} />
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

                                            <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} />
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

                                            <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} />
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
                                    transactions.bonusTransactions.length > 0 ?
                                        <View style={styles.transactionsSubContainer}>
                                            {
                                                transactions.bonusTransactions.map((transaction, i) => <FundTransactions key={i} transaction={transaction}
                                                />)
                                            }

                                            <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} />
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

                                            <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={() => navigation.navigate('Transactions')} />
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
                                            <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} style={styles.appButton} onPress={() => navigation.navigate('Transactions')} />
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
                                        </ImageBackground>

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
                    {/* <Text style={styles.transactionDate}>{transaction.transactionDate}</Text> */}
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
        width: '1.2rem',
        height: '2.2rem'
    },
    avatari: {
        width: '1rem',
        height: '2rem',
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
        paddingHorizontal: '1.3rem',
        paddingVertical: '.8rem',
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
        color: '#072169',
        fontFamily: 'gotham-medium',
        fontSize: '1rem',
        marginLeft: '.5rem'
    },
    totalTitleTexti: {
        color: '#072169',
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
        color: '#072169',
        fontFamily: 'gotham-bold',
        fontSize: '1.2rem',
        marginRight: '.5rem'
    },
    currencyAmount: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '1.2rem',
    },
    fundingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: '1rem'

    },
    fundingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 13,
        borderWidth: 2,
        borderColor: '#072169',
        paddingHorizontal: '.5rem'
    },
    fundingText: {
        color: '#072169',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        // width:'5.7rem'
    },
    fundingTexti: {
        color: '#072169',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        width: '8rem',
        justifyContent: 'center',
        alignItems: 'center'
    },
    transactionsContainer: {
        flex: 1,
        marginHorizontal: normalize(18),
        marginBottom: '3rem'
    },
    transactionsHeader: {
        color: '#072169',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        textAlign: 'center',
        marginBottom: '1rem'
    },
    noTransaction: {
        color: '#072169',
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
        color: '#072169',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        width: '10.5rem',
        marginBottom: '.4rem'
    },
    transactionDate: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '.7rem',
        width: '10.5rem'
    },
    amountDetails: {
        flexDirection: 'row',
        alignItems: 'flex-start'
    },
    transactionAmount: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '.9rem',
        width: '4rem',
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
