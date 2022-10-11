import React from "react";
import { Text, View } from 'react-native';
import EStyleSheet from "react-native-extended-stylesheet";
import normalize, { responsiveScreenWidth } from "../utils/normalize";
import { formatCurrency } from "../utils/stringUtl";

const UserWalletBalance = ({ balance, style,textstyle }) => {
    return (
        <View style={[styles.amountContainer, style]}>
            <Text style={[styles.availableAmount, textstyle]}>
                Wallet Balance: &#8358;{formatCurrency(balance)}
            </Text>
        </View>
    );
}

export default UserWalletBalance;

const styles = EStyleSheet.create({
    amountContainer: {
        backgroundColor: "#F3F3F3",
        paddingVertical: normalize(12),
        paddingHorizontal: responsiveScreenWidth(8),
        borderRadius: 64,
    },
    availableAmount: {
        fontFamily: "graphik-medium",
        fontSize: "0.7rem",
        color: "#01A7DB",
        textAlign: "center",
    },
})