import React from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../../utils/normalize";
import { formatCurrency } from "../../utils/stringUtl";
import { useDispatch, useSelector } from "react-redux";
import { setCashMode, setGameMode, setGameType } from "../Games/GameSlice";
import { useNavigation } from "@react-navigation/native";
import logToAnalytics from "../../utils/analytics";

const CashDropScreen = () => {
    const user = useSelector(state => state.auth.user);

    const drops = [
        {
            "id": 1,
            "bannerImage": require('../../../assets/images/gold-badge.png'),
            "name": 'Gold Cash Drop',
            "amount": 200000,
            "backgroundColor": '#F3E9C7'
        },
        {
            "id": 2,
            "bannerImage": require('../../../assets/images/silver-badge.png'),
            "name": 'Silver Cash Drop',
            "amount": 123000,
            "backgroundColor": '#EAEAEA'
        },
        {
            "id": 3,
            "bannerImage": require('../../../assets/images/bronze-badge.png'),
            "name": 'Bronze Cash Drop',
            "amount": 25000,
            "backgroundColor": '#EECCAB'

        },

    ]

    const winners = [
        {
            "id": 1,
            "badgeImage": require('../../../assets/images/gold-badge.png'),
            "firstName": 'Ugo',
            "lastName": 'Ada',
            "avatar": require('../../../assets/images/user-icon.png'),
            "badgeRank": "Gold winner",
            "dropName": 'Gold Cash Drop',
            "dropAmount": 200000,
            "backgroundColor": '#F3E9C7'
        },
        {
            "id": 2,
            "badgeImage": require('../../../assets/images/silver-badge.png'),
            "firstName": 'Ugo',
            "lastName": 'Ada',
            "avatar": require('../../../assets/images/user-icon.png'),
            "badgeRank": "Silver winner",
            "dropName": 'Silver Cash Drop',
            "dropAmount": 123000,
            "backgroundColor": '#EAEAEA'
        },
        {
            "id": 3,
            "badgeImage": require('../../../assets/images/bronze-badge.png'),
            "firstName": 'Ugo',
            "lastName": 'Ada',
            "avatar": require('../../../assets/images/user-icon.png'),
            "badgeRank": "Bronze winner",
            "dropAmount": 25000,
            "backgroundColor": '#EECCAB'
        },
        {
            "id": 4,
            "badgeImage": require('../../../assets/images/silver-badge.png'),
            "firstName": 'Ugo',
            "lastName": 'Ada',
            "avatar": require('../../../assets/images/user-icon.png'),
            "badgeRank": "Silver winner",
            "dropName": 'Silver Cash Drop',
            "dropAmount": 123000,
            "backgroundColor": '#EAEAEA'
        },
        {
            "id": 5,
            "badgeImage": require('../../../assets/images/gold-badge.png'),
            "firstName": 'Ugo',
            "lastName": 'Ada',
            "avatar": require('../../../assets/images/user-icon.png'),
            "badgeRank": "Gold winner",
            "dropName": 'Gold Cash Drop',
            "dropAmount": 200000,
            "backgroundColor": '#F3E9C7'
        },
        {
            "id": 6,
            "badgeImage": require('../../../assets/images/bronze-badge.png'),
            "firstName": 'Ugo',
            "lastName": 'Ada',
            "avatar": require('../../../assets/images/user-icon.png'),
            "badgeRank": "Bronze winner",
            "dropName": 'Bronze Cash Drop',
            "dropAmount": 25000,
            "backgroundColor": '#EECCAB'
        },
    ]

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.dropInfoText}>Three lucky winners win the pools every week! Will it be you?</Text>
            <View style={styles.dropsContainer}>
                {
                    drops.map((drop, i) => <DropBanner key={i} drop={drop} user={user}
                    />)
                }
            </View>
            <Text style={styles.winnersHeader}>Recent winners</Text>
            <View style={styles.winnersContainer}>
                {
                    winners.map((winner, i) => <RecentWinner key={i} winner={winner} user={user}
                    />)
                }
            </View>
        </ScrollView>
    )
}

const DropBanner = ({ drop, user }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const gameMode = useSelector(state => state.common.gameModes[0]);
    const gameType = useSelector(state => state.common.gameTypes[0]);

    const stakeNow = () => {
        dispatch(setGameMode(gameMode));
        dispatch(setGameType(gameType));
        dispatch(setCashMode(true));
        logToAnalytics("drop_stake_now_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            'drop_title': drop.name,
        })
        navigation.navigate('SelectGameCategory')
    }

    return (
        <View style={[styles.dropContainer, { backgroundColor: drop.backgroundColor }]}>
            <View style={styles.badgeContainer}>
                <Image
                    source={drop.bannerImage}
                    style={styles.badgeAvatar}
                />
            </View>
            <View style={styles.dropDetails}>
                <Text style={styles.dropName}>{drop.name}</Text>
                <View style={styles.amountContainer}>
                    <Text style={styles.amountDigit}>{formatCurrency(drop.amount)}</Text>
                    <Text style={styles.amountCurrency}>NGN</Text>
                </View>
            </View>
            <Pressable onPress={stakeNow} style={styles.stakeContainer}>
                <Text style={styles.stakeText}>Stake now</Text>
            </Pressable>

        </View>
    )
}

const RecentWinner = ({ winner, user }) => {
    const navigation = useNavigation();

    const viewWinner = () => {
        logToAnalytics("drop_winner_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            'drop_winner': winner.firstName,
        })
        navigation.navigate('DropWinner', {
            winner_rank: winner.badgeRank,
            winner_avatar: winner.avatar,
            winner_badge: winner.badgeImage,
            winner_firstname: winner.firstName,
            winner_lastname: winner.lastName,
            won_drop: winner.dropName,
            drop_amount: winner.dropAmount,
            drop_background: winner.backgroundColor
        })
    }

    return (
        <Pressable style={styles.winnerContainer} onPress={viewWinner}>
            <Image
                source={winner.avatar}
                style={styles.winnerAvatar}
            />
            <Image
                source={winner.badgeImage}
                style={styles.badgeIcon}
            />
            <View style={styles.winnerNames}>
                <Text style={styles.winnerFullname}>{winner.firstName} {winner.lastName}</Text>
            </View>
        </Pressable>
    )
}

export default CashDropScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(22)
    },
    dropInfoText: {
        fontSize: '1rem',
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        textAlign: 'center',
        paddingHorizontal: '1rem',
        marginBottom: '1.5rem'

    },
    dropsContainer: {
        flexDirection: 'column'
    },
    dropContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: '1rem',
        paddingTop: '.7rem',
        paddingBottom: '1.1rem',
        borderRadius: 13,
        marginBottom: '.7rem',
        borderWidth: 1,
        borderColor: '#E5E5E5'
    },
    badgeContainer: {
        backgroundColor: '#FFF',
        borderRadius: 100,
        padding: '.2rem',
        width: '3.3rem',
        height: '3.3rem'
    },
    badgeAvatar: {
        width: '3.7rem',
        height: '3.7rem',
        position: 'absolute',
        top: '.3rem'
    },
    dropDetails: {
        flexDirection: 'column'
    },
    dropName: {
        fontSize: '.9rem',
        color: '#1C453B',
        fontFamily: 'gotham-medium',
    },
    amountContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '.2rem'
    },
    amountDigit: {
        fontSize: '.9rem',
        color: '#1C453B',
        fontFamily: 'sansation-bold',
        marginRight: '.2rem'
    },
    amountCurrency: {
        fontSize: '.7rem',
        color: '#1C453B',
        fontFamily: 'sansation-regular',
    },
    stakeContainer: {
        backgroundColor: '#FA5F4A',
        borderRadius: 30,
        paddingVertical: '.2rem',
        paddingHorizontal: '.4rem',
        alignItems: 'center'
    },
    stakeText: {
        fontSize: '.55rem',
        color: '#F9FBFF',
        fontFamily: 'gotham-medium',
    },
    winnersHeader: {
        fontSize: '1.15rem',
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        textAlign: 'center',
        marginTop: '.8rem'
    },
    winnersContainer: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        flexWrap:'wrap',
        marginTop:'1.2rem'
    },
    winnerContainer: {
        flexDirection:'column',
        alignItems:'center',
        width:'33.3%',
        marginBottom:'1.1rem',
    },
    winnerAvatar: {
        width: '4rem',
        height: '4rem',
        borderRadius: 100,
        borderWidth: 1,
        borderColor:'#E5E5E5'
    },
    badgeIcon: {
        width: '2.5rem',
        height: '2.5rem',
        position: 'absolute',
        top: '2.5rem',
    },
    winnerNames : {
       marginTop:'.9rem',
       backgroundColor:'#FA5F4A',
       borderRadius: 30,
       paddingVertical:'.2rem',
       paddingHorizontal: '.4rem',
       alignItems:'center'
    },
    winnerFullname : {
        fontSize: '.55rem',
        color: '#F9FBFF',
        fontFamily: 'gotham-medium',
    }
})