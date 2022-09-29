import React from "react";
import { Text, View } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";
import { useNavigation, } from '@react-navigation/native';
import GoToStore from "./GoToStore";
import UserAvailableBoost from "./UserAvailableBoost";
import AppButton from "./AppButton";


const LiveTriviaUserAvailableBoosts = ({ onClose, boosts, loading, onStartGame }) => {
    const navigation = useNavigation();

    const visitStore = () => {
        onClose();
        navigation.navigate('GameStore')
    }
    return (
        <View style={styles.availableBoosts}>
            <Text style={styles.title}>Available Boosts</Text>
            <View style={styles.boosts}>
                {boosts.map((boost, i) => <UserAvailableBoost boost={boost} key={i} />
                )}
            </View>
            <GoToStore onPress={visitStore} />
            <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={onStartGame} disabled={loading} />
        </View>
    )
}
export default LiveTriviaUserAvailableBoosts;

const styles = EStyleSheet.create({
    availableBoosts: {
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(20),
    },
    title: {
        fontSize: '0.85rem',
        fontFamily: 'graphik-medium',
        color: '#000',
        lineHeight: 23,
        marginBottom: normalize(15)
    },
    boosts: {
        // alignItems: ''
    },
})