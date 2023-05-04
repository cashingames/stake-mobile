
import React from 'react';
import { Text, View, Image, Pressable, Platform } from 'react-native';
import Constants from 'expo-constants';
import { useNavigation } from '@react-navigation/core';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveHeight, responsiveScreenWidth, responsiveWidth } from '../../utils/normalize';


export default ({ game, onPress, loading }) => {
    const navigation = useNavigation();
    if(loading){
        <Text>Loading</Text>    
    }
    return (
        
        <Pressable 
        style={styles.card}
        // isSelected ?{ backgroundColor:"#EF8318"}  : {}]
        onPress={onPress} 
        >

            <Image
                style={[styles.cardIconBigger]}
                source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${game.icon}` }}
                resizeMode='contain'
            />
            <View style={styles.cardContent}>
                <Text style={styles.cardTitle  
                   }>{game.name}</Text>
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
        backgroundColor: '#15397D',
        borderRadius: normalize(20),
        alignItems: 'center',
        marginHorizontal: '.2rem',
        flexDirection: "row",
        borderBottomColor: '#0A1F45',
        borderBottomWidth: 4,
        paddingHorizontal:'.8rem',
        paddingVertical:'.5rem',
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
        fontSize: '0.8rem',
        color: '#fff',
        fontFamily: 'poppins',
    },

    replay: {
        fontSize: '0.7rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        textTransform: 'uppercase',
        marginTop: Platform.OS === 'ios' ? normalize(5) : normalize(1),
    },
});

// isSelected ?{ color:  "#FFFF" }  : {}]