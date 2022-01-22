import React from 'react';
import { Text, View } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const SocialSigninDivider = ({ signInText }) => {
    return (
        <View style={styles.divider}>
            <View style={styles.hr}><Text></Text></View>
            <Text style={styles.signUpOption}>  Or {signInText} using  </Text>
            <View style={styles.hr} />
        </View>
    )
}

const styles = EStyleSheet.create({

    divider: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    hr: {
        height: 2,
        flex: 1,
        backgroundColor: '#CDD4DF',
    },
    signUpOption: {
        flex: 2,
        textAlign: 'center',
        color: 'rgba(0, 0, 0, 0.5)',
        fontFamily: 'graphik-medium',
    },
});
export default SocialSigninDivider;
