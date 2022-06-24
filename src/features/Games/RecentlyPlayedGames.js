
import React from 'react';
import { useSelector } from 'react-redux';
import { Text, View } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { isTrue } from '../../utils/stringUtl';
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveHeight, responsiveScreenWidth, responsiveWidth } from '../../utils/normalize';
import GameSubcategoryCard from './GameSubcategoryCard';


export default () => {

    const games = useSelector(state => state.auth.user.recentGames);
    console.log(games)

    if (!games || !isTrue(games) || games.length === 0)
        return <></>;

    const onSubCategoryClicked = () => {
        // navigation.navigate('Game')
    }


    return (
        <View style={styles.games}>
            <Text style={styles.lightTitle}>Recently Played</Text>
            <View style={styles.cards}>
                <SwiperFlatList >
                    {games.map((game, i) => <GameSubcategoryCard key={i} game={game} onSelect={onSubCategoryClicked} />)}
                </SwiperFlatList>
            </View>
        </View>

    )
}




const styles = EStyleSheet.create({

    games: {
        paddingTop: normalize(10, "height"),
    },

    lightTitle: {
        fontSize: '1rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        marginTop: normalize(10),
    },
    cards: {
        flexDirection: 'row',
        marginTop: normalize(18),
    },
    card: {
        flex: 1,
        backgroundColor: '#fff',
        borderRadius: normalize(10),
        alignItems: 'center',
        marginRight: responsiveWidth(3),
        flexDirection: "row",
        borderColor: '#0F000000',
        width: responsiveScreenWidth(70),
        '@media (min-height: 781) and (max-height: 1200)': {
            height: responsiveHeight(10),
        },
        '@media (min-height: 300) and (max-height: 780)': {
            height: responsiveHeight(11),
        },
    },
    cardIconBigger: {
        flex: 2,
        width: normalize(48),
        height: normalize(48),
        alignSelf: 'center',
    },
    cardContent: {
        flex: 4,
        paddingHorizontal: responsiveScreenWidth(1),
        justifyContent: "space-evenly",
    },
    cardTitle: {
        fontSize: '0.93rem',
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    cardInstruction: {
        fontSize: '0.75rem',
        color: '#151C2F',
        fontFamily: 'graphik-regular',
        lineHeight: '1rem',
        opacity: .7,
        flexWrap: 'wrap',
        flexShrink: 1,
        marginTop: Platform.OS === 'ios' ? normalize(2) : normalize(1),

    },
    replay: {
        fontSize: '0.7rem',
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        textTransform: 'uppercase',
        marginTop: Platform.OS === 'ios' ? normalize(5) : normalize(1),
    },
});