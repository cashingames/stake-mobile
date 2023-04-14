import React, { useRef, useState } from 'react';
import { Image, Pressable, StatusBar, Text, View } from 'react-native';
import GamePicker from './GamePicker';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useFocusEffect } from '@react-navigation/native';
import { isTrue } from '../../utils/stringUtl';
import { useSelector } from 'react-redux';
import NoGame from '../../shared/NoGame';
import { Platform } from 'react-native';
import useSound from '../../utils/useSound';
import QuizContainerBackground from '../../shared/ContainerBackground/QuizContainerBackground';
import TopIcons from '../../shared/TopIcons';
import DashboardSettings from '../../shared/DashboardSettings';
import { ScrollView } from 'react-native';

const SelectGameCategoryScreen = ({ navigation, initialShowPlayButton = false }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const gameMode = useSelector(state => state.game.gameMode);
    const refRBSheet = useRef();
    const { playSound } = useSound(require('../../../assets/sounds/open.wav'))
    const [showSettings, setShowSettings] = useState(false);
    const user = useSelector(state => state.auth.user);

    console.log(user)
    // console.log(activeSubcategory)


    const onPlayButtonClick = () => {
        onSelectGameMode();
        playSound()

    }

    const onSelectGameMode = () => {
        if (gameMode.name === "CHALLENGE")
            navigation.navigate('ChallengeSelectPlayer');
        else
            navigation.navigate('GameInstructions');
    };

    useFocusEffect(
        React.useCallback(() => {
            StatusBar.setTranslucent(true)
            StatusBar.setBackgroundColor("transparent")
            StatusBar.setBarStyle('light-content');
            return () => {
                StatusBar.setTranslucent(true)
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );

    return (
            <QuizContainerBackground>
                <ScrollView style={styles.container}>
                        <TopIcons />
                    <View style={styles.logo}>
                        <Pressable style={styles.icons} onPress={() => navigation.navigate('Home')}>
                            <Image style={styles.imageIcons} source={require('../../../assets/images/home.png')} />
                        </Pressable>
                        <Text style={styles.title}>Quiz Game</Text>
                    </View>
                    <View style={styles.imgContainer}>
                        <Image style={styles.quizImage} source={require('../../../assets/images/quiz-large.png')} />
                    </View>
                    <View>
                        <GamePicker title={"Pick a game"} navigation={navigation} />
                    </View>
                              
                </ScrollView>
                <View style={styles.setting}>
                        <DashboardSettings showSettings={showSettings} setShowSettings={setShowSettings} />
                    </View>     
            </QuizContainerBackground>
    )
}

export default SelectGameCategoryScreen;

const styles = EStyleSheet.create({
    container: {
        // flex: 1,
        paddingVertical: responsiveScreenWidth(3),
    },
    logo: {
        alignItems: 'flex-start',
        flexDirection: 'row',
        marginTop: normalize(40),
        paddingHorizontal: responsiveScreenWidth(3),
    },
    imageIcons: {
        width: 50,
        height: 50,
        marginTop: -10,
    },
    title: {
        color: '#fff',
        fontFamily: 'blues-smile',
        fontSize: '2.5rem',
        textAlign: 'center',
        flex: 1,
        marginRight: 30,
        marginBottom:40
    },
    imgContainer: {
        alignItems: 'center'
    },
    quizImage: {
        width: normalize(167),
        height: normalize(226)
    },
    setting: {
        position: 'absolute',
        left:0,
        right: 0,
        bottom: 180,
    },
})