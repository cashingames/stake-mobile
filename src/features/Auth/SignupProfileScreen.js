import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Input from '../../shared/Input';
import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';
import { registerUser, setToken, } from './AuthSlice';
import { saveToken } from '../../utils/ApiHelper';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';


export default function SignupProfileScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();

    const userCredentials = useSelector(state => state.auth.createAccount);

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [username, setUsername] = useState('');
    const [referrer, setReferrer] = useState('');
    console.log(referrer)
    const [loading, setLoading] = useState(false);
    const [canSend, setCanSend] = useState(true);
    const [fNameErr, setFnameErr] = useState(false);
    const [lNameErr, setLnameErr] = useState(false);
    const [error, setError] = useState('');


    const onSend = () => {
        setLoading(true);

        registerUser({
            first_name: firstName,
            last_name: lastName,
            referrer: referrer,
            username: username,
            ...userCredentials
        }).then(response => {
            // saveToken(response.data.data)
            // dispatch(setToken(response.data.data))
            navigation.navigate('SignupVerifyEmail')
            // navigation.navigate('EmailVerified')

        }, err => {
            if (!err || !err.response || err.response === undefined) {
                setError("Your Network is Offline.");
            }
            else if (err.response.status === 500) {
                setError("Service not currently available. Please contact support");
            }
            else {
                const errors =
                    err.response && err.response.data && err.response.data.errors;
                const firstError = Object.values(errors, {})[0];
                setError(firstError[0])
            }
            setLoading(false);
        });
    }

    useEffect(() => {
        const nameRule = /\d/;
        const validFirstName = !nameRule.test(firstName)
        const validLastName = !nameRule.test(lastName)

        setFnameErr(!validFirstName);
        setLnameErr(!validLastName);

        setCanSend(validLastName && validFirstName);

    }, [firstName, lastName, username])


    return (
        <ScrollView style={styles.container}>

            <Text style={styles.headerTextStyle}>
                Let's get to know you
            </Text>

            <Text style={styles.instructionTextStyle}>Input your first and last name below:</Text>

            <View style={styles.form} >
                {error.length > 0 &&
                    <Text style={styles.errorBox}>{error}</Text>
                }
                <Input
                    label='First Name'
                    placeholder="John"
                    value={firstName}
                    error={fNameErr && "First name can't have numbers"}
                    onChangeText={setFirstName}
                />

                <Input
                    label='Last Name'
                    placeholder="Doe"
                    value={lastName}
                    error={lNameErr && "Last name can't have numbers"}
                    onChangeText={setLastName}
                />

                <Input
                    label='Username'
                    placeholder="johnDoe"
                    value={username}
                    onChangeText={setUsername}
                />

                <Input
                    label='Referral Code (optional)'
                    value={referrer}
                    onChangeText={setReferrer}
                />

            </View>

            <View style={styles.button}>
                <AppButton text={loading ? 'Creating...' : 'Create account'} onPress={onSend} disabled={!canSend || loading} />
            </View>

        </ScrollView>
    )
}

// const CreateAccountButton = () => {
//     const refRBSheet = useRef();
//     return (

//         <Pressable activeOpacity={0.8} onPress={() => refRBSheet.current.open(onSend)} disabled={!canSend || loading}
//             style={styles.storeItemContainer}>
//             <Text>{loading ? 'Creating...' : 'Create account'}</Text>
//             <RBSheet
//                 ref={refRBSheet}
//                 closeOnDragDown={true}
//                 closeOnPressMask={true}
//                 height={440}
//                 customStyles={{
//                     wrapper: {
//                         backgroundColor: "rgba(0, 0, 0, 0.5)"
//                     },
//                     draggableIcon: {
//                         backgroundColor: "#000",
//                     },
//                     container: {
//                         borderTopStartRadius: 25,
//                         borderTopEndRadius: 25,
//                     }
//                 }}
//             >
//                 <FirstTimeUserBonus onClose={() => refRBSheet.current.close()} />
//             </RBSheet>
//         </Pressable>

//     )
// }


const FirstTimeUserBonus = ({ onClose }) => {
    const navigation = useNavigation();
    const goToDashboard = () => {
        onClose()
        navigation.navigate("Home")
    }
    return (
        <>
            <View style={styles.headerContainer}>
                <Text style={styles.userDetails}>Congrats, John</Text>
                <Text style={styles.rewardHeaderText}>You have been rewarded with a starter bundle</Text>
            </View>
            <FirstTimeUserRewards />
            <AppButton text={'Proceed to Dashboard'} onPress={goToDashboard} />
        </>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingTop: normalize(25),
        paddingHorizontal: normalize(15),
    },
    headerTextStyle: {
        fontSize: 26,
        fontFamily: 'graphik-bold',
        color: 'black',
    },
    title: {
        marginRight: normalize(60)
    },
    description: {
        color: '#CDD4DF',
        marginTop: normalize(20),
        marginBottom: normalize(40),
        fontFamily: 'graphik-regular'
    },
    form: {
        marginTop: normalize(30),
        marginBottom: normalize(60)
    },

    errorBox: {
        marginVertical: normalize(20),
        backgroundColor: '#F442741A',
        paddingVertical: normalize(6),
        borderRadius: normalize(8),
        textAlign: 'center',
        fontFamily: 'graphik-regular',
        color: '#EF2F55',
        fontSize: normalize(10)
    },
    button: {
        marginBottom: normalize(20)
    },
    instructionTextStyle: {
        fontSize: 14,
        color: 'rgba(0, 0, 0, 0.6)',
        fontFamily: 'graphik-regular',
        lineHeight: 20,
        marginTop: normalize(15),
    },
});
