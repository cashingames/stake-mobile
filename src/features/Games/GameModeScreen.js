import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable } from 'react-native';
import normalize from '../../utils/normalize';
import { backendUrl } from '../../utils/BaseUrl';
import { useSelector, useDispatch } from 'react-redux';
import { setGameMode } from './GameSlice';

export default function GameModeScreen({ navigation }) {
    const dispatch = useDispatch();
    const gameModes = useSelector(state => state.common.gameModes);


    const onSelectGameMode = (mode) => {
        console.log("here")
        dispatch(setGameMode(mode));
        navigation.navigate('GameInstructions')
    }

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
                source={{ uri: `${backendUrl}/${gameMode.icon}` }}
                style={styles.gameModeIcon}
            />
        </Pressable>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(18),
    },
    chooseMode: {
        fontSize: normalize(20),
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
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        marginVertical: normalize(10)
    },
    modeTitle: {
        fontSize: normalize(14),
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    modeDescription: {
        fontSize: normalize(10),
        color: '#4F4F4F',
        fontFamily: 'graphik-medium',
        opacity: 0.7
    },
    gameModeIcon: {
        width: normalize(55),
        height: normalize(45)
    },
});