import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity, TextInput, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import normalize from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { getUser } from '../Auth/AuthSlice';
import WalletBalance from './WalletBalance';
import { Paystack } from 'react-native-paystack-webview';
import { paystackKey } from '../../utils/BaseUrl';
import { verifyFunding } from '../../utils/ApiHelper';
import Input from '../../shared/Input';


export default function FundWalletScreen({ navigation }) {
    const dispatch = useDispatch();

    const [amount, setAmount] = useState('');
    const user = useSelector(state => state.auth.user)

    const paystackWebViewRef = useRef();

    const transactionCompleted = (res) => {
        navigation.navigate('Wallet')
        verifyFunding(res.data.transactionRef.reference);
        dispatch(getUser());
    }

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <WalletBalance balance={user.walletBalance} />
                {/* <FundAmount /> */}
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
                {/* <FundSource /> */}
                <FundButton onPress={() => paystackWebViewRef.current.startTransaction()} text='Fund Wallet' />
                {/* <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={true}
                    closeOnPressMask={true}
                    height={600}
                    customStyles={{
                        wrapper: {
                            backgroundColor: "rgba(0, 0, 0, 0.5)"
                        },
                        draggableIcon: {
                            backgroundColor: "#000",
                        },
                        container: {
                            borderTopStartRadius: 25,
                            borderTopEndRadius: 25,
                        }
                    }}
                >
                    <BankDetails />
                </RBSheet> */}
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
const FundAmount = () => {
    const [amount, setAmount] = useState('');

    return (
        <View style={styles.balance}>
            <Text style={styles.walletTitle}>How much do you want to deposit? (&#8358;)</Text>
            <TextInput
                style={styles.availableAmount}
                value={amount}
                keyboardType="numeric"
                onChangeText={setAmount}
                autoFocus={true}
            />
            <View style={styles.flag}>
                <Image
                    source={require('../../../assets/images/naija_flag.png')}
                />
                <Text style={styles.flagText}>NGN</Text>
            </View>
        </View>
    )
};


const FundButton = ({ onPress, text }) => {
    return (
        <View style={styles.buttonContainer}>
            <Pressable
                onPress={onPress}
                style={() => [
                    {
                        backgroundColor:
                            '#EF2F55'
                    },
                    styles.button
                ]}
            >
                <Text style={styles.fundButton}>{text}</Text>
            </Pressable>
        </View>
    )
};


const FundSource = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.fundSource}>
            <Text style={styles.sourceTitle}>Fund Source:</Text>
            <View style={styles.link}>
                <Text style={styles.linkTitle}></Text>
                <TouchableOpacity onPress={() => navigation.navigate('TransactionScreen')}>
                    <Ionicons name="md-chevron-forward-sharp" size={24} color="#828282" />
                </TouchableOpacity>
            </View>
        </View>
    )
};

const BankButton = ({ buttonText, buttonStyle, textStyle }) => {
    return (
        <View>
            <TouchableOpacity style={buttonStyle}>
                <Text style={textStyle}>
                    {buttonText}
                </Text>
            </TouchableOpacity>
        </View>
    )
}

const BankDetails = () => {
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState('');
    const [bankName, setBankName] = useState('');

    return (
        <View style={styles.bankDetails}>
            <Text style={styles.bankTitle}>Bank Details</Text>
            <View style={styles.bankForm}>
                <View style={styles.bankSection}>
                    <Text style={styles.bankLabel}>Bank Name</Text>
                    <TextInput
                        style={styles.bankInput}
                        value={bankName}
                        keyboardType="default"
                        onChange={setBankName}
                    />
                </View>
                <View style={styles.bankSection}>
                    <Text style={styles.bankLabel}>Account Number</Text>
                    <TextInput
                        style={styles.bankInput}
                        value={accountNumber}
                        keyboardType="numeric"
                        onChange={setAccountNumber}
                    />
                </View>
                <View style={styles.bankSection}>
                    <Text style={styles.bankLabel}>Account Name</Text>
                    <TextInput
                        style={styles.bankInput}
                        value={accountName}
                        keyboardType="default"
                        onChange={setAccountName}
                    />
                </View>
                <View style={styles.bankbuttons}>
                    <BankButton buttonText='Cancel' buttonStyle={styles.cancel} textStyle={styles.cancelText} />
                    <BankButton buttonText='Save bank details' buttonStyle={styles.save} textStyle={styles.saveText} />
                </View>
            </View>
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF'
    },
    balance: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(38),
        // borderColor: 'rgba(0, 0, 0, 0.15)',
        // borderBottomWidth: normalize(1),
        backgroundColor: '#fff',
    },
    headerBack: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(15),
        paddingTop: normalize(40),
        paddingBottom: normalize(20),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
    },
    walletTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: '#7C7D7F'
    },
    availableAmount: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(40),
        color: '#333333',
        marginVertical: normalize(20),
        width: normalize(100),
        textAlign: 'center',
    },
    buttonContainer: {
        // borderColor: 'rgba(0, 0, 0, 0.15)',
        // borderBottomWidth: normalize(1),
        paddingVertical: normalize(20),
        backgroundColor: '#fff',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(32),
        marginHorizontal: normalize(18),
        borderRadius: 12,
        elevation: 3,
    },
    fundButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#FFFF'
    },
    earnings: {
        backgroundColor: '#fff',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(15),
        marginHorizontal: normalize(18),
        marginVertical: normalize(18),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    earningText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: 'rgba(0, 0, 0, 0.5)'
    },
    earningAmount: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(22),
        color: 'black'
    },
    earningContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    earningLink: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
    },
    link: {
        backgroundColor: '#F3F3F3',
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(15),
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    fundSource: {
        marginTop: normalize(70),
        marginBottom: normalize(5),
    },
    linkTitle: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
    },
    sourceTitle: {
        color: '#828282',
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(10)
    },
    bankInput: {
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(5),
        borderRadius: 8,
    },
    bankDetails: {
        marginHorizontal: normalize(18),
        marginVertical: normalize(20),
    },
    bankbuttons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: normalize(50),
        alignItems: 'center'
    },
    cancel: {
        borderWidth: normalize(1),
        borderColor: '#EF2F55',
        paddingVertical: normalize(12),
        // paddingHorizontal: normalize(25),
        width: normalize(120),
        textAlign: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 5
    },
    save: {
        borderWidth: normalize(1),
        borderColor: '#EF2F55',
        paddingVertical: normalize(12),
        // paddingHorizontal: normalize(15),
        textAlign: 'center',
        alignItems: 'center',
        width: normalize(120),
        backgroundColor: '#EF2F55',
        borderRadius: 5
    },
    bankTitle: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(13),
        marginBottom: normalize(25)
    },
    bankForm: {},
    bankLabel: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        marginBottom: normalize(5),
        color: 'black',
        opacity: 0.7
    },
    bankSection: {
        marginVertical: normalize(15)
    },
    saveText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#FFF',
    },
    cancelText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#EF2F55',
    },
    flag: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagText: {
        marginLeft: normalize(5),
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#151C2F',
        opacity: 0.5
    }
});
