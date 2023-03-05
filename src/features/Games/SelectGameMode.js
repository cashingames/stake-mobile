import React from 'react';
import { Pressable, Text } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import { setGameMode, setGameType } from './GameSlice';
import normalize from '../../utils/normalize';
import { useNavigation } from '@react-navigation/core';
import analytics from '@react-native-firebase/analytics';




const SelectGameMode = () => {

    const navigation = useNavigation();
    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const gameMode = useSelector(state => state.common.gameModes[0]); //to be controller from backend
    const gameType = useSelector(state => state.common.gameTypes[0]); //to be controlled from backend

    const onSelectGameMode = async () => {
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        await analytics().logEvent("game_mode_selected", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            'gamemode': gameMode.displayName,
        })
        navigation.navigate('SelectGameCategory')
    };


    return (
        <Pressable onPress={onSelectGameMode} style={styles.playButton}>
            <Text style={styles.playText}>Start game now</Text>
        </Pressable>
    )
}


export default SelectGameMode;

const styles = EStyleSheet.create({
    playButton: {
        flex: 1,
        justifyContent:'center',
        alignItems:'center',
        backgroundColor:'#072169',
        marginVertical:'1rem',
        paddingVertical:'.68rem',
        borderRadius: 15,
        borderWidth: Platform.OS === 'ios' ? normalize(0.5) : 1,
        borderColor: '#E0E0E0',
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0.5, height: 2 },
        shadowOpacity: 0.6,
        // opacity: 0.65
    },
    playText: {
        fontSize: '.9rem',
        color: 'white',
        fontFamily: 'graphik-medium',
    }
})