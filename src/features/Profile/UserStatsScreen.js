import React from 'react';
import { Text, View, ScrollView, Platform } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector } from 'react-redux';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import UserItems from '../../shared/UserItems';
import LottieAnimations from '../../shared/LottieAnimations';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import AppHeader from '../../shared/AppHeader';
import TopIcons from '../../shared/TopIcons';
import { Image } from 'react-native';
import { isTrue } from '../../utils/stringUtl';
import Constants from 'expo-constants';


export default function UserStatsScreen({ navigation }) {

    useApplyHeaderWorkaround(navigation.setOptions);

    const user = useSelector(state => state.auth.user)


    return (
        <MixedContainerBackground>
            <TopIcons />
            <View style={styles.container}>
                <AppHeader />
                <View style={styles.header}>
                    <Image
                        style={styles.avatar}
                        source={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../assets/images/user-icon.png")}

                    />
                    <View style={styles.headerTextCase}>
                        <Text style={styles.headerText}>Creativity</Text>
                    </View>
                </View>
                <Detail
                    username={user.username}
                    firstName={user.firstName}
                    lastName={user.lastName}
                    gamesPlayed={user.gamesCount}
                    globalRanking={user.globalRank}
                    winRate={user.winRate}
                    challengesPlayed={user.totalChallenges}
                    userPoint={user.points}
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
    challengesPlayed,
    userPoint
}) => {
    return (
        <View style={styles.detailContainer}>
            <Text style={styles.title}>Statistics</Text>
            <View style={styles.detail}>
                <Text style={styles.detailText}>All Time Best</Text>
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
                <Text style={styles.detailText}>Challenges Played</Text>
                <Text style={styles.responseText}>{challengesPlayed}</Text>
            </View>
        </View>
    )
}





const styles = EStyleSheet.create({

    container: {
        flex: 1,
        paddingVertical: normalize(25),
        // marginBottom: normalize(20)
    },
    header: {
        flexDirection: 'row',
        backgroundColor: '#2D53A0',
        borderColor: '#FFAA00',
        borderBottomWidth: 4,
        justifyContent: 'space-around',
        height: 50,
        alignItems: 'center'
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
    title:{
        fontFamily: 'blues-smile',
        color: '#fff',
        fontSize: '2rem',
        textAlign: 'center',
        marginTop: normalize(20)
    },
    detailContainer:{
        paddingHorizontal:responsiveScreenWidth(3),
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
        fontFamily: 'graphik-medium',
        color: '#fff'
    },
    responseText: {
        fontSize: '1rem',
        fontFamily: 'graphik-medium',
        color: '#fff',
    },

});
