import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, Button } from 'react-native';
// import { Ionicons } from '@expo/vector-icons';
// import DatePicker from 'react-native-date-picker'
// import SelectDropdown from 'react-native-select-dropdown'
import normalize from '../../utils/normalize';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';
import DetailInput from '../../shared/DetailInput';

export default function BankDetailsScreen({ navigation }) {
    const user = useSelector(state => state.auth.user)

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <TouchableOpacity>
                    <Text style={styles.saveChanges}>Save Changes</Text>
                </TouchableOpacity>
                <DetailsInput />
            </View>
        </ScrollView>
    );
}

const DetailsInput = () => {
    const user = useSelector(state => state.auth.user)
    const banks = []
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState(user.accountNumber);
    const [accountName, setAccountName] = useState(user.accountName);
    const [accountNumberErr, setAccountNumberError] = useState(false);
    const [accountNameErr, setAccountNameError] = useState(false);
    const [canSave, setCanSave] = useState(false); 

    const onChangeAccountNumber = (text) => {
        text.length > 0 && text.length < 10 ? setAccountNumberError(true) : setAccountNumberError(false);
        setAccountNumber(text)
    }

    const onChangeAccountName = (text) => {
        text.length > 0 && text.length < 5 ? setAccountNameError(true) : setAccountNameError(false);
        setAccountName(text)
    }

    useEffect(() => {
        const invalid =accountNumberErr || accountNameErr  || accountName === '' || accountNumber === '';
        setCanSave(!invalid);
    }, [accountNumberErr, accountNameErr, accountName, accountNumber])

    return (
        <View>
            <DetailInput
                inputLabel='Account Number'
                value={accountNumber}
                onChangeText={text => { onChangeAccountNumber(text) }}
                maxLength={10}
                keyboardType='numeric'
                error={accountNumberErr && '*account number must not be less than 10 digits'}
                style={styles.input}
            />
            <DetailInput
                inputLabel='Name on Account'
                value={accountName}
                onChangeText={text => { onChangeAccountName(text) }}
                error={accountNameErr && '*account name must not be empty'}
                style={styles.input}
            />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        backgroundColor:'#E5E5E5'
    },
    content: {
        marginHorizontal: normalize(18),
        paddingVertical: normalize(10),
        marginBottom: normalize(20)

    },
    detail: {
        marginVertical: normalize(10)
    },
    saveChanges: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
        marginLeft: 'auto'
    },
    inputLabel: {
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
        color: 'rgba(0, 0, 0, 0.7)',
        marginBottom: normalize(5)
    },
    input: {
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 8,
        padding: normalize(6),
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#000000',
    },
    email: {
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 8,
        padding: normalize(6),
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        color: '#535761',
    }

});
