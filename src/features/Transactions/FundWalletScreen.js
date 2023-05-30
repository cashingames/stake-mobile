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
import logToAnalytics from "../../utils/analytics";
import { Ionicons } from "@expo/vector-icons";
import { fetchUserTransactions } from "../CommonSlice";


export default function FundWalletScreen() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  useApplyHeaderWorkaround(navigation.setOptions);

  const user = useSelector((state) => state.auth.user);
  const [amount, setAmount] = useState("");
  const [showPayment, setShowPayment] = React.useState(false);
  const minimumWalletFundableAmount = useSelector(state => state.common.minimumWalletFundableAmount);
  const [paystackChecked, setPaystackChecked] = useState(false);
  const [flutterChecked, setFlutterChecked] = useState(false);

  const transactionCompleted = (res) => {
    // verifyFunding(res.reference); for local testing
    logToAnalytics('wallet_funding_successfully', {
      'product_id': user.username,
      'item_name': 'Wallet Funding',
      'currency': 'NGN',
      'value': formatCurrency(amount),
      'phone_number': user.phoneNumber,
      'email': user.email
    });
    dispatch(getUser());
    dispatch(fetchUserTransactions())
    setShowPayment(false);
    navigation.navigate("FundWalletCompleted");
  };
  const cleanedAmount =
    amount.trim().length === 0 ? 0 : Number.parseFloat(amount);
  const startPayment = () => {
    logToAnalytics('funding_wallet_initiated', {
      'product_id': user.username,
      'item_name': 'Wallet Funding',
      'currency': 'NGN',
      'value': formatCurrency(amount),
      'phone_number': user.phoneNumber,
      'email': user.email
    });

    if (cleanedAmount < minimumWalletFundableAmount) {
      Alert.alert(`Amount cannot be less than ${minimumWalletFundableAmount} naira`);
      return false;
    }
    if (paystackChecked) {
      setShowPayment(true);
    } else Alert.alert('This payment gateway is not available now');
  };


  const togglePaystack = () => {
    setFlutterChecked(false);
    setPaystackChecked(true);
  }

  const toggleFlutter = () => {
    setPaystackChecked(false);
    setFlutterChecked(true);
  }

  return (
    <View style={styles.headContainer}>
      {!showPayment && (
        <ScrollView style={styles.container}>
          <Input
            label='Enter amount'
            placeholder={`Minimum of NGN ${minimumWalletFundableAmount}`}
            value={amount}
            type="text"
            error={amount < minimumWalletFundableAmount && `Minimum fundable amount is NGN ${minimumWalletFundableAmount}`}
            onChangeText={setAmount}
            isRequired={true}
            keyboardType="numeric"
          />
          <View style={styles.gatewaysContainer}>
            <View style={styles.gatewayHeaders}>
              <Text style={styles.gatewayHeaderText}>Choose gateway</Text>
              <Text style={styles.gatewayRequired}>Required</Text>
            </View>
            <Text style={styles.gatewaySubHeader}>Select a preferred gateway to fund wallet</Text>
            <View style={styles.mainGatewayContainer}>
              <View style={styles.gatewayContainer}>
                <Ionicons name={paystackChecked ? 'checkmark-circle' : "ellipse-outline"} size={30} color={paystackChecked ? '#00FFA3' : '#D9D9D9'} onPress={togglePaystack} />
                <Image
                  style={styles.gatewayIcon}
                  source={require('../../../assets/images/paystack-icon.png')}
                />
              </View>
              <View style={styles.gatewayContainer}>
                <Ionicons name={flutterChecked ? 'checkmark-circle' : "ellipse-outline"} size={30} color={flutterChecked ? '#00FFA3' : '#D9D9D9'} onPress={toggleFlutter} />
                <Image
                  style={styles.gatewayIcon}
                  source={require('../../../assets/images/flutter-icon.png')}
                />
              </View>
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
          paystackKey={Constants.expoConfig.extra.paystackKey}
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
        disabled={!paystackChecked && !flutterChecked || (cleanedAmount < minimumWalletFundableAmount)}
        disabledStyle={styles.disabled}
      />
    </View>
  );
}

const styles = EStyleSheet.create({
  headContainer: {
    flex: 1,
    paddingHorizontal: normalize(22),
    backgroundColor: '#F9FBFF',
    paddingTop: normalize(40),
  },
  container: {
    flex: 1,
  },
  gatewaysContainer: {
    marginTop: '2rem'
  },
  gatewayHeaders: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '.6rem'
  },
  gatewayHeaderText: {
    fontFamily: 'gotham-medium',
    color: '#072169',
    fontSize: '0.98rem',
  },
  gatewayRequired: {
    fontFamily: 'sansation-regular',
    color: '#E15220',
    fontSize: '0.95rem',
  },
  gatewaySubHeader: {
    fontFamily: 'sansation-regular',
    color: '#072169',
    fontSize: '1rem',
    opacity: 0.5,
    marginTop: '.6rem',
    marginBottom: '2rem'
  },
  mainGatewayContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gatewayContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gatewayIcon: {
    marginLeft: '.5rem'
  },
  disabled: {
    backgroundColor: '#EA8663'
  },
});
