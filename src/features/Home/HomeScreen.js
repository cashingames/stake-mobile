import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { useFocusEffect } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { copilot, CopilotStep } from "react-native-copilot";
// import { joyride, JoyrideStep } from 'react-native-joyride';
import normalize from '../../utils/normalize';
import { isTrue, formatCurrency, formatNumber } from '../../utils/stringUtl';
import { backendUrl } from '../../utils/BaseUrl';
import PageLoading from '../../shared/PageLoading';
import { getUser } from '../Auth/AuthSlice';
import { useDispatch, useSelector } from 'react-redux';
import { getCommonData, getGlobalLeaders } from '../CommonSlice';
import GlobalTopLeadersHero from '../../shared/GlobalTopLeadersHero';

const HomeScreen = () => {

    const dispatch = useDispatch();
    const user = useSelector(state => state.auth.user)
    const gameTypes = useSelector(state => state.common.gameTypes)
    const [loading, setLoading] = useState(true);

    let propTypes = {
        start: PropTypes.func.isRequired,
        copilotEvents: PropTypes.shape({
            on: PropTypes.func.isRequired,
        }).isRequired,
    };

    // state = {
    //     secondStepActive: true,
    // };
console.log(propTypes)
    useEffect(() => {
        propTypes.copilotEvents.on('stepChange');
        propTypes.start()
    }, [])


    // handleStepChange = (step) => {
    //     console.log(`Current step is: ${step.name}`);
    // }

    useEffect(() => {

        var _1 = dispatch(getUser('v3/user/profile'));
        var _3 = dispatch(getGlobalLeaders());
        var _2 = dispatch(getCommonData());

        Promise.all([_1, _2, _3]).then(values => {
            setLoading(false);
        });
    }, []);

    useFocusEffect(
        React.useCallback(() => {
            //@TODO: Fix the double global leader call for the first visit after login
            dispatch(getGlobalLeaders())
        }, [])
    );
    if (loading) {
        return <PageLoading />
    }

    return (
        <ScrollView>
            <UserDetails user={user} />
            <View style={styles.container}>
                <GameCards games={gameTypes} />
                <RecentlyPlayedCards games={user.recentGames} />
                <CopilotStep
                    text="This is a hello world example!"
                    order={1}
                    name="hello"
                >
                    <GlobalTopLeadersHero />
                </CopilotStep>
            </View>
        </ScrollView>
    );

}
export default copilot()(HomeScreen);


const UserDetails = ({ user }) => {
    return (
        <View style={styles.userDetails}>
            <UserWallet balance={user.walletBalance} />
            <UserPoints points={user.points} />
            <UserRanking gamesCount={user.gamesCount} ranking={user.globalRank} />
        </View>
    );
}

const UserWallet = ({ balance }) => {
    return (
        <View style={styles.wallet}>
            <Image
                style={styles.icon}
                source={require('../../../assets/images/wallet.png')}
            />
            <Text style={styles.walletText}>&#8358;{formatCurrency(balance)}</Text>
        </View>
    );
}

const UserPoints = ({ points }) => {
    return (
        <View style={styles.points}>
            <Image
                style={styles.trophy}
                source={require('../../../assets/images/point-trophy.png')}
            />
            <View style={styles.pointsNumber}>
                <Text style={styles.userPoint}>{formatNumber(points)}</Text>
                <Text style={styles.pointDetail} >YOUR POINTS EARNED</Text>
            </View>
        </View>
    );
}

const UserRanking = ({ gamesCount, ranking }) => {
    return (
        <View style={styles.userRanking}>
            <View style={styles.gamesPlayed}>
                <Text style={styles.rankNumber}>{formatNumber(gamesCount)}</Text>
                <Text style={styles.rankDetail}>GAMES PLAYED</Text>
            </View>
            <View style={styles.globalRanking}>
                <Text style={styles.rankNumber}>{formatNumber(ranking)}</Text>
                <Text style={styles.rankDetail}>GLOBAL RANKING</Text>
            </View>
        </View>
    );
}


function GameCards({ games }) {

    if (!isTrue(games) || games.length === 0)
        return <></>;

    return (
        <View style={styles.games}>
            <Text style={styles.title}>Games</Text>
            <View style={styles.cards}>
                {/* <SwiperFlatList autoplay autoplayDelay={2} autoplayLoop> */}
                {games.map((game, i) => <GameCard key={i} game={game} />)}
                {/* </SwiperFlatList> */}
            </View>
        </View>

    )
}

function GameCard({ game }) {
    return (
        <View style={[styles.card, { backgroundColor: game.bgColor }]} >
            <Image
                style={styles.cardIcon}
                source={{ uri: `${backendUrl}/${game.icon}` }}
            />
            <Text style={styles.cardTitle}>{game.displayName}</Text>
            <Text style={styles.cardInstruction}>{game.description}</Text>
        </View>
    );
}


function RecentlyPlayedCards({ games }) {
    if (!isTrue(games) || games.length === 0)
        return <></>;
    return (
        <View style={styles.games}>
            <Text style={styles.title}>Recently Played Games</Text>
            <View style={styles.cards}>
                <SwiperFlatList autoplay autoplayDelay={2} autoplayLoop>
                    {games.map((game, i) => <RecentlyPlayedCard key={i} game={game} />)}
                </SwiperFlatList>
            </View>
        </View>

    )
}

function RecentlyPlayedCard({ game }) {
    return (
        <View style={[styles.card, { backgroundColor: game.bgColor }]} >
            <Image
                style={styles.cardIcon}
                source={{ uri: `${backendUrl}/${game.icon}` }}
            />
            <Text style={styles.playedTitle}>{game.name}</Text>
            <Text style={styles.replay}>Replay</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(18),
    },
    userDetails: {
        backgroundColor: '#151C2F',
        paddingTop: normalize(30),
        paddingRight: normalize(20),
        paddingLeft: normalize(20),
        paddingBottom: normalize(15),
    },
    wallet: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    walletText: {
        fontSize: normalize(16),
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(8),
    },
    points: {
        backgroundColor: '#01A7DB',
        borderRadius: normalize(10),
        marginTop: normalize(30),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: normalize(8),
        paddingRight: normalize(15),
        paddingLeft: normalize(6),
    },
    trophy: {
        // width: 100
    },
    pointsNumber: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    userPoint: {
        fontSize: normalize(20),
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    pointDetail: {
        color: '#FFFF',
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
    },
    userRanking: {
        backgroundColor: '#FFFF',
        borderRadius: normalize(10),
        marginTop: normalize(15),
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: normalize(15),
    },
    gamesPlayed: {

    },
    globalRanking: {
        alignItems: 'flex-end'
    },
    rankNumber: {
        fontSize: normalize(20),
        color: '#151C2F',
        fontFamily: 'graphik-medium',
    },
    rankDetail: {
        color: '#151c2f73',
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
    },
    games: {
        paddingTop: normalize(10),
    },
    title: {
        fontSize: normalize(15),
        color: '#151C2F',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(15),
        marginTop: normalize(10),
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
        marginTop: normalize(18),
    },
    card: {
        backgroundColor: '#9C3DB8',
        paddingHorizontal: normalize(15),
        paddingVertical: normalize(15),
        width: normalize(133),
        borderRadius: normalize(7),
        marginRight: normalize(15),
    },
    cardIcon: {
        width: 50,
        height: 50,
        borderRadius: normalize(10)
    },
    cardInstruction: {
        fontSize: normalize(10),
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    cardTitle: {
        fontSize: normalize(12),
        color: '#FFFF',
        fontFamily: 'graphik-bold',
        lineHeight: normalize(17),
        marginTop: normalize(8),
    },
    replay: {
        fontSize: normalize(10),
        color: '#EF2F55',
        fontFamily: 'graphik-regular',
    },
    musicIcon: {
        width: 50,
        height: 50,
    },

    playedTitle: {
        fontSize: 15,
        color: '#4F4F4F',
        fontFamily: 'graphik-bold',
        lineHeight: 17,
        marginTop: normalize(8),
    },

});
