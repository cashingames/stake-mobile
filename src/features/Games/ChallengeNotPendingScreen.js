import React, { useEffect, useState } from "react";
import { View, Text, Image, StatusBar, ScrollView, BackHandler } from "react-native";
import AppButton from "../../shared/AppButton";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { useFocusEffect } from "@react-navigation/native";
import LottieAnimations from "../../shared/LottieAnimations";

const ChallengeNotPendingScreen = ({ navigation, route }) => {
    const params = route.params

    useFocusEffect(
        React.useCallback(() => {
            const onBackPress = () => {
                return true;
            };
            BackHandler.addEventListener('hardwareBackPress', onBackPress);

            return () =>
                BackHandler.removeEventListener('hardwareBackPress', onBackPress);
        }, [])
    );

    useFocusEffect(
        React.useCallback(() => {

            StatusBar.setBackgroundColor('#072169');
            StatusBar.setBarStyle('light-content');

            return () => {
                StatusBar.setBackgroundColor('#FFFF');
                StatusBar.setBarStyle('dark-content');
            }

        }, [])
    );



    const goHome = () => {
        navigation.navigate('AppRouter')

    }
    const goToMyChallenges = () => {
        navigation.navigate('MyChallenges')

    }
    return (
        <View style={styles.container}>
            {params.challenge.status === 'ACCEPTED' &&
                <>
                    <View style={styles.animation}>
                        <LottieAnimations
                            animationView={require('../../../assets/leaderboard.json')}
                            width={normalize(170)}
                            height={normalize(170)}
                        />
                    </View>
                    <Text style={styles.message}>This challenge has already been played,
                        check your recent challenges to see the result
                        or go to dashboard to play more exciting games
                    </Text>
                    <View style={styles.buttonContainer}>
                        <AppButton text='Dashboard' onPress={goHome} style={styles.button} />
                        <AppButton text='My Challenges' onPress={goToMyChallenges} style={styles.button} />
                    </View>

                </>
            }
            {params.challenge.status === 'DECLINED' &&
                <>
                    <View style={styles.animation}>
                        <Image
                            source={require('../../../assets/images/sad-face-emoji.png')}
                            style={styles.emoji}
                        />
                    </View>
                    <Text style={styles.message}>Sorry, this challenge has been declined,
                        go to dashboard to challenge other players
                    </Text>
                    <AppButton text='Dashboard' onPress={goHome} />

                </>
            }
        </View>
    )
}

export default ChallengeNotPendingScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#072169',
        paddingHorizontal: normalize(22),
        paddingTop: normalize(25),
    },
    message: {
        fontSize: '1rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
        lineHeight: '1.5rem'
    },
    buttonContainer: {
        flexDirection: 'row',
        marginTop: normalize(50),
        justifyContent: 'space-between'
    },
    button: {
        width: responsiveScreenWidth(43),
    },
    animation: {
        alignItems: 'center',
        marginBottom: normalize(25)
    },
    emoji: {
        width: normalize(150),
        height: normalize(150),
    }
})