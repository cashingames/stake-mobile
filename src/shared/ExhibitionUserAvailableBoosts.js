import React, { useRef, useState } from "react";
import { Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AppButton from "./AppButton";
import GoToStore from "./GoToStore";
import UserAvailableBoost from "./UserAvailableBoost";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../utils/normalize";


const ExhibitionUserAvailableBoosts = ({ gameMode, boosts, onStartGame, startChallenge,
    loading, onClose }) => {
    const navigation = useNavigation();

    const visitStore = () => {
        onClose();
        navigation.navigate('GameStore')
    }

    const boostsToDisplay = () => {
        if (gameMode.name === "CHALLENGE") {
            return boosts.filter(x => x.name.toUpperCase() !== "SKIP");
        }
        return boosts;
    }

    return (
        <View style={styles.availableBoosts}>
            <Text style={styles.title}>Available Boosts</Text>
            {boosts?.length > 0 ?
                <View style={styles.boosts}>
                    {boostsToDisplay().map((boost, i) => <UserAvailableBoost boost={boost} key={i} />
                    )}
                </View>
                :
                <Text style={styles.noBoosts}>No boost available, go to store to purchase boost</Text>
            }
            <GoToStore onPress={visitStore} />
            {gameMode.name === "EXHIBITION" && <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={onStartGame} disabled={loading} />}
            {gameMode.name === "CHALLENGE" && <AppButton text={loading ? 'Starting...' : 'Start Game'} onPress={startChallenge} disabled={loading} />}

        </View>
    )
}

export default ExhibitionUserAvailableBoosts;

const styles = EStyleSheet.create({
    title: {
        fontSize: '0.85rem',
        fontFamily: 'graphik-medium',
        color: '#000',
        lineHeight: 23,
        marginBottom: normalize(15)
      },
      noBoosts: {
        textAlign: 'center',
        fontSize: '0.85rem',
        fontFamily: 'graphik-regular',
        marginVertical: '1rem'
      },
      availableBoosts: {
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(20),
      },
})