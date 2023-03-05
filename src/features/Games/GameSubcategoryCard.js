
import React from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/core';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { useDispatch } from 'react-redux';
import { setGameCategory } from './GameSlice';


export default ({ subcategory}) => {
    const navigation = useNavigation();
    const dispatch = useDispatch();

    const clicked = () => {
        dispatch(setGameCategory(subcategory));
       navigation.navigate('GameStaking');
    }

    return (
        <Pressable style={styles.card} onPress={clicked} >

            <Image
                style={[styles.cardIconBigger]}
                source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${subcategory.icon}` }}
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
        paddingHorizontal:'.8rem',
        paddingVertical:'.5rem',
        elevation: 3.5,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.1,
    },
    cardIconBigger: {
        width: normalize(30),
        height: normalize(30),
        alignSelf: 'center',
    },
    cardContent: {
        paddingHorizontal: responsiveScreenWidth(1),
        justifyContent: "space-evenly",
    },
    cardTitle: {
        fontSize: '0.8rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
});