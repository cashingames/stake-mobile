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
            <Text style={styles.congratsText}>Congrats! Challenge sent</Text>
            <Text style={styles.innerText}>Wait for an In-App notification and email when opponent accepts challenge</Text>
            <Text style={styles.innerText}>Then you can start playing.</Text>
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