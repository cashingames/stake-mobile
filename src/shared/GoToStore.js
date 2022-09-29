import React from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import normalize from '../utils/normalize';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';

const GoToStore = ({ onPress }) => {
    return (
        <View style={styles.storeLinks}>

            <Pressable onPress={onPress}>
                <Text style={styles.needBoost}>Need more games?
                    <Text style={styles.storeLink}> Go to Store</Text>
                </Text>
            </Pressable>

        </View>
    )
}
export default GoToStore;

const styles = EStyleSheet.create({
    storeLink: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    noGamesText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        width: normalize(130),
        textAlign: 'center',
        color: '#000',
        lineHeight: normalize(24)
    },
    needBoost: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
        color: '#000',
    },
    storeLinks: {
        alignItems: 'center',
      },
})