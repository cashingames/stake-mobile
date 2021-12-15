import React, { useEffect } from 'react';
import { StyleSheet, Text, View, Image, Pressable } from 'react-native';
import normalize from '../../utils/normalize';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

const PurchaseSuccessfulScreen = () => {
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
            {/* <View style={styles.congratsButtons}>
                <Pressable onPress={() => navigation.navigate('Game')} style={styles.optionButton}>
                    <Text style={styles.nextButton}>Play a Game</Text>
                </Pressable>
                <Pressable onPress={() => navigation.navigate('GameStore')} style={styles.optionButton}>
                    <Text style={styles.nextButton}>Go to Store</Text>
                </Pressable>
            </View> */}
        </View>
    )
}
export default PurchaseSuccessfulScreen;


const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems:'center',
        backgroundColor: '#9C3DB8',
        paddingVertical: normalize(80),
        paddingHorizontal: normalize(20),
        // justifyContent: 'center's
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
        alignItems:'center',
        marginVertical: normalize(15)
    },
    message: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(15),
        textAlign:'center',
        color: '#FFFF',
        lineHeight: 30,
        marginTop: normalize(35)
    },
    congratsButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: normalize(45)
    },
    optionButton: {
        backgroundColor: '#EF2F55',
        width: normalize(100),
        // height: normalize(30),
        paddingVertical: normalize(15),
        borderRadius: 8,
        alignItems: 'center',
    },
    nextButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        textAlign:'center',
        color: '#FFFF',
    }
});
