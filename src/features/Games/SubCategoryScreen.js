import React, { useState } from 'react';
import { Image, Pressable, StatusBar, Text, View } from 'react-native';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import useSound from '../../utils/useSound';
import analytics from '@react-native-firebase/analytics';
import QuizContainerBackground from '../../shared/ContainerBackground/QuizContainerBackground';
import TopIcons from '../../shared/TopIcons';
import { ScrollView } from 'react-native';
import Animated from 'react-native-reanimated';
import { randomEnteringAnimation } from '../../utils/utils';
import GameSubcategoryCard from './GameSubcategoryCard';
import { setIsPlayingTrivia, setSubGameCategory, startGame } from './GameSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { logActionToServer } from '../CommonSlice';
import { useEffect } from 'react';
import crashlytics from '@react-native-firebase/crashlytics';
import Loader from '../../shared/Loader';
import GameSettings from '../../shared/GameSettings';
import GameModal from '../../shared/GameModal';

const SubCategoryScreen = ({ navigation, route }) => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const gameCategory = useSelector(state => state.game.gameCategory);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false)
    const networkNavigationHandler = () => {
        navigation.navigate('Dashboard')
        setShowModal(false)
    }

    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <QuizContainerBackground>
                    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 25 }}>
                        <View>
                            <TopIcons />
                            <View style={styles.logo}>
                                <Pressable style={styles.icons} onPress={() => navigation.navigate('Dashboard')}>
                                    <Image style={styles.imageIcons} source={require('../../../assets/images/home.png')} />
                                </Pressable>
                                <Text style={styles.title}>Trivia Hub</Text>
                            </View>
                        </View>
                        <View style={styles.imgContainer}>
                            <Image style={styles.quizImage} source={require('../../../assets/images/word-trivia.png')} />
                        </View>
                        <View>
                            <SubCategories category={gameCategory} loading={loading} setLoading={setLoading} setShowModal={setShowModal} />
                        </View>
                    </ScrollView>
                    <View style={styles.setting}>
                        <GameSettings navigationHandler={() => navigation.goBack(null)} />
                    </View>
                    <GameModal
                        showModal={showModal}
                        setShowModal={setShowModal}
                        title='Failed to start😥'
                        btnText='Ok'
                        modalBody='Category not available for now, try again later.'
                        btnHandler={() => setShowModal(false)}
                    />
                </QuizContainerBackground>
            )}
        </>
    )
}

const SubCategories = ({ category, loading, setLoading, setShowModal }) => {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const gameMode = useSelector(state => state.game.gameMode);
    const gameModeId = useSelector(state => state.game.gameMode.id);
    const gameTypeId = useSelector(state => state.game.gameType.id)
    const [subCategoryId, setSubCategoryId] = useState('')
    const user = useSelector(state => state.auth.user);
    const activePlans = useSelector(state => state.auth.user.hasActivePlan);
    const { playSound } = useSound(require('../../../assets/sounds/open.wav'))

    const onStartGame = () => {
        if (!activePlans) {
            navigation.navigate('NoGame')
        } else {
            setLoading(true);
            playSound()
            dispatch(setIsPlayingTrivia(false))
            dispatch(startGame({
                category: subCategoryId,
                type: gameTypeId,
                mode: gameModeId
            }))
                .then(unwrapResult)
                .then(async result => {
                    crashlytics().log('User started exhibition game');
                    await analytics().logEvent("exhibition_without_staking_game_started", {
                        'id': user.username,
                        'phone_number': user.phoneNumber,
                        'email': user.email
                    })
                    dispatch(logActionToServer({
                        message: "Game session " + result.data.game.token + " questions recieved for " + user.username,
                        data: result.data.questions
                    }))
                    setLoading(false);
                    navigation.navigate("GameInProgress")
                    setSubCategoryId('')
                })
                .catch((error) => {
                    setShowModal(true)
                    crashlytics().recordError(error);
                    crashlytics().log('failed to start exhibition game');
                    setLoading(false);
                });
        }
    }

    useEffect(() => {
        if (subCategoryId) {
            if (gameMode.name === "CHALLENGE") {
                navigation.navigate('ChallengeSelectPlayer');
            } else {
                onStartGame()
            }
        }
        return
    }, [subCategoryId])


    const onPressMe = (subcategory) => {
        dispatch(setSubGameCategory(subcategory));
        setSubCategoryId(subcategory.id)
    }

    return (

        <Animated.View entering={randomEnteringAnimation()}>
            <View style={styles.subcategories}>
                {category.subcategories.map((subcategory, i) => (
                    <GameSubcategoryCard
                        key={i}
                        game={subcategory}
                        onPress={() => onPressMe(subcategory)}
                        loading={loading}
                    />
                ))}
            </View>
        </Animated.View>
    )

};

export default SubCategoryScreen;

const styles = EStyleSheet.create({
    container: {
        height: responsiveHeight(100),
        paddingVertical: responsiveHeight(2),
    },
    logo: {
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: normalize(20),
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
        // letterSpacing: 7,
        flex: 1,
        marginRight: 30,
        marginBottom: 40
    },
    imgContainer: {
        alignItems: 'center'
    },
    quizImage: {
        width: normalize(300),
        height: normalize(184)
    },
    setting: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: responsiveHeight(88),
    },

    categoryHeading: {
        textAlign: 'center',
        fontFamily: 'blues-smile',
        fontSize: '1.5rem',
        color: '#fff'
    },
    subcategories: {
        flex: 1,
        marginTop: -10,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingHorizontal: responsiveScreenWidth(3),

    },
    activeSubcategory: {
        color: '#FFF',
        backgroundColor: '#EF2F55',
    },
    subcategory: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(18),
        borderRadius: 20,
        marginRight: normalize(10),
        marginBottom: normalize(10),
        backgroundColor: '#E0E0E0',
    },
    noGames: {
        backgroundColor: '#fff',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
    },
})
