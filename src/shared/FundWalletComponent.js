import React, { useState, useRef } from "react";
import { Text, View, Image, Alert } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";
import { Paystack } from "react-native-paystack-webview";
import useApplyHeaderWorkaround from "../utils/useApplyHeaderWorkaround";
import Input from "./Input";
import { getUser } from "../features/Auth/AuthSlice";
import AppButton from "./AppButton";
import normalize, { responsiveScreenWidth } from "../utils/normalize";
import { formatCurrency } from "../utils/stringUtl";

const FundWalletComponent = ({ onClose }) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    useApplyHeaderWorkaround(navigation.setOptions);

    const user = useSelector((state) => state.auth.user);
    const [amount, setAmount] = useState("");
    const [showPayment, setShowPayment] = useState(false);

    const ref = useRef(null);

    const transactionCompleted = (res) => {
        // verifyFunding(res.reference); for local testing
        dispatch(getUser());
        setShowPayment(false);
        onClose()
    };

    const startPayment = () => {
        var cleanedAmount =
            amount.trim().length === 0 ? 0 : Number.parseFloat(amount);
        // console.log(Number.parseFloat(amount));
        if (cleanedAmount < 100) {
            Alert.alert("Amount cannot be less than 100 naira");
            return false;
        }
        setShowPayment(true);
    };
    return (
        <View>
            <>
                {!showPayment && (
                    <View style={styles.container}>
                        <View style={styles.balance}>
                            <UserWalletBalance balance={user.walletBalance} />
                            <Text style={styles.walletTitle}>
                                How much do you want to deposit ? (&#8358;)
                            </Text>
                            <Input
                                style={styles.fundAmount}
                                value={amount}
                                keyboardType="numeric"
                                onChangeText={setAmount}
                                autoFocus={true}
                                placeholder="100"
                                min
                            />
                            <View style={styles.flag}>
                                <Image
                                    source={require("../../assets/images/naija_flag.png")}
                                />
                                <Text style={styles.flagText}>NGN</Text>
                            </View>
                        </View>
                        <AppButton
                            text="Fund Wallet"
                            onPress={startPayment}
                            style={styles.actionButton}
                        />
                    </View>
                )}

                {showPayment && (
                    <Paystack
                        channels={[
                            "card",
                            "bank",
                            "ussd",
                            "qr",
                            "mobile_money",
                            "bank_transfer",
                        ]}
                        paystackKey={Constants.manifest.extra.paystackKey}
                        amount={Number.parseFloat(amount)}
                        billingEmail={user.email}
                        activityIndicatorColor="green"
                        onCancel={(e) => {
                            setShowPayment(false);
                            alert("Failed...");
                        }}
                        onSuccess={transactionCompleted}
                        autoStart={true}
                    />
                )}
            </>
        </View>
    )
}

const UserWalletBalance = ({ balance }) => {
    return (
        <Text style={styles.availableAmount}>
            Wallet Balance: &#8358;{formatCurrency(balance)}
        </Text>
    );
}
export default FundWalletComponent;
const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#FFF",
    },
    balance: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        paddingVertical: normalize(38),
        backgroundColor: "#fff",
    },
    walletTitle: {
        fontFamily: "graphik-medium",
        fontSize: "0.7rem",
        color: "#7C7D7F",
    },
    availableAmount: {
        fontFamily: "graphik-medium",
        fontSize: "0.8rem",
        color: "#01A7DB",
        textAlign: "center",
        backgroundColor: "#F3F3F3",
        marginBottom: normalize(25),
        paddingVertical: normalize(10),
        paddingHorizontal: responsiveScreenWidth(8),
        borderRadius: 64,
    },
    fundAmount: {
        fontFamily: "graphik-bold",
        fontSize: "1rem",
        color: "#333333",
        marginVertical: normalize(15),
        width: responsiveScreenWidth(100),
        textAlign: "center",
    },
    flag: {
        flexDirection: "row",
        alignItems: "center",
    },
    flagText: {
        marginLeft: normalize(5),
        fontFamily: "graphik-medium",
        fontSize: "0.7rem",
        color: "#151C2F",
        opacity: 0.5,
    },
    actionButton: {
        marginHorizontal: normalize(18),
        alignItems: 'center',
    },
});