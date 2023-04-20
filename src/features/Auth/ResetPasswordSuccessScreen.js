import React from 'react';
import {
    StyleSheet,
    View,
    Image,
    Text,
} from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GaButton from '../../shared/GaButton';
import GameArkLogo from '../../shared/GameArkLogo';
import normalize from '../../utils/normalize';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';

export default ({ navigation }) => {
    useApplyHeaderWorkaround(navigation.setOptions);

    return (
        <MixedContainerBackground>
            <View style={styles.container}>
                <GameArkLogo />
                <SuccessText />
                <View style={styles.button}>
                    <GaButton onPress={() => navigation.navigate('Login')} text="Continue" />
                </View>
                <View style={styles.imgContainer}>
                    <Image source={require('../../../assets/images/wink-emoji.png')} />
                </View>
            </View>
        </MixedContainerBackground>
    );
}

const SuccessText = () => {
    return (
        <>
            <Text style={styles.headerTextStyle}>
                Successful!
            </Text>
            <Text style={styles.instructionTextStyle}>Password Updated Successfully!</Text>
        </>
    )
}

    ;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: normalize(50)
        // justifyContent: 'center',
    },
    headerTextStyle: {
        fontSize: '2.2rem',
        fontFamily: 'blues-smile',
        color: '#fff',
        textAlign: 'center',
        marginTop: normalize(48),
        marginBottom: normalize(10)
    },
    instructionTextStyle: {
        fontSize: '1rem',
        color: '#fff',
        fontFamily: 'blues-smile',
        lineHeight: 20,
        textAlign: 'center',
        marginVertical: normalize(5),
    },
    button: {
        // marginTop: normalize(25),
        width: normalize(280)
    },
    successImageStyle: {
        marginBottom: normalize(30),
    },
    imgContainer: {
        marginTop: normalize(20),
        alignItems: 'center'
    }
})