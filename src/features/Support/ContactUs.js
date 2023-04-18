import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Alert, Platform, ScrollView, Text, TextInput, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import AppButton from "../../shared/AppButton";
import Input from "../../shared/Input";
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from "../../utils/normalize";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import { getUser } from "../Auth/AuthSlice";
import { sendUserFeedback } from "../CommonSlice";
import analytics from '@react-native-firebase/analytics';
import MixedContainerBackground from "../../shared/ContainerBackground/MixedContainerBackground";
import AppHeader from "../../shared/AppHeader";
import GaButton from "../../shared/GaButton";
import TopIcons from "../../shared/TopIcons";



const ContactUs = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const user = useSelector(state => state.auth.user);

    return (
        <MixedContainerBackground>
            <ScrollView style={styles.container}>
                <TopIcons />
                <AppHeader title='Help Center' />
                <View style={styles.contact}>
                    <Text style={styles.title}>How can we be of help to you today?</Text>
                    <ContactForm user={user} />
                </View>
            </ScrollView>
        </MixedContainerBackground>

    )
}

const ContactForm = ({ user }) => {
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [message_body, setMessage] = useState('');
    const [messageError, setMessageError] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const first_name = user.firstName
    const last_name = user.lastName
    console.log(email)

    const sendFeedback = () => {
        setSaving(true)
        dispatch(sendUserFeedback({
            first_name,
            last_name,
            email,
            username: user.username,
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
            <GaButton
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
        paddingVertical: responsiveScreenHeight(2),
    },
    contact:{
        paddingHorizontal: responsiveScreenWidth(3),
    },
    title: {
        fontSize: '0.95rem',
        fontFamily: 'graphik-medium',
        marginTop: normalize(9),
        color: '#fff'
    },
    formContainer: {
        marginTop: '1rem'
    },
    messageBox: {
        paddingBottom: Platform.OS === 'ios' ? '5rem' : '3rem',
        paddingTop: '.8rem',
        paddingHorizontal: '.7rem',
        borderColor: '#CDD4DF',
        fontFamily: 'graphik-regular',
        color: '#000',
        fontSize: '0.75rem',
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top',
        backgroundColor: '#FFFF',

    },
})
