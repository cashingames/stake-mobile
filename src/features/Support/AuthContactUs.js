import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Platform, Pressable, ScrollView, Text, TextInput, View, Linking } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch } from "react-redux";
import AppButton from "../../shared/AppButton";
import Input from "../../shared/Input";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { sendUserFeedback } from "../CommonSlice";
import logToAnalytics from "../../utils/analytics";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import CustomAlert from "../../shared/CustomAlert";
import { Image } from "react-native";



const AuthContactUs = ({ navigation }) => {
    const dispatch = useDispatch();

    const [modalVisible, setModalVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [saving, setSaving] = useState(false);
    const [canSave, setCanSave] = useState(false);
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [message_body, setMessage] = useState('');




    const startModal = () => {
        setModalVisible(true)
    }

    const close = () => {

    }

    const sendFeedback = () => {
        setSaving(true)
        dispatch(sendUserFeedback({
            first_name,
            last_name,
            email,
            phone,
            message_body,
        }))
            .then(unwrapResult)
            .then(result => {
                startModal()
                setAlertMessage('Thanks for your feedback. You would be responded to shortly');
                logToAnalytics("user_sent_feedback_from_auth_screens", {
                    'id': first_name,
                    'email': email
                })
                setMessage('')
                setFirstName('')
                setLastName('')
                setPhone('')
                setSaving(false)
            })
            .catch((rejectedValueOrSerializedError) => {
                setMessage('')
                setFirstName('')
                setLastName('')
                setSaving(false)
                startModal()
                setAlertMessage(rejectedValueOrSerializedError.message);
            });

    }

    return (
        <View style={styles.container}>
            <ScrollView >
                <View style={styles.headerContainerStyle}>
                    <Ionicons name="chevron-back" size={22} color="#1C453B" onPress={() => navigation.navigate('Login')} />
                    <Text style={styles.headerTextStyle}>
                        Support
                    </Text>
                </View>
                <Text style={styles.title}>Do you have any question? Write to us</Text>
                <Pressable style={styles.whatsappChat} onPress={() => Linking.openURL('https://wa.me/2348025116306')}>
                    <Image
                        source={require('../../../assets/images/whatsapp-icon.png')}
                        style={styles.icon}
                    />
                    <View style={styles.textContainer}>
                        <View style={styles.headerContainer}>
                            <Text style={styles.header}>Need live help</Text>
                            <Ionicons name="chevron-forward" size={22} color='#1C453B' />
                        </View>
                        <Text style={styles.whatsappTitle}>Live chat with support on Whatsapp</Text>
                    </View>
                </Pressable>
                <ContactForm setCanSave={setCanSave} first_name={first_name} setFirstName={setFirstName} last_name={last_name} setLastName={setLastName}
                    email={email} setEmail={setEmail} message_body={message_body} setMessage={setMessage} phone={phone} setPhone={setPhone}
                />

                <CustomAlert modalVisible={modalVisible} setModalVisible={setModalVisible}
                    textLabel={alertMessage} buttonLabel='Ok, got it'
                    alertImageVisible={true} doAction={close} />
            </ScrollView>
            <AppButton
                text={saving ? 'Sending' : 'Send'}
                onPress={sendFeedback}
                disabled={!canSave || saving}
                style={styles.buttonStyle}
            />
        </View>
    )
}

const ContactForm = ({ setCanSave, first_name, setFirstName, last_name, setLastName, email,
    setEmail, message_body, setMessage, phone, setPhone }) => {

    const [emailErr, setEmailError] = useState(false);
    const [firstNameErr, setFirstNameError] = useState(false);
    const [lastNameErr, setLastNameError] = useState(false);
    const [phoneErr, setPhoneError] = useState(false);
    const [messageError, setMessageError] = useState(false);


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
    const onChangePhone = (text) => {
        text.length > 0 && text.length < 10 ? setPhoneError(true) : setPhoneError(false);
        setPhone(text)
    }


    useEffect(() => {
        const invalid = messageError || message_body === '' || firstNameErr || first_name === '' ||
            lastNameErr || last_name === '' || emailErr || email === '' || phoneErr || phone === ''
        setCanSave(!invalid);
    }, [messageError, message_body, phoneErr, phone])

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
            <Input
                label='Phone number'
                value={phone}
                onChangeText={text => { onChangePhone(text) }}
                error={phoneErr && '*please input a valid phone number'}
                type="phone"
                maxLength={11}
                keyboardType='numeric'

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


        </View>
    )
}

export default AuthContactUs;
const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingHorizontal: normalize(20),
        paddingTop: Platform.OS === 'ios' ? responsiveScreenWidth(22) : responsiveScreenWidth(15),

    },
    headerContainerStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'gotham-bold',
        color: '#1C453B',
        marginLeft: '2.5rem',
        textAlign: 'center'
        // paddingTop: normalize(10),
    },
    title: {
        fontSize: '.9rem',
        fontFamily: 'sansation-bold',
        marginTop: normalize(15),
        color: '#1C453B',

    },
    formContainer: {
        marginTop: '1rem',
        marginBottom: responsiveScreenWidth(10)
    },
    messageBox: {
        paddingBottom: Platform.OS === 'ios' ? '5rem' : '3rem',
        paddingTop: '.8rem',
        paddingHorizontal: '.7rem',
        borderColor: '#CDD4DF',
        fontFamily: 'sansation-regular',
        color: '#1C453B',
        fontSize: '0.85rem',
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top',
        backgroundColor: '#fff'
    },
    goBack: {
        fontSize: '.7rem',
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
        textAlign: 'center'
    },
    buttonStyle: {
        marginBottom: '3rem'
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
        marginTop: '1rem'
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
