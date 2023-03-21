import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import messaging from '@react-native-firebase/messaging';

import axios from "axios";

import PageLoading from './shared/PageLoading';
import HomeRouter from './features/Home/HomeRouter';
import FundWalletScreen from './features/Transactions/FundWalletScreen';
import FundWalletCompleted from './features/Transactions/FundWalletCompleted';
import TransactionScreen from './features/Transactions/TransactionScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import InviteFriendsScreen from './screens/InviteFriendsScreen';
import UserProfileScreen from './features/Profile/UserProfileScreen';
import ChangePasswordScreen from './features/Profile/ChangePasswordScreen';
import BankDetailsScreen from './features/Profile/BankDetailsScreen';
import EditProfileDetailsScreen from './features/Profile/EditProfileDetailsScreen';
import SupportQuestionsScreen from './features/Support/SupportQuestionsScreen';
import SupportAnswerScreen from './features/Support/SupportAnswerScreen';

import { isLoggedIn, logoutUser, verifyDeviceToken } from './features/Auth/AuthSlice';
import { isTrue } from './utils/stringUtl';
import GameInProgressScreen from './features/Games/GameInProgressScreen';
import GameEndResultScreen from './features/Games/GameEndResultScreen';
import LoginScreen from './features/Auth/LoginScreen';
import SignupScreen from './features/Auth/SignupScreen';
import ForgotPasswordScreen from './features/Auth/ForgotPasswordScreen';
import ResetPasswordScreen from './features/Auth/ResetPasswordScreen';
import ResetPasswordSuccessScreen from './features/Auth/ResetPasswordSuccessScreen';
import GameBoostPurchaseSuccessfulScreen from './features/Store/GameBoostPurchaseSuccessfulScreen';
import GameStoreScreen from './features/Store/GameStoreScreen';
import GameStoreItemsPurchaseFailed from './features/Store/GameStoreItemsPurchaseFailedScreen';
import SelectGameCategoryScreen from './features/Games/SelectGameCategoryScreen';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import routeDecider from './utils/notificationRouteDecider';
import analytics from '@react-native-firebase/analytics';
import GameStakingScreen from './features/Games/GameStakingScreen';
import NotificationsScreen from './features/Notifications/NotificationsScreen';
import SignupVerifyPhoneScreen from './features/Auth/SignupVerifyPhoneScreen';
import ReviewStakeScreen from './features/Games/ReviewStakeScreen';
import LandingPage from './features/LandingPage/LandingPage';
import HelpPages from './features/Support/HelpPages';
import ContactUs from './features/Support/ContactUs';
import AuthContactUs from './features/Support/AuthContactUs';
import EmailVerificationScreen from './features/Auth/EmailVerificationScreen';
import GameLoadingScreen from './features/Games/GameLoadingScreen';
import ChallengeSelectPlayerScreen from './features/Games/ChallengeSelectPlayerScreen';

const AppStack = createNativeStackNavigator();

function AppRouter() {
	const navigation = useNavigation();
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(true);

	const token = useSelector(state => state.auth.token);
	const showIntro = useSelector(state => state.auth.showIntro);
	appendAxiosAuthHeader(token);


	//during app restart, check localstorage for these info
	useEffect(() => {
		setupAxios();
		const _1 = dispatch(isLoggedIn());
		setLoading(true);
		Promise.all([_1]).then(() => {
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		if (!isTrue(token)) {
			return;
		}

		registerForPushNotificationsAsync().then(deviceToken => {
			dispatch(verifyDeviceToken(deviceToken))
		});

		messaging().onNotificationOpenedApp(async remoteMessage => {
			if (!remoteMessage) return;

			await analytics().logEvent("bg_notification", {
				state: "background"
			})
			routeDecider(remoteMessage, navigation);

		});

		// Check whether an initial notification is available
		messaging()
			.getInitialNotification()
			.then(async remoteMessage => {
				if (remoteMessage) {
					await analytics().logEvent("bg_notification", {
						state: "quit"
					})
				}
				routeDecider(remoteMessage, navigation);
			});
		// return unsubscribe;
	}, [token]);


	if (loading) {
		return <PageLoading spinnerColor="#0000ff" />
	}

	return (
		<AppStack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'white' } }} >
			{isTrue(token) ?
				(
					<>
						<AppStack.Screen options={{ headerShown: false }} name="AppRouter" component={HomeRouter} />
						{/* game */}
						<AppStack.Screen name="SelectGameCategory" component={SelectGameCategoryScreen} options={{
							title: 'Select Game',
							headerStyle: {
								backgroundColor: '#5d5fef',
							},
							headerTintColor: '#FFFF',
						}} />
						<AppStack.Screen name="GameStaking" component={GameStakingScreen} options={{ title: 'Game Staking' }} />
						<AppStack.Screen name="GameLoading" component={GameLoadingScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="ReviewStake" component={ReviewStakeScreen} options={{ title: 'Review Stake' }} />
						<AppStack.Screen name="GameInProgress" component={GameInProgressScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="GameEndResult" component={GameEndResultScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="ChallengeSelectPlayer" component={ChallengeSelectPlayerScreen} options={{ title: 'Select Player' }} />




						{/** wallet */}
						<AppStack.Screen name="FundWallet" component={FundWalletScreen} options={{ title: 'Fund Wallet' }} />
						<AppStack.Screen name="Transactions" component={TransactionScreen} options={{ title: 'Transactions' }} />
						<AppStack.Screen name="FundWalletCompleted" component={FundWalletCompleted} options={{ headerShown: false }} />

						{/* user profile */}
						<AppStack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'Profile' }} />
						<AppStack.Screen name="EditDetails" component={EditProfileDetailsScreen} options={{ title: 'Edit Details' }} />
						<AppStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
						<AppStack.Screen name="BankDetails" component={BankDetailsScreen} options={{ title: 'Bank Details' }} />
						<AppStack.Screen name="EmailVerification" component={EmailVerificationScreen} options={{ title: 'Email Verification' }} />


						{/** store */}
						<AppStack.Screen name="GameStore" component={GameStoreScreen} options={{ title: 'Store', headerShadowVisible: false }} />
						<AppStack.Screen name="GameBoostPurchaseSuccessful" component={GameBoostPurchaseSuccessfulScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="GameStoreItemsPurchaseFailed" component={GameStoreItemsPurchaseFailed} options={{ headerShown: false }} />

						<AppStack.Screen name="Invite" component={InviteFriendsScreen} options={{ title: 'Invite Friends' }} />
						<AppStack.Screen name="Notifications" component={NotificationsScreen} options={{
							title: 'Notifications',
							headerStyle: {
								backgroundColor: '#FFE900',
							},
							headerTintColor: '#000000',
						}} />

					</>
				) :
				(

					<AppStack.Group screenOptions={{ title: "", headerShadowVisible: false }}>
						{/* unauthenticated */}
						{showIntro &&
							<AppStack.Screen name="Landing" component={LandingPage} options={{ headerShown: false }} />
						}
						<AppStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="AuthContact" component={AuthContactUs} options={{ headerShown: false }} />
						<AppStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
						<AppStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
						<AppStack.Screen name="ResetPasswordSuccess" component={ResetPasswordSuccessScreen} />
						<AppStack.Screen name="SignupVerifyPhone" component={SignupVerifyPhoneScreen} options={{ headerShown: false }} />
					</AppStack.Group >
				)
			}

			{/** general */}
			<AppStack.Screen name="Terms" component={TermsAndConditionsScreen} options={{ title: 'Terms & Conditions' }} />
			<AppStack.Screen name="Privacy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
			<AppStack.Screen name="Help" component={HelpPages} options={{ title: 'Support' }} />
			<AppStack.Screen name="Support" component={SupportQuestionsScreen} options={{ title: 'Help' }} />
			<AppStack.Screen name="Answer" component={SupportAnswerScreen} options={{ title: 'Details' }} />
			<AppStack.Screen name="ContactUs" component={ContactUs} options={{ title: 'Contact Us' }} />
		</AppStack.Navigator >
	)
}

export default AppRouter;

const setupAxios = async function () {
	console.log("base url", Constants.expoConfig.extra.apiBaseUrl)
	axios.defaults.baseURL = Constants.expoConfig.extra.apiBaseUrl;
	//axios logout on 401
	axios.interceptors.response.use(
		response => response,
		error => {
			console.log(error.config.url, error.message);

			if (error.response && error.response.status === 401) {
				dispatch(logoutUser());
			} else if (error.request) {
				// The request was made but no response was received
				// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
				// http.ClientRequest in node.js
				// console.log(error.request);
			} else {
				// Something happened in setting up the request that triggered an Error
				// console.log('Error', error.message);
			}
			return Promise.reject(error);
		});

	axios.interceptors.request.use(request => {
		// console.log('Starting Request', JSON.stringify(request.url, null, 2))
		return request
	})

}

const appendAxiosAuthHeader = function (token) {
	axios.defaults.headers.common['x-brand-id'] = 2; //@TODO Change to 1

	if (token) {
		axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
	} else {
		axios.defaults.headers.common['Authorization'] = null;
		/*if setting null does not remove `Authorization` header then try  */
		delete axios.defaults.headers.common['Authorization'];
	}
};

async function registerForPushNotificationsAsync() {
	let deviceToken;
	if (!Device.isDevice) {
		Alert.alert('Must use physical device for Push Notifications')
		return;
	}
	const { status: existingStatus } = await Notifications.getPermissionsAsync();
	let finalStatus = existingStatus;
	if (existingStatus !== 'granted') {
		const { status } = await Notifications.requestPermissionsAsync();
		finalStatus = status;
	}
	if (finalStatus !== 'granted') {
		Alert.alert('Failed to get push token for push notification!');
		return;
	}
	deviceToken = (await Notifications.getDevicePushTokenAsync()).data;



	if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('default', {
			name: 'default',
			importance: Notifications.AndroidImportance.MAX,
			vibrationPattern: [0, 250, 250, 250],
			lightColor: '#FF231F7C',
		});
	}

	return deviceToken;
}

