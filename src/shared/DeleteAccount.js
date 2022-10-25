import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import normalize from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import AppButton from './AppButton';

const DeleteAccount = ({ onPressYes, onClose }) => {
    return (
        <View style={styles.deleteContainer}>
            <Text style={styles.deleteText}>Are you sure you want to delete your account?</Text>
            <View style={styles.buttonContainer}>
                <AppButton text="Delete" onPress={onPressYes} style={styles.deleteButton} />
                <AppButton text="Cancel" onPress={onClose} />
            </View>

        </View>
    )
}
export default DeleteAccount;

const styles = EStyleSheet.create({
    deleteContainer: {
        alignItems: 'center',
        paddingTop: '1.5rem'
    },
    noGamesText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        width: normalize(130),
        textAlign: 'center',
        color: '#000',
        lineHeight: normalize(24)
    },
    deleteText: {
        fontSize: '.9rem',
        fontFamily: 'graphik-regular',
        color: '#000',
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: '1rem'
    },
deleteButton: {
    marginRight:'1rem'
}
})