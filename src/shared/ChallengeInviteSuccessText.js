import React from "react";
import { Text, View } from "react-native";
import LottieAnimations from "./LottieAnimations";
import EStyleSheet from 'react-native-extended-stylesheet';
import { useNavigation } from '@react-navigation/native';
import normalize from "../utils/normalize";
import AppButton from "./AppButton";


const ChallengeInviteSuccessText = ({ onClose }) => {
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
            <Text style={styles.innerText}>You will receive a notification on the app and your email when your opponent accepts your invite.</Text>
            <Text style={styles.innerText}>You will be able to start the challenge when your opponent accepts the challenge.</Text>
            <ReturnToDashboard onPress={goHome} />
        </View>
    )
}

const ReturnToDashboard = ({ onPress }) => {
    return (
        <AppButton text="Return to Home" onPress={onPress} />
    )
}
export default ChallengeInviteSuccessText;

const styles = EStyleSheet.create({
    successText: {
        paddingHorizontal: normalize(18),
        alignItems: 'center',
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