
import React, { useEffect, useState, useRef } from 'react';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import Animated from 'react-native-reanimated';
import { Platform, Text, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import AppButton from '../../shared/AppButton';
import { isTrue } from '../../utils/stringUtl';
import { setGameCategory, setGameType } from './GameSlice';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { randomEnteringAnimation } from '../../utils/utils';
import GameCategoryCard from './GameCategoryCard';
import GameSubcategoryCard from './GameSubcategoryCard';
import NoGame from '../../shared/NoGame';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';

export default ({ title, initialShowPlayButton = true ,activeSubcategory}) => {

    const dispatch = useDispatch();
    // const navigation = useNavigation();
    // const refRBSheet = useRef();
    const currentGame = useSelector(state => state.common.gameTypes ? state.common.gameTypes[0] : null);
    const [activeCategory, setActiveCategory] = useState();
    // const activeSubcategory = useSelector(state => state.game.gameCategory);
    const activeGame = useSelector(state => state.game.gameType);
    const hasActivePlan = useSelector(state => state.auth.user.hasActivePlan);

    const onCategorySelected = (category) => {
        setActiveCategory(category);
        dispatch(setGameCategory(undefined));
    }

    const onSubCategorySelected = (subcategory) => {
        dispatch(setGameCategory(subcategory));
    }

    // const openBottomSheet = () => {
    //     refRBSheet.current.open()
    // }

    // const closeBottomSheet = () => {
    //     refRBSheet.current.close()
    // }

    // const onPlayButtonClick = () => {
    //     // hasActivePlan ? onSelectGameMode() : openBottomSheet();
    //     onSelectGameMode();
    // }
    // const gameMode = useSelector(state => state.game.gameMode);
    // console.log(" log it", gameMode, "this is it right here")

    // const onSelectGameMode = () => {
    //     if (gameMode.name === "EXHIBITION") {
    //         hasActivePlan ? navigation.navigate('GameInstructions') : openBottomSheet();
    //     }
    //     else if (gameMode.name === "CHALLENGE") {
    //         navigation.navigate('ChallengeSelectPlayer')
    //     }

    // };

    useFocusEffect(
        React.useCallback(() => {
            setActiveCategory(undefined);
            dispatch(setGameType(currentGame));
        }, [])
    );

    useEffect(() => {
        setActiveCategory(undefined); //category
    }, [activeGame]);

    if (!currentGame) {
        return <></>;
    }

    return (
        <>
            <View style={styles.cards}>
                {currentGame.categories.map((category, i) => <GameCategoryCard key={i}
                    category={category}
                    isSelected={activeCategory?.id === category.id}
                    onSelect={onCategorySelected}
                />
                )}
            </View>
            {isTrue(activeCategory) && <SubCategories category={activeCategory} onSubCategorySelected={onSubCategorySelected} selectedSubcategory={activeSubcategory} />}
            {/* {(initialShowPlayButton || isTrue(activeSubcategory)) &&
                < Animated.View entering={randomEnteringAnimation()}>
                    <AppButton text='Proceed to Play' onPress={onPlayButtonClick} disabled={!isTrue(activeSubcategory)} />
                </Animated.View>
            } */}
            {/* <UniversalBottomSheet
                refBottomSheet={refRBSheet}
                height={Platform.OS === 'ios' ? 400 : 350}
                subComponent={<NoGame
                    onClose={closeBottomSheet}
                />}
            /> */}
        </>

    )
};

const SubCategories = ({ category, onSubCategorySelected, selectedSubcategory }) => {

    return (
        <Animated.View entering={randomEnteringAnimation()}>
            <Text style={styles.title}>Choose category</Text>
            <View style={styles.subcategories}>
                {/* <SwiperFlatList > */}
                {category.subcategories.map((subcategory, i) =>
                    <GameSubcategoryCard
                        key={i}
                        game={subcategory}
                        isSelected={subcategory === selectedSubcategory}
                        onSelect={onSubCategorySelected} />
                )}
                {/* </SwiperFlatList> */}
            </View>
        </Animated.View>
    )
};


const styles = EStyleSheet.create({

    container: {
        flex: 1,
    },
    contentContainer: {
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),
        paddingBottom: normalize(40),
    },
    winBig: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(15),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    progress: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(15),
        marginVertical: normalize(22),
        borderRadius: 8,
        borderWidth: Platform.OS === 'ios' ? normalize(1) : normalize(3),
        borderColor: '#E5E5E5',
    },
    progressText: {
        width: responsiveScreenWidth(45),
    },
    progressTitle: {
        fontFamily: 'graphik-medium',
        fontSize: '1.3rem',
        color: '#151C2F',
    },
    text: {
        fontFamily: 'graphik-regular',
        fontSize: '0.68rem',
        color: '#7C7D7F',
        lineHeight: '1rem',
        marginTop: normalize(8)
    },
    noGamesText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(16),
        width: normalize(130),
        textAlign: 'center',
        color: '#000',
        lineHeight: normalize(24)
    },
    createQuiz: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(10),
        borderRadius: 8,
        marginBottom: normalize(20),
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    quiz: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    create: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(12),
        color: '#EF2F55',
    },
    games: {
        paddingVertical: normalize(10),
        width: "88%",
    },
    title: {
        fontSize: '1rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginVertical: normalize(10),
    },
    cards: {
        display: 'flex',
        flexDirection: 'column',
    },
    card: {
        // width: normalize(130),
        padding: normalize(15),
        borderRadius: normalize(7),
        marginBottom: normalize(15),
        // marginRight: normalize(10)
    },
    gameButton: {
        fontFamily: 'graphik-medium',
        fontSize: '0.73rem',
        color: '#151C2F',
        textAlign: 'center'
    },
    subcategories: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
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

});