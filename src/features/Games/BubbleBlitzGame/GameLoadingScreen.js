import React from "react";
import { Image, ImageBackground, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../../../utils/normalize";

const GameLoadingScreen = () => {
    return (
        <ImageBackground resizeMode="cover" style={styles.gameCard} source={require('../../../../assets/images/loading-screen.png')}>
            {/* <View style={styles.container}>
                <Image resizeMode='contain' style={styles.cardImage} source={require('../../../../assets/images/bubble-logo.png')} />
                <View>
                    <Image style={styles.loader} source={require('../../../../assets/images/loading-bar.png')} />
                    <Text style={styles.loadingText}>Loading....</Text>
                </View>
            </View> */}
        </ImageBackground>

    )
}
export default GameLoadingScreen;

const styles = EStyleSheet.create({
    gameCard: {
        flex: 1,
        // justifyContent:'center',
        // alignItems:'center'
    },
    container : {
        marginTop:'8rem'
        // justifyContent:'center'
    },
    cardImage: {
        width: normalize(205),
        height: normalize(205),
        marginBottom:'8rem'
    },
    loader : {
        width: normalize(205),

    },
    loadingText: {
        fontSize: '1rem',
        fontFamily: 'pacifico-regular',
        color: '#fff',
        textAlign: 'center',
        textAlign: 'center',
    }
})