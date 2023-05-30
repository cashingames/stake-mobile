import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Alert, Platform, ScrollView, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import Input from "../../shared/Input";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "../../utils/stringUtl";
import { Picker } from '@react-native-picker/picker';
import { fetchUserTransactions, getBankData, withdrawWinnings } from "../CommonSlice";
import AppButton from "../../shared/AppButton";
import logToAnalytics from "../../utils/analytics";
import { getUser } from "../Auth/AuthSlice";
import { SelectList } from 'react-native-dropdown-select-list';


const WithdrawBalanceScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const banks = useSelector(state => state.common.banks);
    const [accountNumber, setAccountNumber] = useState('');
    const [accountName, setAccountName] = useState(user.firstName + ' ' + user.lastName);
    const [accountNumberErr, setAccountNumberErr] = useState(false);
    const [amount, setAmount] = useState('');
    const [bankName, setBankName] = useState('');
    const [loading, setLoading] = useState(false);
    const [withdraw, setWithdraw] = useState(false);
    // const [withdrawAlert, setWithdrawAlert] = useState(false);
    const minimumWithdrawableAmount = Number.parseFloat(1000);

    const onChangeAccountNumber = (text) => {
        text.length > 0 && text.length < 10 ? setAccountNumberErr(true) : setAccountNumberErr(false);
        setAccountNumber(text)
    }

    // const withdrawValidation = () => {
    //     setWithdrawAlert(true)
    //     Alert.alert(
    //         "Withdrawal Notification",
    //         `Fund kept in withdrawable balance for more than a month will be rendered invalid and non-withdrawable. Ensure you withdraw your winnings before the deadline. `,
    //         [
    //             { text: "Got it", onPress: () => withdrawBalance() }
    //         ]
    //     );
    // }

    const withdrawBalance = () => {
        setLoading(true)
        // setWithdrawAlert(false)
        setWithdraw(true)
        withdrawWinnings({
            account_number: accountNumber,
            bank_name: bankName,
            account_name: accountName,
            amount
        })
            .then(response => {
                logToAnalytics('winnings_withdrawn_successfully', {
                    'product_id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email,
                    'value': user.withdrawableBalance,
                    'currency': 'NGN'
                });
                setLoading(false)
                setWithdraw(false)
                navigation.navigate('WithdrawalSuccess')
                dispatch(getUser())
                dispatch(fetchUserTransactions())
            },
                err => {
                    if (!err || !err.response || err.response === undefined) {
                        Alert.alert("Your Network is Offline.");
                        setWithdraw(false)
                        setLoading(false)
                    }
                    else if (err.response.status === 400) {
                        Alert.alert(err.response.data.message);
                        setWithdraw(false)
                        setLoading(false)

                    }
                }

            )
    }

    useEffect(() => {
        const invalid = accountNumberErr || amount < minimumWithdrawableAmount || amount > Number.parseFloat(user.withdrawableBalance) || amount === '' || accountNumber === ''
        setWithdraw(!invalid);
    }, [accountNumberErr, amount, minimumWithdrawableAmount, user.withdrawableBalance, accountNumber])


    useEffect(() => {
        dispatch(getBankData());
    }, [])


    return (
        <ScrollView style={styles.container}>
            <View style={styles.containeri}>
                <WithdrawBalanceTitle />
                <View style={styles.inputContainer}>
                    <View>
                        <Input
                            label='Enter amount'
                            placeholder={`Minimum of NGN ${minimumWithdrawableAmount}`}
                            value={amount}
                            error={((amount < minimumWithdrawableAmount) && `Minimum withdrawable amount is NGN ${minimumWithdrawableAmount}`) ||
                                ((amount > Number.parseFloat(user.withdrawableBalance)) && 'You cannot withdraw more than your available balance')}
                            onChangeText={setAmount}
                            isRequired={true}
                            keyboardType="numeric"
                            extraText={true}
                            extraTextWord={`Available balance NGN ${formatCurrency(user.withdrawableBalance)}`}
                        />
                        <View style={styles.banksContainer}>
                            <View style={styles.labelContainer}>
                                <Text style={styles.bankLabel}>Choose bank</Text>
                                <Text style={styles.requiredText}>Required</Text>
                            </View>

                            <SelectList
                                setSelected={(bankName) => setBankName(bankName)}
                                data={banks}
                                save="value"
                                placeholder="Select bank"
                                fontFamily='sansation-regular'
                                boxStyles={{ height: normalize(52), alignItems: 'center', borderColor: '#D9D9D9', backgroundColor: '#fff' }}
                                inputStyles={{ fontSize: 18, color: '#072169' }}
                            />
                        </View>
                        <Input
                            label='Account number'
                            placeholder="0000xxxx28"
                            value={accountNumber}
                            keyboardType="numeric"
                            extraText={true}
                            extraTextWord='Enter 10 digit number'
                            error={accountNumberErr && "Account number can not be less than 10 digits"}
                            onChangeText={onChangeAccountNumber}
                            isRequired={true}
                            maxLength={10}
                        />
                        <Input
                            label='Account name'
                            placeholder="0000xxxx28"
                            value={accountName}
                            keyboardType="numeric"
                            extraText={true}
                            extraTextWord='Bank account name must tally with your cashingames first and last name'
                            onChangeText={setAccountName}
                            isRequired={true}
                            editable={false}
                        />
                    </View>
                </View>
                <AppButton text={loading ? 'Processing' : 'Request withdrawal'} disabled={!withdraw || loading}
                    style={styles.loginButton} textStyle={styles.buttonText} disabledStyle={styles.disabled}
                    onPress={withdrawBalance}
                />
            </View>
        </ScrollView>
    )
}

const WithdrawBalanceTitle = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainerStyle}>
            <Ionicons name="close-sharp" size={22} color="#072169" onPress={() => navigation.navigate('Wallet')} />
            <Text style={styles.headerTextStyle}>Withdrawal</Text>
            <Text></Text>
        </View>
    )
}
export default WithdrawBalanceScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        // paddingTop: Platform.OS === 'ios' ? responsiveScreenWidth(22) : responsiveScreenWidth(15),
        // paddingHorizontal: normalize(22),

    },
    containeri: {
        // flex: 1,
        // backgroundColor: '#F9FBFF',
        paddingBottom: 30,
        paddingTop: Platform.OS === 'ios' ? responsiveScreenWidth(22) : responsiveScreenWidth(15),
        paddingHorizontal: normalize(22),

    },
    headerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'gotham-bold',
        color: '#072169',
        textAlign: 'center'
        // paddingTop: normalize(10),
    },
    inputContainer: {
        marginTop: responsiveScreenWidth(10),
    },
    labelContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '.6rem'
    },
    banksContainer: {
        marginBottom: normalize(30),
    },
    bankPicker: {
        color: '#000000B2',
        borderWidth: 1,
        borderColor: '#CDD4DF',
        backgroundColor: "#ebeff5",
    },
    pickerItem: {
        fontSize: '0.75rem',
    },
    bankLabel: {
        fontFamily: 'gotham-medium',
        color: '#072169',
        fontSize: '0.98rem',
    },
    requiredText: {
        fontFamily: 'sansation-regular',
        color: '#E15220',
        fontSize: '0.95rem',
    },
    loginButton: {
        // backgroundColor: '#E15220',
        marginVertical: 20,
        // paddingVertical: normalize(19),
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },
    disabled: {
        backgroundColor: '#EA8663'
    },
})