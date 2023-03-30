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
                <Text style={styles.name} numberOfLines={1}>{winner.username}</Text>
            </View>
            <Text style={styles.amount}>&#8358;{formatCurrency(winner.amountWon)}</Text>
            <Text style={styles.correct}>{winner.correctCount}/10</Text>
        </View>
    )
}

const styles = EStyleSheet.create({
    mainContainer: {
        paddingTop: normalize(18),
        // paddingBottom: normalize(8)
    },
    headerContainer: {
        display: 'flex',
        alignItems: 'center',
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
        borderBottomColor: 'rgba(0, 0, 0, 0.1)',
        borderBottomWidth: 1,
        paddingVertical: normalize(15)
    },
    nameContainer: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    avatar: {
        width: responsiveScreenWidth(10),
        height: responsiveScreenWidth(10),
        borderRadius: 50,
        // backgroundColor:'#072169',
        borderWidth: 1,
        borderColor: '#072169',
    },
    name: {
        color: '#000000',
        fontSize: '0.7rem',
        fontFamily: 'graphik-medium',
        marginLeft: normalize(9),
        width: responsiveScreenWidth(25),
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
        width: responsiveScreenWidth(10)
    },
})

