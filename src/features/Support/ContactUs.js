import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { FontAwesome5 } from "@expo/vector-icons";
import { Alert, Linking, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import AppButton from "../../shared/AppButton";
import Input from "../../shared/Input";
import normalize from "../../utils/normalize";
import { sendUserFeedback } from "../CommonSlice";
import logToAnalytics from "../../utils/analytics";
import CustomAlert from "../../shared/CustomAlert";



const ContactUs = () => {
    const user = useSelector(state => state.auth.user);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');


    const startModal = () => {
        setModalVisible(true)
    }

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Do you have any question?</Text>
            <ContactForm user={user} setAlertMessage={setAlertMessage} startModal={startModal} />
            <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                 textLabel={alertMessage} buttonLabel='Ok, got it'
                alertImage={require('../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} />
        </ScrollView>
    )
}

const ContactForm = ({ user, setAlertMessage, startModal }) => {
    const dispatch = useDispatch();
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [message_body, setMessage] = useState('');
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
            .then(result => {
                startModal()
                setAlertMessage('Thanks for your feedback. You would be responded to shortly');
                logToAnalytics("user_sent_feedback", {
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
                startModal()
                setAlertMessage(rejectedValueOrSerializedError.message);
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
            <AppButton
                text={saving ? 'Sending' : 'Send'}
                onPress={sendFeedback}
                disabled={!canSave || saving}
            />
            <Pressable style={styles.whatsappChat} onPress={() => Linking.openURL('https://wa.me/2348025116306')}>
                <Text style={styles.whatsappTitle}>Live chat with a support agent on Whatsapp</Text>
                <FontAwesome5 name="whatsapp" size={30} color="#25D366" style={styles.icon}
                />
            </Pressable>
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
        marginTop: '2rem'
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
    whatsappChat: {
        display: "flex",
        flexDirection: 'row',
        alignItems: 'center'
    },
    whatsappTitle: {
        fontSize: '0.85rem',
        fontFamily: 'graphik-medium',
        marginTop: normalize(9),
        marginRight: '.5rem'
    },
    icon: {
        marginTop: '.5rem'
    }
})
