import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import Animated from 'react-native-reanimated';
import { Text, View, Image, ScrollView } from 'react-native';

import GlobalTopLeadersHero from '../../shared/GlobalTopLeadersHero';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { randomEnteringAnimation } from '../../utils/utils';
import GamePicker from './GamePicker';

export default function GameScreen() {

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <ProgressMessage />
            <GamePicker />
            <GlobalTopLeadersHero />
        </ScrollView>
    );
}

const ProgressMessage = () => {
    return (
        <Animated.View style={styles.progress} entering={randomEnteringAnimation()}>
            <View style={styles.progressText}>
                <Text style={styles.progressTitle}>Great going!</Text>
                <Text style={styles.text}>Continue playing to gain more points and climb up the leaderboard.</Text>
            </View>
            <Image
                source={require('../../../assets/images/treasure_chest.png')}
            />
        </Animated.View>
    )
}

const styles = EStyleSheet.create({

    container: {
        flex: 1,
    },
    contentContainer: {
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),
        paddingBottom: normalize(40),
    },
    winBig: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    progress: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(15),
        marginVertical: normalize(22),
        borderRadius: 8,
        borderWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3),
        borderColor: '#E5E5E5',
    },
    progressText: {
        width: responsiveScreenWidth(45),
    },
    progressTitle: {
        fontFamily: 'graphik-medium',
        fontSize: '1.3rem',
        color: '#151C2F',
    },
    text: {
        fontFamily: 'graphik-regular',
        fontSize: '0.68rem',
        color: '#7C7D7F',
        lineHeight: '1rem',
        marginTop: normalize(8)
    },
    noGamesText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        width: normalize(130),
        textAlign: 'center',
        color: '#000',
        lineHeight: normalize(24)
    },
    createQuiz: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
        borderRadius: 8,
        marginBottom: normalize(20),
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    quiz: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    create: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(12),
        color: '#EF2F55',
    },
    games: {
        paddingVertical: normalize(10),
        // marginRight: normalize(5),
        // backgroundColor: "red",
        width: "88%",
    },
    title: {
        fontSize: '0.89rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
        marginVertical: normalize(10),
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
    },
    card: {
        width: normalize(130),
        padding: normalize(15),
        borderRadius: normalize(7),
        marginBottom: normalize(15),
        marginRight: normalize(10)
    },
    gameButton: {
        fontFamily: 'graphik-medium',
        fontSize: '0.73rem',
        color: '#151C2F',
        textAlign: 'center'
    },
    subcategories: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    activeSubcategory: {
        color: '#FFF',
        backgroundColor: '#EF2F55',
    },
    subcategory: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(18),
        borderRadius: 20,
        marginRight: normalize(10),
        marginBottom: normalize(10),
        backgroundColor: '#E0E0E0',
    },
    noGames: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
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
    storeLink: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },

});