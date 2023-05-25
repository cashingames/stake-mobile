import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Pressable, Alert } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Picker } from '@react-native-picker/picker';
import { editBankDetails, getUser } from '../Auth/AuthSlice';
import { getBankData } from '../CommonSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import Input from '../../shared/Input';
import normalize from '../../utils/normalize';
import { useDispatch, useSelector } from 'react-redux';
import AppButton from '../../shared/AppButton';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { SelectList } from 'react-native-dropdown-select-list'

export default function BankDetailsScreen({ navigation }) {
    const dispatch = useDispatch();
    useApplyHeaderWorkaround(navigation.setOptions);

    const user = useSelector(state => state.auth.user)
    const banks = useSelector(state => state.common.banks)
// console.log(banks, 'these are banks')
    const [saving, setSaving] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [accountNumber, setAccountNumber] = useState(user.accountNumber);
    const [accountName, setAccountName] = useState(user.accountName);
    const [accountNumberErr, setAccountNumberError] = useState(false);
    const [accountNameErr, setAccountNameError] = useState(false);
    const [bankName, setBankName] = useState(user.bankName ?? '');
    console.log(bankName, 'these are banks')


    const onChangeAccountNumber = (text) => {
        text.length > 0 && text.length < 10 ? setAccountNumberError(true) : setAccountNumberError(false);
        setAccountNumber(text)
    }

    const onChangeAccountName = (text) => {
        text.length > 0 && text.length < 5 ? setAccountNameError(true) : setAccountNameError(false);
        setAccountName(text)
    }

    useEffect(() => {
        const invalid = accountNumberErr || accountNameErr || accountName === '' || accountNumber === '';
        setCanSave(!invalid);
    }, [accountNumberErr, accountNameErr, accountName, accountNumber])

    useEffect(() => {
        if (!banks || banks.length === 0) {
            dispatch(getBankData());
        }
        else {
            setBankName(user.bankName || '')
        }
    }, [banks, user, dispatch])

    const onSaveBankDetails = () => {
        setSaving(true);

        dispatch(editBankDetails({
            bankName,
            accountName,
            accountNumber
        }))
            .then(unwrapResult)
            .then(result => {
                dispatch(getUser())
                Alert.alert('Bank details updated successfully')
                navigation.navigate("UserProfile")
            })
            .catch((rejectedValueOrSerializedError) => {
                // console.log(rejectedValueOrSerializedError);
                setSaving(false);
                Alert.alert('Invalid data provided')
            });
    }

    return (
        <View style={styles.container}>
            <ScrollView >
                <>
                    <Input
                        label='Account Number'
                        value={accountNumber}
                        onChangeText={text => { onChangeAccountNumber(text) }}
                        maxLength={10}
                        keyboardType='numeric'
                        error={accountNumberErr && '*account number must not be less than 10 digits'}
                    />
                    <Input
                        label='Name on Account'
                        value={accountName}
                        onChangeText={text => { onChangeAccountName(text) }}
                        error={accountNameErr && '*account name must not be empty'}
                    />
                    <Text style={styles.nameNotice}>Note: The account name should be exactly as it was registered with your bank</Text>
                    {/* <View style={styles.banksContainer}>
                        <Text style={styles.bankLabel}>Select Bank</Text>

                        <Picker
                            style={styles.bankPicker}
                            selectedValue={bankName}
                            onValueChange={(itemValue, itemIndex) =>
                                setBankName(itemValue)
                            }
                            mode='dropdown'

                        >
                            {banks && banks.map((bank, i) =>
                                <Picker.Item label={bank.name} key={i} value={bank.value} style={styles.pickerItem} />
                            )}
                        </Picker>
                    </View> */}

                    <SelectList
                        setSelected={(bankName) => setBankName(bankName)}
                        data={banks}
                        save="value"
                        placeholder="Select bank"
                    />
                </>
            </ScrollView>
            <AppButton text={saving ? 'Saving' : 'Save Changes'} onPress={onSaveBankDetails} disabled={!canSave} />
        </View>
    );
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(25),
    },
    banksContainer: {
        marginVertical: normalize(10)
    },
    bankPicker: {
        color: '#000000B2',
        borderWidth: 1,
        borderColor: '#CDD4DF',
        backgroundColor: "#ebeff5",
    },
    bankLabel: {
        fontFamily: 'graphik-medium',
        color: '#000000B2',
        marginBottom: normalize(8),
        fontSize: '0.76rem',
    },
    pickerItem: {
        fontSize: '0.75rem',
    },
    nameNotice: {
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: '0.6rem',
    }

});
