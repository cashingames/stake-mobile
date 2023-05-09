import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import SwiperFlatList from "react-native-swiper-flatlist";
import normalize from "../../utils/normalize";
import { useNavigation } from "@react-navigation/native";
import logToAnalytics from "../../utils/analytics";

const LeaderboardCards = () => {
    return (
        <View style={styles.leadersContainer}>
            <SwiperFlatList>
                <BoostsCard />
                <TopLeaderboards />
                <ChallengeLeaderboard />
            </SwiperFlatList>
        </View>
    )
}

const TopLeaderboards = () => {
    return (
        <Pressable style={styles.topLeadersContainer}>
            <Text style={styles.topLeadersHeader}>Leaderboard</Text>
            <Image
                source={require('../../../assets/images/leader-coin.png')}
                style={styles.avatar}
            />
            <Text style={styles.topLeadersText}>Top leaders based on earnings</Text>
            <View style={styles.playButton}>
                <Text style={styles.playButtonText}>
                    Coming Soon!!
                </Text>
            </View>
        </Pressable>
    )
}
const ChallengeLeaderboard = () => {
    return (
        <Pressable style={styles.challengeContainer}>
            <Text style={styles.topLeadersHeader}>Leaderboard</Text>
            <Image
                source={require('../../../assets/images/challenge-coin.png')}
                style={styles.avatar}
            />
            <Text style={styles.topLeadersText}>Daily & weekly challenges</Text>
            <View style={styles.challengeButton}>
                <Text style={styles.playButtonText}>
                    Coming Soon!!
                </Text>
            </View>
        </Pressable>
    )
}
const BoostsCard = () => {
    const navigation = useNavigation();
    const goToStore = async () => {
        logToAnalytics("boost_card_clicked")
        navigation.navigate('GameStore')
    }
    return (
        <Pressable style={styles.boostsContainer} onPress={goToStore}>
            <Text style={styles.topLeadersHeader}>Boost</Text>
            <Image
                source={require('../../../assets/images/boost-chest.png')}
                style={styles.avatar}
            />
            <Text style={styles.topLeadersText}>Bonuses, Time freeze, Skip & Bombs</Text>
            <View style={styles.boostButton}>
                <Text style={styles.playButtonText}>
                    Learn More
                </Text>
            </View>
        </Pressable>
    )
}
export default LeaderboardCards;

const styles = EStyleSheet.create({
    leadersContainer: {
        marginTop: '1.5rem'
    },
    topLeadersContainer: {
        backgroundColor: '#FEECE7',
        borderColor: '#FA5F4A',
        borderWidth: 2,
        borderRadius: 13,
        width: normalize(208),
        height: normalize(258),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1rem',
        // marginRight: '1rem',
        opacity: 0.6,
        paddingHorizontal: '1rem'
    },
    challengeContainer: {
        backgroundColor: '#EBFAED',
        borderColor: '#71DC7F',
        borderWidth: 2,
        borderRadius: 13,
        width: normalize(208),
        height: normalize(258),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1rem',
        marginRight: '1rem',
        opacity: 0.6,
        paddingHorizontal: '1rem'
    },
    boostsContainer: {
        backgroundColor: '#F6F4FF',
        borderColor: '#917BFE',
        borderWidth: 2,
        borderRadius: 13,
        width: normalize(208),
        height: normalize(258),
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: '1rem',
        paddingHorizontal: '1rem',
        marginRight: '1rem',

    },
    topLeadersHeader: {
        fontSize: '1.1rem',
        color: '#072169',
        fontFamily: 'sansation-bold',
    },
    topLeadersText: {
        fontSize: '1rem',
        color: '#072169',
        fontFamily: 'sansation-regular',
        textAlign: 'center'
    },
    playButton: {
        backgroundColor: '#FA5F4A',
        paddingVertical: '.7rem',
        paddingHorizontal: '1.7rem',
        borderRadius: 20
    },
    challengeButton: {
        backgroundColor: '#71DC7F',
        paddingVertical: '.7rem',
        paddingHorizontal: '1.7rem',
        borderRadius: 20
    },
    boostButton: {
        backgroundColor: '#917BFE',
        paddingVertical: '.7rem',
        paddingHorizontal: '1.7rem',
        borderRadius: 20
    },
    playButtonText: {
        fontSize: '.95rem',
        color: '#E3ECF2',
        fontFamily: 'sansation-bold',
    },
})