
import React from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/core';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { useDispatch, useSelector } from 'react-redux';
import { setGameCategory } from './GameSlice';


export default ({ subcategory }) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const gameMode = useSelector(state => state.game.gameMode);
    const clicked = () => {
        dispatch(setGameCategory(subcategory));
        if (gameMode.name === "CHALLENGE")
            navigation.navigate('ChallengeSelectPlayer');
        else
            navigation.navigate('GameStaking');
    };


    return (
        <Pressable style={styles.card} onPress={clicked} >

            <Image
                style={[styles.cardIconBigger]}
                source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${subcategory.icon}` }}
                resizeMode='contain'
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle}>{subcategory.name}</Text>
            </View>
        </Pressable >
    );
}


const styles = EStyleSheet.create({
    card: {
        marginVertical: '.5rem',
        backgroundColor: '#F8F9FD',
        borderRadius: normalize(11),
        alignItems: 'center',
        marginHorizontal: '.2rem',
        flexDirection: "row",
        borderWidth: Platform.OS === 'ios' ? normalize(0.5) : 1,
        borderColor: '#E0E0E0',
        paddingHorizontal: '.8rem',
        paddingVertical: '.5rem',
        elevation: 3.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.1,
    },
    cardIconBigger: {
        width: normalize(20),
        height: normalize(20),
        alignSelf: 'center',
    },
    cardContent: {
        paddingHorizontal: responsiveScreenWidth(1),
        justifyContent: "space-evenly",
    },
    cardTitle: {
        fontSize: '0.7rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
});