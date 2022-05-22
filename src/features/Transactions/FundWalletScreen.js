import React, { useState, useRef } from 'react';
import { Text, View, Image, Alert } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import PaystackWebView from 'react-native-paystack-popup';
import { useDispatch, useSelector } from 'react-redux';
import Constants from 'expo-constants';

import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { getUser } from '../Auth/AuthSlice';
import AppButton from "../../shared/AppButton";
import { verifyFunding } from '../../utils/ApiHelper';
import Input from '../../shared/Input';
import { formatCurrency } from '../../utils/stringUtl';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';


export default function FundWalletScreen() {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    useApplyHeaderWorkaround(navigation.setOptions);

    const user = useSelector(state => state.auth.user)
    const [amount, setAmount] = useState('');
    const [showPayment, setShowPayment] = React.useState(false);

    const ref = useRef(null);

    const transactionCompleted = (res) => {
        verifyFunding(res.reference);
        dispatch(getUser())
            .then(result => {
                setShowPayment(false);
                dispatch(getUser())
                navigation.navigate('Wallet')
            })
    }

    const startPayment = () => {
        var cleanedAmount = amount.trim().length === 0 ? 0 : Number.parseFloat(amount);
        console.log(Number.parseFloat(amount));
        if (cleanedAmount < 500) {
            Alert.alert("Amount cannot be less than 500");
            return false;
        }
        setShowPayment(true);
    }
    return (
        <>
            {!showPayment && <View style={styles.container}>
                <View style={styles.balance}>
                    <UserWalletBalance balance={user.walletBalance} />
                    <Text style={styles.walletTitle}>How much do you want to deposit ? (&#8358;)</Text>
                    <Input
                        style={styles.fundAmount}
                        value={amount}
                        keyboardType="numeric"
                        onChangeText={(setAmount)}
                        autoFocus={true}
                        placeholder='500'
                        min
                    />
                    <View style={styles.flag}>
                        <Image
                            source={require('../../../assets/images/naija_flag.png')}
                        />
                        <Text style={styles.flagText}>NGN</Text>
                    </View>
                </View>
                <AppButton text='Fund Wallet' onPress={startPayment} style={styles.actionButton} />
            </View>
            }


            {showPayment && <PaystackWebView
                ref={ref}
                onError={() => {
                    setShowPayment(false);
                    alert("Failed...")
                }}
                onDismissed={() => {
                    setShowPayment(false)
                }}
                onSuccess={(response) => {
                    transactionCompleted(response)
                }}

                paystackKey={Constants.manifest.extra.paystackKey} customerEmail={user.email} amount={Number.parseFloat(amount) * 100} />}


        </>
    );
}

const UserWalletBalance = ({ balance }) => {
    return (
        <Text style={styles.availableAmount}>Bal: &#8358;{formatCurrency(balance)}</Text>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    balance: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(38),
        backgroundColor: '#fff',
    },
    walletTitle: {
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem',
        color: '#7C7D7F'
    },
    availableAmount: {
        fontFamily: 'graphik-medium',
        fontSize: '0.8rem',
        color: '#01A7DB',
        textAlign: 'center',
        backgroundColor: '#F3F3F3',
        marginBottom: normalize(40),
        paddingVertical: normalize(12),
        paddingHorizontal: responsiveScreenWidth(8),
        borderRadius: 64
    },
    fundAmount: {
        fontFamily: 'graphik-bold',
        fontSize: '2.2rem',
        color: '#333333',
        marginVertical: normalize(20),
        width: responsiveScreenWidth(100),
        textAlign: 'center',
    },
    flag: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagText: {
        marginLeft: normalize(5),
        fontFamily: 'graphik-medium',
        fontSize: '0.7rem',
        color: '#151C2F',
        opacity: 0.5
    },
    actionButton: {
        paddingVertical: responsiveScreenHeight(2.3),
        marginTop: responsiveScreenHeight(5),
        marginHorizontal: normalize(18)
    }
});
