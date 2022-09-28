import React from "react";
import { Text, View, Image } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import FundWalletComponent from "./FundWalletComponent";


const LowWalletBalance = ({ onClose }) => {
    return (
        <View style={styles.noGames}>
            <Image style={styles.sadEmoji}
                source={require('../../assets/images/sad-face-emoji.png')}
            />
            <Text style={styles.noGamesText}>Sorry,</Text>
            <Text style={styles.noGamesText}>You do not have enough balance to stake this amount</Text>
            <FundWalletComponent onClose={onClose} />
        </View>
    )
}

export default LowWalletBalance;

const styles = EStyleSheet.create({
    noGames: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        // justifyContent: 'center',
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
        // width: normalize(130),
        textAlign: 'center',
        color: '#000',
        lineHeight: normalize(24)
    },
})

