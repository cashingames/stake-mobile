import React from "react";
import { Pressable, Text, View } from "react-native";
import LottieAnimations from "./LottieAnimations";
import { useSelector } from 'react-redux';
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";

const BoostsInfo = ({ onPress }) => {
    const boosts = useSelector(state => state.auth.user.boosts);
    return (
        <>
            {boosts?.length > 0 ?
                <Pressable style={styles.boostDialog} onPress={onPress}>
                    <Text style={styles.infoText}>
                        Power Ups
                    </Text>
                    <LottieAnimations
                        animationView={require('../../assets/boost.json')}
                        width={normalize(40)}
                        height={normalize(40)}
                    />
                    {/* <Ionicons name="speedometer" size={20} color="#FFFF" /> */}
                </Pressable>
                :
                <View></View>
            }
        </>
    )
}
export default BoostsInfo;

const styles = EStyleSheet.create({
    boostDialog: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#EF2F55',
        paddingHorizontal: '.4rem',
        borderRadius: 5
    },
    infoText: {
        fontSize: '0.63rem',
        fontFamily: 'graphik-regular',
        color: '#FFFF',
    },
})