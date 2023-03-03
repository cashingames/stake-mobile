import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView, Image, FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { formatCurrency, isTrue } from '../../utils/stringUtl';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import PageLoading from '../../shared/PageLoading';
import { fetchUserTransactions } from '../CommonSlice';

export default function TransactionScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true)
    const [loadingMore, setLoadingMore] = useState(false)
    const transactions = useSelector(state => state.common.userTransactions);
    const [pageNumber, setPageNumber] = useState()

    const loadMoreTransactions = useSelector(state => state.common.loadMoreTransactions);

    useEffect(() => {
        setPageNumber(getPageNo());
    }, [])

    useEffect(() => {
        if (!pageNumber) {
            return;
        }
        if (!loadMoreTransactions) {
            setLoadingMore(false)
            setLoading(false)
            return;
        }

        setLoadingMore(true)
        dispatch(fetchUserTransactions(pageNumber))
            .then(() => {
                console.log("fetching page ", pageNumber)
                setLoading(false)
                setLoadingMore(false)
            })
    }, [pageNumber, loadMoreTransactions]);

    const loadMoreItems = () => {
        console.log("loading more")
        if (!loadMoreTransactions)
            return;
        //check if length of transactions has changed
        setPageNumber(getPageNo())
    }

    const getPageNo = () => parseInt(transactions.length / 10) + 1;

    const fundTransactions = ({ item }) => {

        return (
            <View style={styles.transactionDetails}>
                <View style={styles.narationDetails}>
                    <View style={styles.naration}>
                        <Text style={styles.narationTitle}>{item.type}</Text>
                    </View>
                    <Text style={item.type === "DEBIT" ? styles.transactionAmountWithdraw : styles.transactionAmountReceived}>&#8358;{formatCurrency(item.amount)}</Text>
                </View>
                <View style={styles.typeAndDate}>
                    <Text style={styles.transactionType}>{item.description}</Text>
                    <Text style={styles.transactionType}>{item.transactionDate}</Text>
                </View>
            </View>
        )

    }

    const renderFooterLoader = () => {
        return (
            <>
                {loadingMore ?
                    <PageLoading
                        backgroundColor='#FFFF'
                        spinnerColor="#000000"
                    />
                    :
                    <></>
                }

            </>
        )
    }

    if (loading) {
        return <PageLoading
            backgroundColor='#FFFF'
            spinnerColor="#000000"
        />
    }

    return (
        <View style={styles.container}>
            {transactions.length > 0 ?
                <FlatList
                    data={transactions}
                    renderItem={fundTransactions}
                    keyExtractor={item => item.transactionId}
                    ListFooterComponent={renderFooterLoader}
                    onEndReached={loadMoreItems}
                    onEndReachedThreshold={0.2}
                />
                :
                <View style={styles.noTransactionContainer}>
                    <Image
                        style={styles.unavailable}
                        source={require('../../../assets/images/cart-icon1.png')}
                    />
                    <Text style={styles.noTransaction}>
                        No available transaction. get boost , get game plan and fund your wallet to see transactions
                    </Text>
                </View>
            }
        </View>
    );

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
        borderBottomWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3)

    },
    noTransactionContainer: {
        display: 'flex',
        marginVertical: responsiveScreenWidth(40),
        paddingHorizontal: normalize(18),
        alignItems: 'center'
    },
    unavailable: {
        width: normalize(100),
        height: normalize(100),
        marginVertical: normalize(10),
    },
    noTransaction: {
        fontFamily: 'graphik-regular',
        fontSize: '1rem',
        color: '#4F4F4F',
        lineHeight: '1.5rem',
        textAlign: 'center',
        marginTop: responsiveScreenWidth(8)
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
        fontSize: '0.6rem',
        color: '#C4C4C4'
    },
});
