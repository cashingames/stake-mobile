import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import normalize from '../utils/normalize';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import GoToStore from './GoToStore';

const NoGame= ({ onClose }) => {
    const navigation = useNavigation();
    const visitStore = () => {
        onClose();
        navigation.navigate('GameStore')
    }
    return (
        <View style={styles.noGames}>
            <Image style={styles.sadEmoji}
                source={require('../../assets/images/sad-face-emoji.png')}

            />
            <Text style={styles.noGamesText}>Sorry,</Text>
            <Text style={styles.noGamesText}>You have exhausted your games</Text>
            <GoToStore onPress={visitStore} />
        </View>
    )
}

export default NoGame;

const styles = EStyleSheet.create({
    noGames: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
    },
    sadEmoji: {
        width: normalize(50),
        height: normalize(50),
        marginBottom: normalize(20)
    },
    needGames: {
        fontSize: normalize(12),
        fontFamily: 'graphik-regular',
        color: '#000',
        marginTop: normalize(15)
    },
    noGamesText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        width: normalize(130),
        textAlign: 'center',
        color: '#000',
        lineHeight: normalize(24)
    },
})