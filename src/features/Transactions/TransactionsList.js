import React, { useState } from 'react';
import { Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from "../../utils/normalize";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../../utils/stringUtl";


export default function ({ }) {
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

    return (
        <>
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
        <ListComponent />
        </>
    );
}

function ListComponent({ extraData, route }) {
    const { transactions, filter, viewMoreClicked } = extraData;
    const data = useSelector(state => state.common.userTransactions);

    if (data.length == 0)
        return (
            <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyState}>No transaction records</Text>
            </View>
        )

    return (
        <ScrollView style={styles.items}>
            {
                data.map(item => <RenderItem key={item.id} item={item} />)
            }
            {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={viewMoreClicked} /> */}
        </ScrollView>
    )
}

function RenderItem({ item }) {
    return (

        <View style={styles.transactionDetails}>
            <View style={styles.narationDetails}>
                <Ionicons name="ellipse" size={30} color={item.type === "DEBIT" ? '#EB2121' : '#00FFA3'} />
                <View style={styles.typeAndDate}>
                    <Text style={styles.transactionType}>{item.description}</Text>
                    <Text style={styles.transactionDate}>{item.transactionDate}</Text>
                </View>
            </View>
            <View>
                <View style={styles.amountDetails}>
                    {item.type === "DEBIT" ?
                        <Ionicons name="remove" size={22} color='#072169' style={{ fontFamily: 'gotham-medium' }} />
                        : <Ionicons name="add" size={22} color='#072169' style={{ fontFamily: 'gotham-medium' }} />
                    }
                    <Text style={styles.transactionAmount}>&#8358;{formatCurrency(item.amount)}</Text>
                </View>
            </View>
        </View>
    )
}


const styles = EStyleSheet.create({
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
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#F9FBFF',
        // paddingHorizontal: normalize(22),
        paddingVertical: normalize(15)

    },
    emptyStateContainer: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyState: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '1.5rem'
    },
    items: {
        backgroundColor: '#F9FBFF',
        flex: 1,
        // paddingHorizontal: 22,
        paddingVertical: 30
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
    transactionDetails: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1.8rem'
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
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },
    tabBarStyle: {
        borderRadius: 35,
        marginBottom: '1.3rem',
        marginTop: 0,
        backgroundColor: '#EFF2F6',
        marginHorizontal: '2.8rem'
    },
    tabBarLabel: {
        fontSize: '0.75rem',
        fontFamily: 'gotham-bold',
        textTransform: 'capitalize'
    }
})