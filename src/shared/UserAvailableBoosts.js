import React from "react";
import { Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useSelector } from "react-redux";
import normalize from "../utils/normalize";
import UserAvailableBoost from "./UserAvailableBoost";

const UserAvailableBoosts = () => {

    const boosts = useSelector(state => state.auth.user.boosts);

    return (
        <View style={styles.availableBoosts1}>
            <Text style={styles.title1}>Available Boosts</Text>
            <View style={styles.boosts}>
                {boosts.map((boost, i) => <UserAvailableBoost boost={boost} key={i} />
                )}
            </View>
        </View>
    )
}
export default UserAvailableBoosts;

const styles = EStyleSheet.create({
    availableBoosts1: {
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(20),
    },
    boosts: {
        // alignItems: ''

    },
    title1: {
        fontSize: '0.82rem',
        fontFamily: 'graphik-medium',
        color: '#000',
        lineHeight: '1rem',
        marginBottom: normalize(15)
    },
})