import React from 'react';
import { StyleSheet,  Text, TouchableOpacity, View } from 'react-native';
import normalize from '../utils/normalize';

const SocialSigninDivider = ({signInText}) => {
    return (
        <View style={styles.divider}>
            <View style={styles.hr}><Text></Text></View>
            <Text style={styles.signUpOption}>  Or {signInText} using  </Text>
            <View style={styles.hr} />
        </View>
    )
}

const styles = StyleSheet.create({

    divider: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    hr: {
        borderBottomColor: '#CDD4DF',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(41),
        marginBottom: normalize(5)
    },
    signUpOption: {
        color: 'rgba(0, 0, 0, 0.5)',
        marginTop: normalize(15),
        marginHorizontal: normalize(25),
        fontFamily: 'graphik-medium'
    },
});
export default SocialSigninDivider;
