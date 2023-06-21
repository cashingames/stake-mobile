import { unwrapResult } from "@reduxjs/toolkit";
import React, { useEffect, useState } from "react";
import { Alert, Platform, Pressable, ScrollView, Text, TextInput, View, Linking } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useDispatch } from "react-redux";
import AppButton from "../../shared/AppButton";
import Input from "../../shared/Input";
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import { sendUserFeedback } from "../CommonSlice";
import { useNavigation } from '@react-navigation/native';
import logToAnalytics from "../../utils/analytics";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";



const AuthContactUs = ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);

    return (
        <ScrollView style={styles.container}>
            <View style={styles.headerContainerStyle}>
                <Ionicons name="chevron-back" size={22} color="#072169" onPress={() => navigation.navigate('Login')} />
                <Text style={styles.headerTextStyle}>
                    Support
                </Text>
            </View>
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
                Alert.alert('Thanks for your feedback. You would be responded to shortly')
                logToAnalytics("user_sent_feedback_from_auth_screens", {
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
                style={styles.buttonStyle}
            />
                <Pressable style={styles.whatsappChat} onPress={() => Linking.openURL('https://wa.me/2348025116306')}>
                <Text style={styles.whatsappTitle}>Live chat with a support agent on Whatsapp</Text>
                <FontAwesome5 name="whatsapp" size={30} color="#25D366" style={styles.icon}
                     />
            </Pressable>
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
        color: '#072169',
        marginLeft: '2.5rem',
        textAlign: 'center'
        // paddingTop: normalize(10),
    },
    title: {
        fontSize: '1rem',
        fontFamily: 'sansation-regular',
        marginTop: normalize(40),
        color: '#072169',

    },
    formContainer: {
        marginTop: '3rem'
    },
    messageBox: {
        paddingBottom: Platform.OS === 'ios' ? '5rem' : '3rem',
        paddingTop: '.8rem',
        paddingHorizontal: '.7rem',
        borderColor: '#CDD4DF',
        fontFamily: 'sansation-regular',
        color: '#00000080',
        fontSize: '0.85rem',
        borderWidth: 1,
        borderRadius: 10,
        textAlignVertical: 'top',
        backgroundColor:'#fff'
    },
    goBack: {
        fontSize: '.7rem',
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
        textAlign: 'center'
    },
    buttonStyle: {
        marginBottom: 0
    },
    whatsappChat: {
        display:"flex",
        flexDirection:'row',
        alignItems:'center',
        marginBottom: responsiveScreenWidth(40)

    },
    whatsappTitle: {
        fontSize: '0.85rem',
        fontFamily: 'graphik-medium',
        marginTop: normalize(9),
        marginRight:'.5rem'
    },
    icon: {
        marginTop:'.5rem'
    }
})
