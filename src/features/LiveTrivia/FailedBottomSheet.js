import React, { useRef } from 'react';
import RBSheet from "react-native-raw-bottom-sheet";
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/core';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';


const FailedBottomSheet = ({ refBottomSheet, pointsRequired, onClose }) => {
    return (
        <RBSheet
            ref={refBottomSheet}
            closeOnDragDown={true}
            closeOnPressMask={true}
            height={350}
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
            <BottomSheet onClose={onClose} pointsRequired={pointsRequired} />
        </RBSheet>
    )
}
const BottomSheet = ({ pointsRequired, onClose }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.triviaBottomSheet}>
            <Ionicons name="warning-outline" size={100} color="#FFEE03" style={styles.bottomSheetIcon} />
            <Text style={styles.bottomSheetPoints}>Required Points : {pointsRequired}pts</Text>
            <Text style={styles.bottomSheetText}>Sorry you do not have enough points today
                to join this trivia, earn more points by playing more games to join this live trivia</Text>
            <AppButton onPress={onClose} text='Close' />
        </View>
    )
}

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

export default FailedBottomSheet