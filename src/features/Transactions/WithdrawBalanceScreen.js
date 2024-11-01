import React, { useEffect, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { Image, Linking, Platform, Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import Input from "../../shared/Input";
import { useDispatch, useSelector } from "react-redux";
import { formatCurrency } from "../../utils/stringUtl";
import { fetchUserTransactions, getBankData, withdrawWinnings } from "../CommonSlice";
import AppButton from "../../shared/AppButton";
import logToAnalytics from "../../utils/analytics";
import { getUser } from "../Auth/AuthSlice";
import { SelectList } from 'react-native-dropdown-select-list';
import CustomAlert from "../../shared/CustomAlert";
import UniversalBottomSheet from "../../shared/UniversalBottomSheet";


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
    const [allError, setAllError] = useState('');
    const minimumWithdrawableAmount = useSelector(state => state.common.minimumWithdrawableAmount);
    const [modalVisible, setModalVisible] = useState(false);

    const startModal = () => {
        setModalVisible(true)
    }

    const onChangeAccountNumber = (text) => {
        text.length > 0 && text.length < 10 ? setAccountNumberErr(true) : setAccountNumberErr(false);
        setAccountNumber(text)
    }

    const refRBSheet = useRef();

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
    }


    const withdrawBalance = () => {
        setLoading(true)
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
                        startModal()
                        setAllError("Your Network is Offline.");
                        setWithdraw(false)
                        setLoading(false)
                    }
                    else if (err.response.status === 400) {
                        openBottomSheet()
                        // startModal()
                        setAllError(err.response.data.message)
                        setWithdraw(false)
                        setLoading(false)

                    }
                }

            )
    }

    const close = () => {

    }

    useEffect(() => {
        const invalid = accountNumberErr || Number.parseFloat(amount) < minimumWithdrawableAmount || amount > Number.parseFloat(user.withdrawableBalance) || amount === '' || accountNumber === ''
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
                            error={((Number.parseFloat(amount) < minimumWithdrawableAmount) && `Minimum withdrawable amount is NGN ${minimumWithdrawableAmount}`) ||
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
                                inputStyles={{ fontSize: 18, color: '#1C453B' }}
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
                <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                    textLabel={allError} buttonLabel='Ok, got it'
                    alertImageVisible={false} doAction={close}
                />
                <UniversalBottomSheet
                    refBottomSheet={refRBSheet}
                    height={Platform.OS === 'ios' ? 430 : 380}
                    subComponent={<WithdrawalError
                        allError={allError}
                        onClose={closeBottomSheet}
                    />}
                />
                <AppButton text={loading ? 'Processing' : 'Request withdrawal'} disabled={!withdraw || loading}
                    style={styles.loginButton} textStyle={styles.buttonText} disabledStyle={styles.disabled}
                    onPress={withdrawBalance}
                />
            </View>
        </ScrollView>
    )
}

const WithdrawalError = ({ allError, onClose }) => {

    const navigation = useNavigation();
    const goHome = () => {
        onClose()
        navigation.navigate('Home')
    }

    return (
        <View style={styles.withdrawalErrorContainer}>
            <Text style={styles.errorHeader}>Account Verification</Text>
            <Text style={styles.errorTitle}>{allError}</Text>
            <Text style={styles.errorMessage}>We could not process your withdrawal request because your account in not
                verified yet. kindly contact support to verify your account.</Text>
            <Pressable style={styles.whatsappChat} onPress={() => Linking.openURL('https://wa.me/2348025116306')}>
                <Image
                    source={require('../../../assets/images/whatsapp-icon.png')}
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Contact Support</Text>
                        <Ionicons name="chevron-forward" size={22} color='#1C453B' />
                    </View>
                    <Text style={styles.whatsappTitle}>Live chat with support on Whatsapp</Text>
                </View>
            </Pressable>
            <AppButton text='Cancel request'
                style={styles.cancelButton} textStyle={styles.buttonText} disabledStyle={styles.disabled}
                onPress={goHome}
            />
        </View>
    )
}

const WithdrawBalanceTitle = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerContainerStyle}>
            <Ionicons name="close-sharp" size={30} color="#1C453B" onPress={() => navigation.navigate('Wallet')} />
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

    },
    containeri: {
        paddingBottom: 30,
        paddingTop: Platform.OS === 'ios' ? responsiveScreenWidth(15) : responsiveScreenWidth(8),
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
        color: '#1C453B',
        textAlign: 'center'
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
        color: '#1C453B',
        fontSize: '0.98rem',
    },
    requiredText: {
        fontFamily: 'sansation-regular',
        color: '#E15220',
        fontSize: '0.95rem',
    },
    loginButton: {
        marginVertical: 20,
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },
    disabled: {
        backgroundColor: '#EA8663'
    },
    withdrawalErrorContainer: {
        padding: '1rem'
    },
    cancelButton: {
        marginVertical: 0,
    },
    errorHeader: {
        fontFamily: 'gotham-medium',
        color: '#1C453B',
        fontSize: '0.98rem',
        textAlign: 'center'
    },
    errorMessage: {
        fontFamily: 'gotham-medium',
        color: '#1C453B',
        fontSize: '0.8rem',
        marginBottom: '1rem',
        lineHeight: '1.1rem'
    },
    errorTitle: {
        fontFamily: 'gotham-medium',
        color: '#1C453B',
        fontSize: '0.85rem',
        marginVertical: '.8rem'
    },
    whatsappChat: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 13,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        paddingVertical: '.5rem',
        paddingHorizontal: '.5rem',
        marginBottom: '1rem'
    },
    textContainer: {
        flexDirection: 'column',
        alignItems: 'flex-start'
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    header: {
        fontSize: '0.9rem',
        fontFamily: 'gotham-bold',
        color: '#1C453B'
    },
    whatsappTitle: {
        fontSize: '0.8rem',
        fontFamily: 'sansation-regular',
        marginTop: normalize(3),
        color: '#1C453B'
    },
    icon: {
        width: 55,
        height: 55,
        marginRight: '.4rem'
    }
})