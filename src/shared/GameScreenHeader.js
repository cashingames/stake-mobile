import { View, Text, Pressable, Image } from 'react-native'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet'
import normalize, { responsiveScreenWidth } from '../utils/normalize'
import { useNavigation } from '@react-navigation/native'
import useSound from '../utils/useSound'

const GameScreenHeader = () => {
    const navigation = useNavigation()
    const { toogle, handleToggle, stopSound } = useSound();
    const handleToggleSwitch = () => {
        handleToggle();
        stopSound()
    };
    return (
        <View>
            <View style={styles.logo}>
                <Pressable style={styles.icons} onPress={() => navigation.navigate('Dashboard')}>
                    <Image style={styles.imageIcons} source={require('../../assets/images/home.png')} />
                </Pressable>
                <Image style={styles.smallLogo} source={require('../../assets/images/ga-logo-small.png')} />
                <Pressable style={styles.icons} onPress={handleToggleSwitch}>
                    {toogle ? <Image style={styles.imageIcons} source={require('../../assets/images/sound-1.png')} /> :
                        <Image style={styles.imageIcons} source={require('../../assets/images/sound-off.png')} />
                    }
                </Pressable>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    logo: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: normalize(15),
        paddingHorizontal: responsiveScreenWidth(3),
        justifyContent: 'space-between'
    },
    imageIcons: {
        width: 50,
        height: 50,
        // marginBottom: normalize(60)

    },
    smallLogo: {
        width: 150,
        height: 95,
        // marginTop:normalize(20)
    },
})
export default GameScreenHeader