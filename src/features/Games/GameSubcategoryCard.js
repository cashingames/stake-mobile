
import React from 'react';
import { Text, View, Image, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/core';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveHeight, responsiveScreenWidth, responsiveWidth } from '../../utils/normalize';


export default ({ game, onSelect, isSelected}) => {
    const navigation = useNavigation();
    return (
        <Pressable style={[styles.card, isSelected ?{ backgroundColor:"#EF8318"}  : {}]} onPress={() => onSelect(game)} >

            <Image
                style={[styles.cardIconBigger]}
                source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${game.icon}` }}
                resizeMode='contain'
            />
            <View style={styles.cardContent}>
                <Text style={[styles.cardTitle,  isSelected ?{ color:  "#FFFF" }  : {}]}>{game.name}</Text>
                {/* <Pressable onPress={() => onSelect(game)}><Text style={styles.replay}>Replay</Text></Pressable> */}
            </View>
        </Pressable >
    );
}


const styles = EStyleSheet.create({


    cards: {
        flexDirection: 'row',
        marginTop: normalize(18),
    },
    card: {
        // flex: 1,
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
        // // width: responsiveScreenWidth(70),
        // '@media (min-height: 781) and (max-height: 1200)': {
        //     // height: responsiveHeight(8),
        // },
        // '@media (min-height: 300) and (max-height: 780)': {
        //     // height: responsiveHeight(9),
        // },
    },
    cardIconBigger: {
        // flex: 2,
        width: normalize(30),
        height: normalize(30),
        alignSelf: 'center',
    },
    cardContent: {
        // flex: 4,
        paddingHorizontal: responsiveScreenWidth(1),
        justifyContent: "space-evenly",
    },
    cardTitle: {
        fontSize: '0.8rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },

    replay: {
        fontSize: '0.7rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        textTransform: 'uppercase',
        marginTop: Platform.OS === 'ios' ? normalize(5) : normalize(1),
    },
});