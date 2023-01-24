import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, Text, TextInput, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch } from "react-redux";
import AppButton from "../../shared/AppButton";
import Input from "../../shared/Input";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import { sendUserFeedback } from "../CommonSlice";
import { useNavigation } from '@react-navigation/native';
import analytics from '@react-native-firebase/analytics';



const AuthContactUs = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Do you have any question?</Text>
            <ContactForm />
        </ScrollView>
    )
}

const ContactForm = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [message_body, setMessage] = useState('');
    const [emailErr, setEmailError] = useState(false);
    const [firstNameErr, setFirstNameError] = useState(false);
    const [lastNameErr, setLastNameError] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const [canSave, setCanSave] = useState(false);

    const goBackButton = () => {
        navigation.goBack()
    }


    const sendFeedback = () => {
        setSaving(true)
        dispatch(sendUserFeedback({
            first_name,
            last_name,
            email,
            message_body,
        }))
            .then(unwrapResult)
            .then(async result => {
                Alert.alert('Thanks for your feedback. You would be responded to shortly')
                await analytics().logEvent("user_sent_feedback_from_auth_screens", {
                    'id': first_name,
                    'email': email
                })
                setMessage('')
                setFirstName('')
                setLastName('')
                setSaving(false)
            })
            .catch((rejectedValueOrSerializedError) => {
                setMessage('')
                setFirstName('')
                setLastName('')
                setSaving(false)
                Alert.alert(rejectedValueOrSerializedError.message)
            });

    }

    const onChangeEmail = (text) => {
        const rule = /^\S+@\S+\.\S+$/;
        setEmailError(!rule.test(text))
        setEmail(text)
    }

    const onChangeFirstName = (text) => {
        text.length > 0 && text.length < 3 ? setFirstNameError(true) : setFirstNameError(false);
        setFirstName(text)
    }

    const onChangeLastName = (text) => {
        text.length > 0 && text.length < 3 ? setLastNameError(true) : setLastNameError(false);
        setLastName(text)
    }

    const onChangeMessage = (text) => {
        text.length > 0 && text.length < 3 ? setMessageError(true) : setMessageError(false);
        setMessage(text)
    }


    useEffect(() => {
        const invalid = messageError || message_body === '' || firstNameErr || first_name === '' ||
            lastNameErr || last_name === '' || emailErr || email === ''
        setCanSave(!invalid);
    }, [messageError, message_body])

    return (
        <View style={styles.formContainer}>
            <Input
                label='First name'
                value={first_name}
                onChangeText={text => { onChangeFirstName(text) }}
                error={firstNameErr && '*first name must not be empty'}
            />
            <Input
                label='Last name'
                value={last_name}
                onChangeText={text => { onChangeLastName(text) }}
                error={lastNameErr && '*last name must not be empty'}
            />
            <Input
                label='Email'
                value={email}
                onChangeText={text => { onChangeEmail(text) }}
                error={emailErr && '*please input a valid email'}

            />
            <View>
                <TextInput
                    placeholder="Your message"
                    value={message_body}
                    onChangeText={text => { onChangeMessage(text) }}
                    style={styles.messageBox}
                    multiline={true}
                    numberOfLines={6}
                />
                {messageError && <Text>Please input your message</Text>}
            </View>
            <AppButton
                text={saving ? 'Sending' : 'Send'}
                onPress={sendFeedback}
                disabled={!canSave || saving}
            />
            <Text style={styles.goBack} onPress={goBackButton}>Go Back</Text>
        </View>
    )
}

export default AuthContactUs;
const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        paddingHorizontal: normalize(20),
        paddingTop: responsiveScreenWidth(40),

    },
    title: {
        fontSize: '1rem',
        fontFamily: 'graphik-medium',
    },
    formContainer: {
        marginTop: '3rem'
    },
    messageBox: {
        paddingBottom: Platform.OS === 'ios' ? '5rem' : '3rem',
        paddingTop: '.8rem',
        paddingHorizontal: '.7rem',
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        color: '#00000080',
        fontSize: '0.75rem',
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top'
    },
    goBack: {
        fontSize: '.7rem',
        fontFamily: 'graphik-medium',
        color:'#EF2F55',
        textAlign:'center'
    }
})