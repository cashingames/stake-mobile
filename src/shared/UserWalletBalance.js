import React from "react";
import { Text } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import normalize, { responsiveScreenWidth } from "../utils/normalize";
import { formatCurrency } from "../utils/stringUtl";

const UserWalletBalance = ({ balance, style}) => {
    return (
        <Text style={[styles.availableAmount, style]}>
            Wallet Balance: &#8358;{formatCurrency(balance)}
        </Text>
    );
}

export default UserWalletBalance;

const styles = EStyleSheet.create({
    availableAmount: {
        fontFamily: "graphik-medium",
        fontSize: "0.7rem",
        color: "#01A7DB",
        textAlign: "center",
        backgroundColor: "#F3F3F3",
        paddingVertical: normalize(12),
        paddingHorizontal: responsiveScreenWidth(8),
        borderRadius: 64,
    },
})