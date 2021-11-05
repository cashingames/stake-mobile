import * as React from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import GameCountdown from '../components/GameCountdown';

export default function DuelGameCountdown({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <GameCountdown onFinish={() => navigation.navigate('DuelGameInProgress')} />
        </SafeAreaView>
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
