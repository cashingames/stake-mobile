import React from "react";
import { View, Text, Image, StatusBar } from "react-native";
import AppButton from "../../shared/AppButton";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from "../../utils/normalize";



const AcceptDeclineDuel = () => {
    const opponentName = "Mary"
    return (
        <>
            <StatusBar barStyle="light-content" backgroundColor="#072169" />
            <View style={styles.container}>
                <View style={styles.imageHeader}>
                    <Image
                        style={styles.image}
                        source={require("../../../assets/images/splash2.png")}
                    />
                </View>
                <Text style={styles.requestHeader}>{opponentName} has invited you to a challenge</Text>
                <Text style={styles.acceptText}>Click on the accept button to accept the invite and start the challenge</Text>
                <Text style={styles.acceptText}>Or</Text>
                <Text style={styles.acceptText}>Click on the decline button to decline the invite</Text>
                <View style={styles.buttonContainer}>
                    <AppButton text="Accept" style={styles.button} />
                    <AppButton text="Decline" style={styles.button} />
                </View>
            </View>
        </>
    )
}
export default AcceptDeclineDuel;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#072169',
        paddingHorizontal: normalize(18),
        paddingVertical: normalize(20),
        justifyContent: 'center'
    },
    imageHeader: {
        alignItems: 'center'
    },
    image: {
        width: normalize(250),
        height: normalize(130),
    },
    requestHeader: {
        fontSize: '1.2rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
        marginBottom: normalize(25)
    },
    acceptText: {
        fontSize: '0.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        textAlign: 'center',
        lineHeight: '1.5rem',
        marginVertical: normalize(8)
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'center'
    },
    button: {
        marginRight: normalize(18)
    }
})
