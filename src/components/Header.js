import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Ionicons } from '@expo/vector-icons';


const Header = ({ title }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() =>  navigation.openDrawer()}>
                <Ionicons name="menu" style={styles.menuIcon} size={36} />
            </TouchableOpacity>
            <View>
                <Text style={styles.headerTitle}>{title}</Text>
            </View>
            <View style={styles.headerIcons}>
                <TouchableOpacity onPress={() => navigation.navigate('Dashboard')}>
                    <Image
                        style={styles.pageIcon}
                        source={require('../../assets/images/Home.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('GameScreen')}>
                    <Image
                        style={styles.pageIcon}
                        source={require('../../assets/images/gamepad.png')}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate('WalletScreen')}>
                    <Image
                        style={styles.pageIcon}
                        source={require('../../assets/images/smallpurse.png')}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}
export default Header;

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
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        backgroundColor: '#fff',
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
