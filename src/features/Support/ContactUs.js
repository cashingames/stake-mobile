import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { Linking, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch, useSelector } from "react-redux";
import AppButton from "../../shared/AppButton";
import Input from "../../shared/Input";
import normalize from "../../utils/normalize";
import { sendUserFeedback } from "../CommonSlice";
import logToAnalytics from "../../utils/analytics";
import CustomAlert from "../../shared/CustomAlert";
import { Image } from "react-native";



const ContactUs = () => {
    const user = useSelector(state => state.auth.user);
    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');


    const startModal = () => {
        setModalVisible(true)
    }

    const close = () => {

    }

    return (
        <View style={styles.container}>
            <ScrollView >
                <Text style={styles.title}>Do you have any question?</Text>
                <ContactForm user={user} setAlertMessage={setAlertMessage} startModal={startModal} />
                <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                    textLabel={alertMessage} buttonLabel='Ok, got it'
                    alertImage={require('../../../assets/images/target-dynamic-color.png')} alertImageVisible={true} doAction={close} />
            </ScrollView>
            <Pressable style={styles.whatsappChat} onPress={() => Linking.openURL('https://wa.me/2348025116306')}>
                <Image
                    source={require('../../../assets/images/whatsapp-icon.png')}
                    style={styles.icon}
                />
                <View style={styles.textContainer}>
                    <View style={styles.headerContainer}>
                        <Text style={styles.header}>Contact Support</Text>
                        <Ionicons name="chevron-forward" size={22} color='#072169' />
                    </View>
                    <Text style={styles.whatsappTitle}>Live chat with support on Whatsapp</Text>
                </View>
            </Pressable>
        </View>
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

        </View>
    )
}

export default ContactUs;
const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
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
        alignItems: 'center',
        backgroundColor: '#FFF',
        borderRadius: 13,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        paddingVertical: '.5rem',
        paddingHorizontal: '.5rem',
        marginBottom:'2rem'
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
        color: '#072169'
    },
    whatsappTitle: {
        fontSize: '0.8rem',
        fontFamily: 'sansation-regular',
        marginTop: normalize(3),
        color: '#072169'
    },
    icon: {
        width: 55,
        height: 55,
        marginRight: '.4rem'
    }
})
