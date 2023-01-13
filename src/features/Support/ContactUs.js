import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, Text, TextInput, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import AppButton from "../../shared/AppButton";
import Input from "../../shared/Input";
import normalize from "../../utils/normalize";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import { getUser } from "../Auth/AuthSlice";
import { sendUserFeedback } from "../CommonSlice";
import analytics from '@react-native-firebase/analytics';



const ContactUs = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector(state => state.auth.user);
   



    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Do you have any question?</Text>
            <ContactForm user={user} />
        </ScrollView>
    )
}

const ContactForm = ({ user }) => {
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);
    // const [first_name, setFirstName] = useState('');
    // const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState(user.email);
    const [message_body, setMessage] = useState('');
    // const [firstNameErr, setFirstNameError] = useState(false);
    // const [lastNameErr, setLastNameError] = useState(false);
    const [messageError, setMessageError] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const first_name = user.firstName
    const last_name = user.lastName


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
                await analytics().logEvent("user_sent_feedback", {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                })
                setMessage('')
                setSaving(false)
            })
            .catch((rejectedValueOrSerializedError) => {
                setMessage('')
                setSaving(false)
                Alert.alert(rejectedValueOrSerializedError.message)
            });

    }

    // const onChangeFirstName = (text) => {
    //     text.length > 0 && text.length < 3 ? setFirstNameError(true) : setFirstNameError(false);
    //     setFirstName(text)
    // }

    // const onChangeLastName = (text) => {
    //     text.length > 0 && text.length < 3 ? setLastNameError(true) : setLastNameError(false);
    //     setLastName(text)
    // }

    const onChangeMessage = (text) => {
        text.length > 0 && text.length < 3 ? setMessageError(true) : setMessageError(false);
        setMessage(text)
    }


    useEffect(() => {
        const invalid = messageError || message_body === ''
        setCanSave(!invalid);
    }, [messageError, message_body])

    return (
        <View style={styles.formContainer}>
            {/* <Input
                label='First name'
                value={first_name}
                onChangeText={text => { onChangeFirstName(text) }}
                error={firstNameErr && '*first name must not be empty'}
            /> */}
            {/* <Input
                label='Last name'
                value={last_name}
                onChangeText={text => { onChangeLastName(text) }}
                error={lastNameErr && '*last name must not be empty'}
            /> */}
            <Input
                label='Email'
                value={email}
                onChangeText={setEmail}
                editable={false}
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
        </View>
    )
}

export default ContactUs;
const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFF',
        padding: normalize(20),
    },
    title: {
        fontSize: '0.95rem',
        fontFamily: 'graphik-medium',
        marginTop: normalize(9),
    },
    formContainer: {
        marginTop: '4rem'
    },
    messageBox: {
        paddingBottom: Platform.OS === 'ios' ? '5rem' : '3rem',
        paddingTop:'.8rem',
        paddingHorizontal: '.7rem',
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        color: '#00000080',
        fontSize: '0.75rem',
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical:'top'
    },
})
