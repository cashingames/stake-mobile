import * as React from 'react';
import { Text, View, Image, ScrollView, Pressable } from 'react-native';
import Constants from 'expo-constants';
import { useSelector, useDispatch } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';

import normalize from '../../utils/normalize';
import { setGameMode } from './GameSlice';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';

export default function GameModeScreen({ navigation }) {
    const dispatch = useDispatch();
    useApplyHeaderWorkaround(navigation.setOptions);

    const gameModes = useSelector(state => state.common.gameModes);

    const onSelectGameMode = (mode) => {
        dispatch(setGameMode(mode));
        if (mode.name === "EXHIBITION") {
            navigation.navigate('GameInstructions')
        }
        else if (mode.name === "CHALLENGE") {
            navigation.navigate('ChallengeSelectPlayer')
        }

    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.chooseMode}>Choose your mode</Text>
            <View>
                {gameModes.map((gameMode, i) =>
                    <AvailableMode key={i} gameMode={gameMode}
                        onPress={() => onSelectGameMode(gameMode)}
                    />
                )}
            </View>
        </ScrollView>
    );
}

const AvailableMode = ({ gameMode, onPress }) => {
    return (
        <Pressable
            style={[styles.modeContainer, { backgroundColor: gameMode.bgColor }]}
            onPress={onPress}
        >
            <View>
                <Text style={styles.modeTitle}>{gameMode.name}</Text>
                <Text style={styles.modeDescription}>{gameMode.description}</Text>
            </View>
            <Image
                source={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${gameMode.icon}` }}
                style={styles.gameModeIcon}
            />
        </Pressable>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(18),
    },
    chooseMode: {
        fontSize: '1.1rem',
        color: '#000',
        fontFamily: 'graphik-medium',
        marginVertical: normalize(10),
    },
    modeContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop: normalize(30),
        paddingBottom: normalize(20),
        paddingHorizontal: normalize(10),
        borderRadius: 9,
        alignItems: 'flex-end',
        borderWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        marginVertical: normalize(10)
    },
    modeTitle: {
        fontSize: '0.9rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    modeDescription: {
        fontSize: '0.69rem',
        color: '#4F4F4F',
        fontFamily: 'graphik-medium',
        opacity: 0.7
    },
    gameModeIcon: {
        width: normalize(55),
        height: normalize(45)
    },
});
