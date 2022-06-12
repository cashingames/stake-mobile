
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { Text, View, Image, Pressable } from 'react-native';

export default ({ closeSheet }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.noGames}>
            <Image style={styles.sadEmoji}
                source={require('../../../assets/images/sad-face-emoji.png')}

            />
            <Text style={styles.noGamesText}>Sorry,</Text>
            <Text style={styles.noGamesText}>You have exhausted your games</Text>
            <Pressable onPress={() => { closeSheet(); navigation.navigate('GameStore') }}>
                <Text style={styles.needGames}>Need more games?
                    <Text style={styles.storeLink}> Go to Store</Text>
                </Text>
            </Pressable>
        </View>
    )
}