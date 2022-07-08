import React from 'react';
import RBSheet from "react-native-raw-bottom-sheet";
import { View, Text, Pressable, Image } from 'react-native';
import normalize from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import AppButton from './AppButton';
import LottieAnimations from './LottieAnimations';


const ChallengeInviteSent = ({ onClose, refBottomSheet }) => {

    return (
        <RBSheet
            ref={refBottomSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={420}
            customStyles={{
                wrapper: {
                    backgroundColor: "rgba(0, 0, 0, 0.5)"
                },
                draggableIcon: {
                    backgroundColor: "#000",
                },
                container: {
                    borderTopStartRadius: 25,
                    borderTopEndRadius: 25,
                }
            }}
        >
            <InviteSuccessText onClose={onClose} />
        </RBSheet>

    )
}

const InviteSuccessText = ({ onClose }) => {
    const navigation = useNavigation();
    const goHome = () => {
        onClose();
        navigation.navigate('Home')
    }
    return (
        <View style={styles.successText}>
            <LottieAnimations
                animationView={require('../../assets/friends.json')}
                width={normalize(120)}
                height={normalize(120)}
            />
            <Text style={styles.congratsText}>Congratulations</Text>
            <Text style={styles.innerText}>Your invite was sent successfully</Text>
                <Text style={styles.innerText}>You would receive an email stating that your opponent has accepted your invite</Text>
            <Text style={styles.innerText}>Click on the link in the email to start the challenge</Text>
            <ReturnToDashboard onPress={goHome} />
        </View>
    )
}

const ReturnToDashboard = ({ onPress }) => {
    return (
        <AppButton text="Go to Dashboard" onPress={onPress} />
    )
}

export default ChallengeInviteSent;

const styles = EStyleSheet.create({
    successText: {
        paddingHorizontal: normalize(18),
        alignItems: 'center'
    },
    innerText: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(16),
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.6)',
        opacity: 0.8,
        lineHeight: normalize(30)
    },
    congratsText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(20),
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.6)',
        opacity: 0.8,
        lineHeight: normalize(30)
    },
})
