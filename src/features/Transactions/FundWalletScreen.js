import React, { useState, useRef } from 'react';
import {Text, View, ScrollView, Pressable, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, {responsiveScreenHeight} from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Auth/AuthSlice';
import WalletBalance from './WalletBalance';
import AppButton from "../../shared/AppButton";
import { Paystack } from 'react-native-paystack-webview';
import { paystackKey } from '../../utils/BaseUrl';
import { verifyFunding } from '../../utils/ApiHelper';
import Input from '../../shared/Input';


export default function FundWalletScreen() {
    const dispatch = useDispatch();

    const [amount, setAmount] = useState('');
    const user = useSelector(state => state.auth.user)
    const navigation = useNavigation();

    const paystackWebViewRef = useRef();

    const transactionCompleted = (res) => {
        verifyFunding(res.data.transactionRef.reference);
        dispatch(getUser())
            .then(result => {
                console.log(result);
                dispatch(getUser())
                navigation.navigate('Wallet')
            })
       
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <WalletBalance balance={user.walletBalance} />
                <View style={styles.balance}>
                    <Text style={styles.walletTitle}>How much do you want to deposit ? (&#8358;)</Text>
                    <Input
                        style={styles.availableAmount}
                        value={amount}
                        keyboardType="numeric"
                        onChangeText={setAmount}
                        autoFocus={true}
                        placeholder='500'
                    />
                    <View style={styles.flag}>
                        <Image
                            source={require('../../../assets/images/naija_flag.png')}
                        />
                        <Text style={styles.flagText}>NGN</Text>
                    </View>
                </View>
                <AppButton text='Fund Wallet' onPress={() => paystackWebViewRef.current.startTransaction()}  style={styles.actionButton} />
                <Paystack
                    paystackKey={paystackKey}
                    billingEmail={user.email}
                    amount={amount}
                    onCancel={(e) => {
                        // handle response here
                        console.log(e)
                    }}
                    onSuccess={(res) => {
                        transactionCompleted(res);
                    }}

                    ref={paystackWebViewRef}
                    
                />
            </ScrollView>
        </SafeAreaView>
    );
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
        fontFamily: 'graphik-bold',
        fontSize: '2.3rem',
        color: '#333333',
        marginVertical: normalize(20),
        width: normalize(100),
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
