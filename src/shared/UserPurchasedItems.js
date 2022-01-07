import React from "react";
import { StyleSheet, Text, View, Image, Alert } from 'react-native';
import normalize from "../utils/normalize";
import { formatNumber } from '../utils/stringUtl';
import { useSelector } from 'react-redux';



const UserItems = () => {

    return (
        <View style={styles.userItemsContainer}>
            <Image
                source={require('../../assets/images/shooting-star.png')}
            />
            <View>
                <UserGamePlans />
                <View style={styles.hr}><Text></Text></View>
                <UserBoosts />
            </View>
        </View>
    )
}
const UserBoosts = () => {
    var boosts = useSelector(state => state.auth.user.boosts);
    return (
        <View style={styles.userBoosts}>
            {boosts.map((boost, i) => <UserBoost key={i} boost={boost} />)}
        </View>
    )
}
const UserBoost = ({ boost }) => {
    return (
        <>
            <Text style={styles.userAvailableItems}>{formatNumber(boost.count)} {boost.name} </Text>
        </>
    )
}
const UserGamePlans = () => {
    var plans = useSelector(state => state.auth.user.activePlans);
    console.log(plans)
    return (
        <View style={styles.userGamePlans}>
            {plans.map((plan, i) => <UserGamePlan key={i} plan={plan} />)}
        </View>
    )
}
const UserGamePlan = ({ plan }) => {
    return (
        <View style={styles.userGamePlan}>
            <Text style={styles.userAvailableItems}>{plan.name}</Text>
            <Text style={styles.userAvailableItems}>{plan.description}</Text>
        </View>
    )
};
const styles = StyleSheet.create({

    playedTitle: {
        fontSize: 15,
        color: '#4F4F4F',
        fontFamily: 'graphik-bold',
        lineHeight: 17,
        marginTop: normalize(8),
    },
    planInstruction: {
        color: '#151C2F',
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
        lineHeight: 17,
        opacity: 0.7,
        marginVertical: normalize(10)
    },
    userGamePlan: {
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 15,
        paddingVertical: normalize(10),
        width: normalize(80),
        alignItems: 'center',
        marginLeft: normalize(10)
    },
    userGamePlans: {
        flexDirection: 'row',
        // flexWrap: 'wrap'
    },
    userItemsContainer: {
        backgroundColor: '#518EF8',
        borderRadius: 15,
        paddingHorizontal: normalize(5),
        paddingVertical: normalize(12),
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(15)
    },
    hr: {
        borderBottomColor: '#B1CEFF',
        borderBottomWidth: normalize(1),
        width: normalize(180)
    },
    userBoosts: {
        flexDirection: 'row',
        marginTop: normalize(10),
        justifyContent:'flex-end'
    },
    userAvailableItems: {
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
        textAlign:'center'
    },
    planInformation: {
        alignItems:'center'
    }
});
export default UserItems;