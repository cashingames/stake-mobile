import React from "react";
import { Text, View } from "react-native";
import AppButton from "../../shared/AppButton";
import EStyleSheet from 'react-native-extended-stylesheet';
import { Ionicons } from '@expo/vector-icons';
import normalize from "../../utils/normalize";


const LiveTriviaEntryFailedText = ({ onClose, userPoints, pointsRequired }) => {
    return (
        <View style={styles.triviaBottomSheet}>
            <Ionicons name="warning-outline" size={100} color="#FFEE03" style={styles.bottomSheetIcon} />
            <Text style={styles.bottomSheetPoints}>Required Points : {pointsRequired}pts</Text>
            <Text style={styles.bottomSheetPoints}>Your points gained today : {userPoints}pts</Text>

            <Text style={styles.bottomSheetText}>
                Play more fun games to qualify to play this live trivia.
            </Text>
            <AppButton onPress={onClose} text='Close' />
        </View>
    )
}
export default LiveTriviaEntryFailedText;

const styles = EStyleSheet.create({
    triviaBottomSheet: {
        flex: 1,
        // alignItems: 'center'
        paddingHorizontal: normalize(20),
        paddingTop: normalize(20)
    },
    bottomSheetText: {
        color: 'rgba(0, 0, 0, 0.6)',
        opacity: 0.8,
        fontFamily: 'graphik-regular',
        fontSize: '0.8rem',
        marginTop: normalize(10),
        alignItems: 'center',
        textAlign: 'center',
        lineHeight: '1.2rem'
    },
    bottomSheetPoints: {
        color: 'rgba(0, 0, 0, 0.6)',
        opacity: 0.8,
        fontFamily: 'graphik-regular',
        fontSize: '0.8rem',
        marginTop: normalize(10),
        alignItems: 'center',
        textAlign: 'center',
    },
    bottomSheetIcon: {
        textAlign: 'center'
    }
})