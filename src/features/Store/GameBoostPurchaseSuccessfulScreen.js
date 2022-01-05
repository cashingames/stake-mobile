import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

import AppButton from '../../shared/AppButton';
import normalize from '../../utils/normalize';

const GameBoostPurchaseSuccessfulScreen = () => {
    const user = useSelector(state => state.auth.user)
    const navigation = useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.image}>
                <Image
                    style={styles.thumbs}
                    source={require('../../../assets/images/thumbs_up.png')}
                />
            </View>
            <View style={styles.congratsText}>
                <Text style={styles.congratulations}>Congratulations!!!</Text>
                <Text style={styles.congratulations}>{user.firstName}</Text>
            </View>
            <Text style={styles.message}>You have successfully purchased a boost to play a game and climb up the leaderboard</Text>
            <View style={styles.congratsButtons}>
                <AppButton text={"Play a Game"} onPress={() => navigation.navigate('Game')} style={styles.actionButton} />
                <AppButton text={"Store"} onPress={() => navigation.navigate('GameStore')} style={styles.actionButton} />
            </View>
        </View>
    )
}
export default GameBoostPurchaseSuccessfulScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9C3DB8',
        paddingVertical: normalize(80),
        paddingHorizontal: normalize(20),
    },
    image: {
        alignItems: 'center',
        marginVertical: normalize(15)
    },
    thumbs: {
        width: normalize(60),
        height: normalize(65),
        marginVertical: normalize(10),
    },
    congratulations: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(30),
        color: '#FFFF',
        lineHeight: 50
    },
    congratsText: {
        alignItems: 'center',
        marginVertical: normalize(15)
    },
    message: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(15),
        textAlign: 'center',
        color: '#FFFF',
        lineHeight: 30,
        marginTop: normalize(35)
    },
    congratsButtons: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: normalize(45)
    },
    actionButton: {
        marginHorizontal: normalize(15),
        // width: normalize(80),
    }
});
