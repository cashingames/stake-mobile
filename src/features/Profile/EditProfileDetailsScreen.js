import React, { useState, useEffect } from 'react';
import { Text, View, ScrollView, Alert, Pressable, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import DateTimePicker from '@react-native-community/datetimepicker';
import Input from '../../shared/Input';
import { editPersonalDetails, getUser } from '../Auth/AuthSlice';
import normalize, { responsiveScreenHeight } from '../../utils/normalize';
import { isTrue } from '../../utils/stringUtl';
import AppButton from '../../shared/AppButton';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import useSound from '../../utils/useSound';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GameArkLogo from '../../shared/GameArkLogo';
import GaButton from '../../shared/GaButton';
import { setModalOpen } from '../CommonSlice';
import { Image } from 'react-native';

const chooseGender = [
    {
        id:1,
        myGender:'Male'
    },
    {
        id:2,
        myGender:'Female'
    }
]

export default function EditProfileDetailsScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user);
    const [saving, setSaving] = useState(false);
    const [email, setEmail] = useState(user.email);
    const [username, setUsername] = useState(user.username);
    const [canSave, setCanSave] = useState(false);
    const [dateOfBirth, setDateOfBirth] = useState(isTrue(user.dateOfBirth) ? new Date(Date.parse(user.dateOfBirth)) : new Date(2003, 0, 1));
    const [gender, setGender] = useState(user.gender);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [usernameErr, setUsernameError] = useState(false);
    const [show, setShow] = useState(false);
    const { playSound } =  useSound(require('../../../assets/sounds/updated.mp3'))

    const onChangeDateOfBirth = (event, selectedDate) => {
        const currentDate = selectedDate || dateOfBirth;
        setDateOfBirth(currentDate);
        setShowDatePicker(false);
    };

    const onChangeUserName = (text) => {
        text.length > 0 && text.length < 5 ? setUsernameError(true) : setUsernameError(false);
        setUsername(text)
    }
    useEffect(() => {
        const usernameRule = /^[a-zA-Z][a-zA-Z0-9]+$/;
        if(username){
            const validUsername = !usernameRule.test(username)
            setUsernameError(validUsername);
        }else{
            setUsernameError('')
        }
    }, [ username, usernameErr, setUsernameError])
    useEffect(() => {
        const invalid = username < 3;
        setCanSave(!invalid);
    }, [])

    const onSavePersonalDetails = () => {
        setSaving(true);
        dispatch(editPersonalDetails({
            username,
            email,
            dateOfBirth,
            gender
        }))
            .then(unwrapResult)
            .then(result => {
                dispatch(getUser())
                playSound()
                Alert.alert('Personal details updated successfully')
                navigation.navigate("UserProfile")
            })
            .catch((rejectedValueOrSerializedError) => {
                if (rejectedValueOrSerializedError.message === "Request failed with status code 422") {
                    Alert.alert('The phone number has already been taken')
                }
                else {
                    Alert.alert("Could not update profile, Please try again later.");
                }
                console.log(rejectedValueOrSerializedError.message);
                setSaving(false);
                // after login eager get commond data for the whole app
                // console.log("failed");
                // console.log(rejectedValueOrSerializedError.message);
            });
    }

    const selectGender = (myGender) => {
       setGender(myGender)
    }

    return (
        <MixedContainerBackground>
        <View style={styles.container}>
        <GameArkLogo />
        <Text style={styles.title}>Edit Details</Text>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.content}>
                    <Input
                        label='Username'
                        value={username}
                        editable={true}
                        labelStyle={styles.inputLabel}
                        error={usernameErr && '*Username is invalid. It must start with an alphabet and have more than 2 characters'}
                        onChangeText={text => onChangeUserName(text)}
                    />
                    <Input
                        label='Email'
                        value={email}
                        onChangeText={setEmail}
                        editable={true}
                        labelStyle={styles.inputLabel}
                    />

                    <View style={styles.detail}>

                        {!showDatePicker ?
                            <Input
                                label='Date of Birth'
                                value={dateOfBirth.toDateString()}
                                onPressIn={() => setShowDatePicker(true)}
                                labelStyle={styles.inputLabel}
                            />

                            :
                            <>
                                <Text style={styles.inputLabel}>Date of Birth</Text>
                                <DateTimePicker
                                    value={dateOfBirth}
                                    mode={"date"}
                                    display="default"
                                    onChange={onChangeDateOfBirth}
                                    maximumDate={new Date(2010, 11, 31)}
                                    style={styles.dateOfBirth}
                                    textColor='#00000080'
                                />
                            </>
                        }

                        {/* <View style={styles.detail}> */}
                            <Text style={styles.inputLabel}>Select Gender</Text>
                            <View style={styles.genderBox}>
                           {chooseGender.map((item)=>{
                            const { myGender, id} = item
                            return(
                                <Pressable key={id} style={[styles.genderBtn, {backgroundColor: gender === myGender ? 'blue': 'white'}]} 
                                onPress={()=>selectGender(myGender)}>
                                    <Text style={[styles.genderText, {color:gender === myGender ? '#fff' : '#15397D'}]}>{myGender}</Text>
                                </Pressable>
                            )
                           })}
                            </View>
                        {/* </View> */}
                    </View>
                </View>
                <GaButton
                text={saving ? 'Saving' : 'Save Changes'}
                onPress={onSavePersonalDetails}
                disabled={!canSave}
                style={styles.saveButton} />
            </ScrollView>
            
                <Pressable onPress={() => {
                        navigation.goBack(null)
                        dispatch(setModalOpen(false))}}>
                        <Image style={styles.settingIcon} source={require('../../../assets/images/close-icon.png')} />
                    </Pressable>
        </View>
        </MixedContainerBackground>
    );
}


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
        paddingBottom: normalize(20),
    },
    contentContainer: {
        paddingTop: normalize(20),
    },
    inputLabel: {
        fontFamily: 'blues-smile',
        color: '#fff',
        fontSize: '0.76rem',
        marginBottom: normalize(8)
    },
    dateOfBirth: {
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        borderRadius: 8,
        paddingLeft: normalize(6),
        width: normalize(285),
        fontSize: '0.75rem',
        fontFamily: 'graphik-regular',
        color: '#00000080',
        marginRight: 'auto',
    },
    title:{
        textAlign:'center',
        color:"#fff",
        fontFamily:'blues-smile',
        fontSize: '2rem',
        marginVertical:'1rem'
    },
    detail: {
        marginVertical: normalize(10)
    },
    select: {
        color: '#000000B2',
        borderWidth: 1,
        borderColor: '#CDD4DF',
        backgroundColor: "#ebeff5",
    },
    pickerItem: {
        fontSize: '0.75rem',
        fontFamily: 'blues-smile'
    },
    saveButton: {
        marginVertical: 10,
    },
    phonePicker: {
        flexDirection: 'row',
        height: normalize(38),
        alignItems: 'center',
        marginBottom:'.8rem'
    },
    codeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderRightWidth: 1,
    },
    genderBox:{
        flexDirection:'row',
        justifyContent:'space-between'
    },
    genderBtn:{
        backgroundColor:'white',
        width:'45%',
        paddingHorizontal:'2rem',
        alignItems:'center',
        justifyContent:'center',
        height:38,
        borderRadius:30
    },
    genderText:{
        fontFamily:'graphik-medium'
    },
    settingIcon: {
        marginTop:responsiveScreenHeight(10),
        width: 50,
        height: 50
    },
});
