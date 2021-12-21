import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, Alert } from 'react-native';
import normalize from '../../utils/normalize';
import { Picker } from '@react-native-picker/picker';
import Input from '../../shared/Input';
import { useDispatch, useSelector } from 'react-redux';
import { editBankDetails } from '../Auth/AuthSlice';
import { getBankData } from '../CommonSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { getUser } from "../Auth/AuthSlice";
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function BankDetailsScreen({ navigation, bank }) {
    const [saving, setSaving] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const user = useSelector(state => state.auth.user)
    const banks = useSelector(state => state.common.banks)
    // console.log(JSON.stringify(banks))
    const [bankName, setBankName] = useState(user.bankName ?? '');
    const [accountNumber, setAccountNumber] = useState(user.accountNumber);
    const [accountName, setAccountName] = useState(user.accountName);
    const [accountNumberErr, setAccountNumberError] = useState(false);
    const [accountNameErr, setAccountNameError] = useState(false);
    const dispatch = useDispatch();
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
        console.log(accountNumber + 'fish')
        dispatch(editBankDetails({
            bankName,
            accountName,
            accountNumber
        }))
            .then(unwrapResult)
            .then(result => {
                console.log(result);
                console.log("success");
                dispatch(getUser())
                Alert.alert('Bank details updated successfully')
                navigation.navigate("UserProfile")
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError);
                setSaving(false);
                Alert.alert('Invalid data provided')
                // after login eager get commond data for the whole app
                // console.log("failed");
                // console.log(rejectedValueOrSerializedError)
            });
    }

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity onPress={onSaveBankDetails} disabled={!canSave}>
                    <Text style={styles.saveChanges}>{saving ? 'Saving' : 'Save Changes'}</Text>
                </TouchableOpacity>
                <View>
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
                    <View style={styles.detail}>
                        <Text style={styles.inputLabel}>Select Bank</Text>
                        <Text style={styles.input}>Select Bank</Text>
                        <Picker
                            selectedValue={bankName}
                            onValueChange={(itemValue, itemIndex) =>
                                setBankName(itemValue)
                            }
                            mode='dropdown'

                        >
                            {banks && banks.map((bank, i) =>
                                <Picker.Item label={bank.name} key={i} value={bank.name} style={styles.pickerItem} />
                            )}
                        </Picker>
                    </View>

                </View>
            </View>
        </ScrollView>
    );
}

const SelectBank = ({ bank }) => {
    const user = useSelector(state => state.auth.user)
    const [bankName, setBankName] = useState(user.bankName ?? '');
    return (

        <Picker
            selectedValue={bankName}
            onValueChange={(itemValue, itemIndex) =>
                setBankName(itemValue)
            }
            mode='dropdown'

        >
            {banks && banks.map((bank, i) => <SelectBank key={i} bank={bank} />)}
            <Picker.Item label={bank.name} value={bank.name} style={styles.pickerItem} />
        </Picker>

    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#E5E5E5'
    },
    content: {
        marginHorizontal: normalize(18),
        paddingVertical: normalize(10),
        marginBottom: normalize(20)

    },
    saveChanges: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
        marginLeft: 'auto'
    },
    detail: {
        marginVertical: normalize(10)
    },
    select: {
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 8,
    },
    pickerItem: {
        height: normalize(20)
    },
    inputLabel: {
        fontFamily: 'graphik-medium',
        color: '#000000B2',
        marginBottom: normalize(8)
    },
    input: {
        // height: normalize(38),
        paddingVertical:normalize(15),
        borderWidth: normalize(1),
        borderRadius: normalize(10),
        paddingLeft: normalize(10),
        paddingRight: normalize(20),
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        color: '#00000080',
        alignItems:'center'
    },

});
