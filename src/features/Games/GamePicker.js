import React from 'react';
import EStyleSheet from 'react-native-extended-stylesheet';
import { View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setGameCategory, setGameType } from './GameSlice';
import normalize from '../../utils/normalize';
import GameCategoryCard from './GameCategoryCard';
import useSound from '../../utils/useSound';


export default ({ navigation }) => {
    const dispatch = useDispatch();

    const currentGame = useSelector(state => state.common.gameTypes ? state.common.gameTypes[0] : null);
    const { playSound } = useSound(require('../../../assets/sounds/open.wav'))

    const onCategorySelected = (category) => {
        dispatch(setGameCategory(category));
        navigation.navigate('SelectSubCategory', { category: category })
        playSound()
    }

    if (!currentGame) {
        return <></>;
    }

    return (
        <>
            <View style={styles.cards}>
                {currentGame.categories.map((category, i) => <GameCategoryCard key={i}
                    category={category}
                    onSelect={onCategorySelected}
                />
                )}
            </View>
        </>

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
    cards: {
        display: 'flex',
        flexDirection: 'column',
        marginTop: -30,
        paddingHorizontal: normalize(40),
        alignItems: 'center'
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