import React, { useState } from "react";
import { Text, View, Image, Alert, ScrollView } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import Constants from "expo-constants";

import normalize, {
  responsiveScreenWidth,
} from "../../utils/normalize";
import { getUser } from "../Auth/AuthSlice";
import AppButton from "../../shared/AppButton";
import Input from "../../shared/Input";
import { formatCurrency } from "../../utils/stringUtl";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import { Paystack } from "react-native-paystack-webview";
import analytics from '@react-native-firebase/analytics';


export default function FundWalletScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useApplyHeaderWorkaround(navigation.setOptions);

  const user = useSelector((state) => state.auth.user);
  const [amount, setAmount] = useState("");
  const [showPayment, setShowPayment] = React.useState(false);
  const minimumWalletFundableAmount = useSelector(state => state.common.minimumWalletFundableAmount);
  
  const transactionCompleted = async (res) => {
    // verifyFunding(res.reference); for local testing
    await analytics().logEvent('wallet_funding_successfully', {
      'id': user.username,
      'phone_number': user.phoneNumber,
      'email': user.email,
      'currency': 'NGN',
      'amount_funded': amount
    });
    dispatch(getUser());
    setShowPayment(false);
    navigation.navigate("Wallet");
  };

  const startPayment = async () => {
    await analytics().logEvent('funding_wallet_initiated', {
      'id': user.username,
      'phone_number': user.phoneNumber,
      'email': user.email
    });
    const cleanedAmount =
      amount.trim().length === 0 ? 0 : Number.parseFloat(amount);
    if (cleanedAmount < minimumWalletFundableAmount) {
      Alert.alert(`Amount cannot be less than ${minimumWalletFundableAmount} naira`);
      return false;
    }
    setShowPayment(true);
  };

  return (
    <>
      {!showPayment && (
        <ScrollView style={styles.container}>
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
              placeholder="500"
              min
            />
            <View style={styles.flag}>
              <Image
                source={require("../../../assets/images/naija_flag.png")}
              />
              <Text style={styles.flagText}>NGN</Text>
            </View>
          </View>

        </ScrollView>
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
            Alert.alert("Failed...");
          }}
          onSuccess={transactionCompleted}
          autoStart={true}
        />
      )}
      <AppButton
        text="Fund Wallet"
        onPress={startPayment}
        style={styles.actionButton}
      />
    </>
  );
}

const UserWalletBalance = ({ balance }) => {
  return (
    <Text style={styles.availableAmount}>
      Bal: &#8358;{formatCurrency(balance)}
    </Text>
  );
};

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
    marginBottom: normalize(40),
    paddingVertical: normalize(12),
    paddingHorizontal: responsiveScreenWidth(8),
    borderRadius: 64,
  },
  fundAmount: {
    fontFamily: "graphik-bold",
    fontSize: "2.2rem",
    color: "#333333",
    marginVertical: normalize(20),
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
    position: 'absolute',
    bottom: 0,
    width: responsiveScreenWidth(90),
    height: responsiveScreenWidth(12),
  },
});
