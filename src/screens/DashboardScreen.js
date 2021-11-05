import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
// import { useAppSelector } from '../../hooks/typedReduxHooks';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import { normalize } from '../constants/NormalizeFont';
// import currency from "../services/currency";
import { SafeAreaView } from 'react-native-safe-area-context';
import GlobalTopLeaders from '../components/GlobalTopLeaders';
import { useNavigation } from '@react-navigation/native';
import Header from '../components/Header';

export default function DashboardScreen({ navigation }) {
    // const user = useAppSelector(state => state.userDetails.user);
    // const profile = useAppSelector(state => state.userDetails.profile);
    // const wallet = useAppSelector(state => state.walletDetails.wallet);

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Header title="Home" />
                <UserDetails />
                <GameCards games={[]} />
                <RecentlyPlayedCards games={[]} />
                <Leaderboard />
            </ScrollView>
        </SafeAreaView>
    );
}

function GameCards({ games }) {
    return (
        <View style={styles.games}>
            <Text style={styles.title}>Games</Text>
            <View style={styles.cards}>
                <SwiperFlatList autoplay autoplayDelay={2} autoplayLoop>
                    {/* {games.map( (game: any) =><GameCard game={game} />)} */}
                    <GameCard gameTitle='True or False' gameIcon={require('../../assets/images/music.png')} gameInstruction='Select from two options whether true or false' />
                    <GameCard gameTitle='Multi-Choice' gameIcon={require('../../assets/images/soccer.png')} gameInstruction='Select one correct answer from other options' />
                    <GameCard gameTitle='True or False' gameIcon={require('../../assets/images/music.png')} gameInstruction='Select from two options whether true or false' />
                    <GameCard gameTitle='Multi-Choice' gameIcon={require('../../assets/images/soccer.png')} gameInstruction='Select one correct answer from other options' />

                </SwiperFlatList>

            </View>
        </View>

    )
}

function GameCard({ gameTitle, gameInstruction, gameIcon }) {
    return (
        <View style={styles.card}>
            <Image
                style={styles.icon}
                source={gameIcon}
            // source={require('../../assets/images/music.png')}
            />
            <Text style={styles.cardTitle}>{gameTitle}</Text>
            <Text style={styles.cardInstruction}>{gameInstruction}</Text>
        </View>
    );
}

function RecentlyPlayedCards({ games }) {
    return (
        <View style={styles.games}>
            <Text style={styles.title}>Recently Played Games</Text>
            <View style={styles.cards}>
                <SwiperFlatList autoplay autoplayDelay={2} autoplayLoop>
                    {/* {games.map( (game: any) =><GameCard game={game} />)} */}
                    <RecentlyPlayedCard gameTitle='Music' gameIcon={require('../../assets/images/music.png')} />
                    <RecentlyPlayedCard gameTitle='Football' gameIcon={require('../../assets/images/soccer.png')} />
                    <RecentlyPlayedCard gameTitle='Music' gameIcon={require('../../assets/images/music.png')} />
                    <RecentlyPlayedCard gameTitle='Football' gameIcon={require('../../assets/images/soccer.png')} />
                </SwiperFlatList>
            </View>
        </View>

    )
}

function RecentlyPlayedCard({ gameTitle, gameIcon }) {
    return (
        <View style={styles.card}>
            <Image
                style={styles.musicIcon}
                source={gameIcon}
            // source={require('../../assets/images/music.png')}
            />
            <Text style={styles.playedTitle}>{gameTitle}</Text>
            <Text style={styles.replay}>Replay</Text>
        </View>
    );
}

const Wallet = () => {
    return (
        <View style={styles.wallet}>
            <Image
                style={styles.icon}
                source={require('../../assets/images/wallet.png')}
            />
            <Text style={styles.walletText}>&#8358;1002</Text>
        </View>
    );
}

const Points = () => {
    return (
        <View style={styles.points}>
            <Image
                style={styles.trophy}
                source={require('../../assets/images/point-trophy.png')}
            />
            <View style={styles.pointsNumber}>
                <Text style={styles.userPoint}>150567</Text>
                <Text style={styles.pointDetail} >YOUR POINTS EARNED</Text>
            </View>
        </View>
    );
}

const UserRanking = () => {
    return (
        <View style={styles.userRanking}>
            <View style={styles.gamesPlayed}>
                <Text style={styles.rankNumber}>102</Text>
                <Text style={styles.rankDetail}>GAMES PLAYED</Text>
            </View>
            <View style={styles.globalRanking}>
                <Text style={styles.rankNumber}>75</Text>
                <Text style={styles.rankDetail}>GLOBAL RANKING</Text>
            </View>
        </View>
    );
}

const UserDetails = () => {
    return (
        <View style={styles.userDetails}>
            <Wallet />
            <Points />
            <UserRanking />
        </View>
    );
}

const Leaderboard = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.leaderboard}>
            <View style={styles.leaderboardHeader}>
                <Text style={styles.title}>Leaderboard</Text>
                <View style={styles.extended}>
                    <Text onPress={() => navigation.navigate('ExtendedLeaderboard')}>
                        <Text style={styles.extendedText}>Extended Leaderboard</Text>
                    </Text>
                    <Ionicons name="md-arrow-forward-sharp" size={24} color="#EF2F55" />
                </View>
            </View>
            <GlobalTopLeaders leaders={[]} />
        </View>
    )
}





const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },

    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: normalize(20),
        paddingTop: normalize(30),
        paddingBottom: normalize(10),
    },
    headerTitle: {
        fontSize: normalize(20),
        fontFamily: 'graphik-medium',
    },
    headerIcons: {
        display: 'flex',
        flexDirection: 'row',

    },
    pageIcon: {
        marginLeft: normalize(30),
    },
    userDetails: {
        backgroundColor: '#151C2F',
        paddingTop: normalize(10),
        paddingRight: normalize(20),
        paddingLeft: normalize(20),
        paddingBottom: normalize(15),
    },
    icon: {

    },
    wallet: {
        display: 'flex',
        flexDirection: 'row',
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
        paddingHorizontal: normalize(20),
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
    },

    playedTitle: {
        fontSize: 15,
        color: '#4F4F4F',
        fontFamily: 'graphik-bold',
        lineHeight: 17,
        marginTop: normalize(8),
    },
    leaderboard: {
        paddingHorizontal: normalize(20),
        paddingTop: normalize(20),
        marginBottom: normalize(30)
    },
    leaderboardHeader: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(8)
    },
    extended: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    extendedText: {
        fontSize: normalize(9),
        color: '#EF2F55',
        fontFamily: 'graphik-bold',
    },
});
