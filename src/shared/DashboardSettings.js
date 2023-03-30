import { View, Text, Modal } from 'react-native'
import React from 'react'
import { responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize'
import EStyleSheet from 'react-native-extended-stylesheet'
import { Image } from 'react-native'
import { Pressable } from 'react-native'
import MixedContainerBackground from './ContainerBackground/MixedContainerBackground'
import GameArkLogo from './GameArkLogo'
import { useNavigation } from '@react-navigation/core'

const DashboardSettings = ({ showSettings, setShowSettings }) => {
    const navigation = useNavigation()
    return (
        <>
            <View style={styles.setting}>
                <Pressable onPress={() => setShowSettings(true)}>
                    <Image style={styles.settingIcon} source={require('./../../assets/images/setting-icon.png')} />
                </Pressable>
                <Pressable onPress={() => navigation.navigate('GameStore')}>
                    <Image style={styles.storeIcon} source={require('../../assets/images/store-icon.png')} />
                </Pressable>
            </View>
            <IconSettings setShowSettings={setShowSettings} showSettings={showSettings} />
        </>
    )
}


const IconSettings = ({ showSettings, setShowSettings }) => {
    return (
        <Modal
            animationType="fade"
            transparent={false}
            visible={showSettings}
            onRequestClose={() => {
                // Alert.alert("Modal has been closed.");
                setShowSettings(!showSettings);
            }}
        >
            <MixedContainerBackground>
                <View style={styles.modalContainer}>
                    <View style={styles.container}>
                        <GameArkLogo />
                        <View style={styles.settingIconsContainter}>
                            <Pressable style={styles.icons}>
                                <Image style={styles.imageIcons} source={require('./../../assets/images/sound-1.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}>
                                <Image style={styles.imageIcons} source={require('./../../assets/images/leaderboard-icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}>
                                <Image style={styles.imageIcons} source={require('./../../assets/images/profile-icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}>
                                <Image style={styles.imageIcons} source={require('./../../assets/images/icon.png')} />
                            </Pressable>
                            <Pressable style={styles.icons}>
                                <Image style={styles.imageIcons} source={require('./../../assets/images/help-icon.png')} />
                            </Pressable >
                        </View>
                        <View style={styles.setting}>
                            <Pressable onPress={() => setShowSettings(false)}>
                                <Image style={styles.settingIcon} source={require('./../../assets/images/close-icon.png')} />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </MixedContainerBackground>
        </Modal>
    )
}

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveScreenWidth(3),
    },

    modalContainer: {
        alignItems: 'center',
        paddingHorizontal: responsiveScreenHeight(3),
    },
    settingIconsContainter: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginTop: responsiveScreenHeight(34),
    },

    setting: {
        width: '100%',
        marginTop: responsiveScreenHeight(3),
        paddingHorizontal: responsiveScreenWidth(3),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },

    icons: {
        marginRight: 30,
        marginVertical: 10,
    },
    imageIcons: {
        height: 80,
        width: 80
    },
    settingIcon: {
        width: 50,
        height: 50
    },
    storeIcon: {
        width: 75.55,
        height: 50
    }
})

export default DashboardSettings

