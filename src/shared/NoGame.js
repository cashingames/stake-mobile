import React from 'react';
import { View, Text, Image, Platform } from 'react-native';
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import GoToStore from './GoToStore';
import AppButton from './AppButton';

const NoGame = ({ onClose, onPress }) => {
    const navigation = useNavigation();
    const visitStore = () => {
        onClose();
        navigation.navigate('GameStore')
    }

    const goHome = () => {
        onClose();
        navigation.navigate('Home')
    }

    return (
        <View style={styles.noGames}>
            <Image style={styles.sadEmoji}
                source={require('../../assets/images/sad-face-emoji.png')}

            />
            <Text style={styles.noGamesText}>Sorry,</Text>
            {Platform.OS === 'ios' ?
                <Text style={styles.noGamesText}>You have exhausted your free games</Text>
                :
                <Text style={styles.noGamesText}>You have exhausted your games</Text>
            }
            {Platform.OS === 'ios' ?
                <Text style={styles.noGamesText}>Please come back tomorrow and you will be rewarded with free games</Text>
                :
                <></>
            }

            {Platform.OS === 'ios' ?
                <>
                    <AppButton text="Go Home" onPress={goHome} />
                    {/* <Text style={styles.orText}>or</Text> */}
                    {/* <Text style={styles.stakeCashText}>Click on stake cash and stand a chance of winning double of the amount staked</Text>
                    <AppButton text="Stake Cash"  onPress={onPress} /> */}
                </>
                :
                <>
                    <GoToStore onPress={visitStore} />
                    {/* <Text style={styles.orText}>or</Text> */}
                    {/* <Text style={styles.stakeCashText}>Click on stake cash and stand a chance of winning double of the amount staked</Text>
                    <AppButton text="Stake Cash" style={styles.stakeButton} onPress={onPress} /> */}
                </>

            }
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
        paddingHorizontal: normalize(25),
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
        fontSize: normalize(14.5),
        // width: normalize(130),
        textAlign: 'center',
        color: '#000',
        lineHeight: normalize(24)
    },
    stakeCashText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(14.5),
        // width: normalize(130),
        textAlign: 'center',
        color: '#000',
        lineHeight: normalize(22)
    },
    orText: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(14),
        // width: normalize(130),
        textAlign: 'center',
        color: '#000',
    },
    stakeButton: {
        paddingVertical: normalize(12),
        paddingHorizontal: responsiveScreenWidth(30)
    }
})