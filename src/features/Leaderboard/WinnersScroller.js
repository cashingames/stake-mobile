import React, { useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { formatCurrency, isTrue } from '../../utils/stringUtl';
import { useFocusEffect } from "@react-navigation/native";
import { getUser } from '../Auth/AuthSlice';
import { getStakeWinners } from '../CommonSlice';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from "react-native-extended-stylesheet";
import { Image } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';

export default function WinnersScroller() {
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
    const stakeWinners = useSelector(state => state.common.stakeWinners);
    console.log(stakeWinners)

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getUser());
            dispatch(getStakeWinners()).then(() => setLoading(false));
        }, [])
    );

    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" color='#000000' />
            </View>
        )
    }
    return (
        <View style={styles.mainContainer}>
            <View style={styles.headerContainer}>
                <Text style={styles.headerText}>Recent winners</Text>
            </View>
            {stakeWinners.map((winner) => <Winner
                key={winner.id}
                winner={winner}
            />)}
            {stakeWinners.length === 0 &&
                <Text style={styles.headerText}>No Winners</Text>
            }
        </View>
    );
}


const Winner = ({ winner }) => {
    return (
        <View style={styles.winnerContainer}>
            <View style={styles.nameContainer}>
                <Image
                    style={styles.avatar}
                    source={isTrue(winner.avatar) ? { uri: winner.avatar } : require("../../../assets/images/user-icon.png")}
                />
                <Text style={styles.name}>{winner.username}</Text>
            </View>
            <Text style={styles.amount}>&#8358;{formatCurrency(winner.amountWon)}</Text>
            <Text style={styles.correct}>{winner.correctCount}/10</Text>
        </View>
    )
}

const styles = EStyleSheet.create({
    mainContainer: {
        paddingTop: normalize(18),
        paddingBottom: normalize(40)
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
        marginVertical: normalize(10),
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingBottom: normalize(10)
    },
    headerText: {
        color: '#000000',
        fontSize: '1rem',
        fontFamily: 'graphik-medium',
    },
    winnerContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: normalize(10),
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingBottom: normalize(5)
    },
    nameContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: responsiveScreenWidth(11),
        height: responsiveScreenWidth(11),
        borderRadius: 50
    },
    name: {
        color: '#000000',
        fontSize: '0.7rem',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(5),
        width: responsiveScreenWidth(21)
    },
    amount: {
        color: '#000000',
        fontSize: '0.7rem',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(5),
        width: responsiveScreenWidth(18)
    },
    correct: {
        color: '#000000',
        fontSize: '0.7rem',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(5),
        width: responsiveScreenWidth(11)
    },
})

