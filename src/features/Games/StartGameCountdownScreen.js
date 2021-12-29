import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import GameCountdown from '../../shared/GameCountdown';

export default function StartGameCountdownScreen({ navigation }) {

    return (
        <View style={styles.container}>
            <GameCountdown onFinish={() => navigation.navigate('GameInProgress')} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#9C3DB8',
        justifyContent: 'center',
        alignItems: 'center'
    },
});
