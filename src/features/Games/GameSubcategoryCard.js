
import React from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/core';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { useDispatch, useSelector } from 'react-redux';
import { setGameCategory } from './GameSlice';
import logToAnalytics from '../../utils/analytics';
import { Ionicons } from '@expo/vector-icons';



export default ({ subcategory }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const gameMode = useSelector(state => state.game.gameMode);
    const clicked = () => {
        dispatch(setGameCategory(subcategory));

        if (gameMode.name === "CHALLENGE") {
            logToAnalytics("trivia_challenge_category_selected", {
                'gamemode': gameMode.displayName,
                'gameCategory': subcategory.name
            })
            navigation.navigate('ChallengeStaking');
        }
        else {
            logToAnalytics("trivia_staking_category_selected", {
                'gamemode': gameMode.displayName,
                'gameCategory': subcategory.name
            })
            navigation.navigate('GameStaking');
        }
    };


    return (
        <Pressable style={styles.card} onPress={clicked} >
            <View style={styles.cardImageContent}>
                <Image
                    style={[styles.cardIconBigger]}
                    source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${subcategory.icon}` }}
                    resizeMode='contain'
                />
                <View style={styles.cardContent}>
                    <Text style={styles.cardTitle}>{subcategory.name}</Text>
                </View>
            </View>
            <Ionicons name='chevron-forward-sharp' size={24} color='#072169' />
        </Pressable >
    );
}


const styles = EStyleSheet.create({
    card: {
        marginVertical: '.5rem',
        backgroundColor: '#F8F9FD',
        borderRadius: normalize(11),
        alignItems: 'center',
        justifyContent:'space-between',
        flexDirection:'row',
        marginHorizontal: '.2rem',
        flexDirection: "row",
        borderWidth: Platform.OS === 'ios' ? normalize(0.5) : 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: '.8rem',
        paddingVertical: '.7rem',
        elevation: 3.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.1,
    },
    cardImageContent: {
        flexDirection: "row",
        alignItems: 'center',
    },
    cardIconBigger: {
        width: normalize(50),
        height: normalize(50),
        alignSelf: 'center',
    },
    cardContent: {
        paddingHorizontal: responsiveScreenWidth(1),
        justifyContent: "space-evenly",
    },
    cardTitle: {
        fontSize: '0.87rem',
        width:'11rem',
        color: '#072169',
        fontFamily: 'gotham-bold',
        marginLeft:'.7rem'
    },
});