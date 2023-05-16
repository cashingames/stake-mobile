import React, { useEffect, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector } from 'react-redux';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import AppHeader from '../../shared/AppHeader';
import TopIcons from '../../shared/TopIcons';
import { Image } from 'react-native';
import { isTrue } from '../../utils/stringUtl';
import Constants from 'expo-constants';


export default function UserStatsScreen({ navigation }) {

    useApplyHeaderWorkaround(navigation.setOptions);
    const currentGame = useSelector(state => state.common.gameTypes ? state.common.gameTypes[0] : []);
    const user = useSelector(state => state.auth.user)
    const userBoosts = useSelector(state => state.auth.user.boosts ?? [])
    const [totalBoosts, setTotalBoosts] = useState(null)
    const [mostPlayedCategory, setMostPlayedCategory] = useState([])

    useEffect(() => {
        const reducer = (accumulator, curr) => accumulator + curr;
        var x = userBoosts && userBoosts.map(a => Number(a.count)).reduce(reducer, 0);
        setTotalBoosts(x ?? 0);


        const mostPlayed = currentGame.categories.reduce((acc, curr) => {
            if (curr.played > acc.played) {
                return curr;
            } else {
                return acc;
            }
        });
        setMostPlayedCategory(mostPlayed);
    }, [userBoosts]);

    return (
        <MixedContainerBackground>
            <View style={styles.container}>
                <TopIcons />
                <AppHeader />
                <View style={styles.header}>
                    <Image
                        style={styles.avatar}
                        source={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}

                    />
                    <View style={styles.headerTextCase}>
                        <Text style={styles.headerText}>{user.username}</Text>
                    </View>
                </View>
                <Detail
                    username={user.username}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    gamesPlayed={user.gamesCount}
                    globalRanking={user.globalRank}
                    winRate={user.winRate}
                    joinedOn={user.joinedOn}
                    userPoint={user.points}
                    totalBoosts={totalBoosts}
                    mostPlayedCategory={mostPlayedCategory}
                />
            </View>
        </MixedContainerBackground>
    );
}

const Detail = ({
    username,
    firstName,
    lastName,
    gamesPlayed,
    globalRanking,
    winRate,
    joinedOn,
    userPoint,
    totalBoosts,
    mostPlayedCategory
}) => {
    return (
        <ScrollView style={styles.detailContainer}>
            <Text style={styles.title}>Statistics</Text>
            <View style={styles.detail}>
                <Text style={styles.detailText}>Total Points Gained</Text>
                <Text style={styles.responseText}>{userPoint}</Text>
            </View>
            <View style={styles.detail}>
                <Text style={styles.detailText}>Games Played</Text>
                <Text style={styles.responseText}>{gamesPlayed}</Text>
            </View>
            <View style={styles.detail}>
                <Text style={styles.detailText}>Global Ranking</Text>
                <Text style={styles.responseText}>{globalRanking}</Text>
            </View>
            <View style={styles.detail}>
                <Text style={styles.detailText}>Win Rate</Text>
                <Text style={styles.responseText}>{winRate}</Text>
            </View>
            <View style={styles.detail}>
                <Text style={styles.detailText}>Joined On</Text>
                <Text style={styles.responseText}>{joinedOn.slice(0, 10)}</Text>
            </View>
            <View style={styles.detail}>
                <Text style={styles.detailText}>Available Boosts</Text>
                <Text style={styles.responseText}>{totalBoosts}</Text>
            </View>
            <View style={styles.detail}>
                <Text style={styles.detailText}>Most played category</Text>
                <Text style={styles.responseText}>{mostPlayedCategory.name}</Text>
            </View>
        </ScrollView>
    )
}





const styles = EStyleSheet.create({

    container: {
        flex: 1,
        paddingVertical: responsiveScreenHeight(2),
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#2D53A0',
        borderColor: '#FFAA00',
        borderBottomWidth: 4,
        justifyContent: 'space-around',
        height: 50,
        alignItems: 'center',
        marginVertical: normalize(20)
    },
    avatar: {
        height: 71,
        width: 71,
        borderRadius: 50,
        borderColor: '#FFAA00',
        borderWidth: 2,
        marginTop: -25,
        backgroundColor: '#fff'
    },
    headerTextCase: {
        width: '50%',
        alignItems: "flex-start",
    },
    headerText: {
        fontFamily: 'blues-smile',
        color: '#fff',
        fontSize: '1.2rem'
    },
    title: {
        fontFamily: 'blues-smile',
        color: '#fff',
        fontSize: '2rem',
        textAlign: 'center',
        marginTop: normalize(20)
    },
    detailContainer: {
        paddingHorizontal: responsiveScreenWidth(3),
    },
    detail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: '#151C2F',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(15),
        marginVertical: '0.5rem',
        alignItems: 'center',
        borderRadius: 5
    },
    detailText: {
        fontSize: '1rem',
        fontFamily: 'poppins',
        color: '#fff'
    },
    responseText: {
        fontSize: '1rem',
        fontFamily: 'poppins',
        color: '#fff',
    },

});
