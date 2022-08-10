import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

import axios from "axios";

import PageLoading from './shared/PageLoading';
import HomeRouter from './features/Home/HomeRouter';
import ExtendedLeaderboard from './features/Leaderboard/ExtendedLeaderboard';
import FundWalletScreen from './features/Transactions/FundWalletScreen';
import FundWalletCompleted from './features/Transactions/FundWalletCompleted';
import TransactionScreen from './features/Transactions/TransactionScreen';
import TermsAndConditionsScreen from './screens/TermsAndConditionsScreen';
import PrivacyPolicyScreen from './screens/PrivacyPolicyScreen';
import InviteFriendsScreen from './screens/InviteFriendsScreen';
import UserProfileScreen from './features/Profile/UserProfileScreen';
import UserStatsScreen from './features/Profile/UserStatsScreen';
import ChangePasswordScreen from './features/Profile/ChangePasswordScreen';
import AchievementsMilestoneScreen from './features/Profile/AchievementsMilestoneScreen';
import BankDetailsScreen from './features/Profile/BankDetailsScreen';
import EditProfileDetailsScreen from './features/Profile/EditProfileDetailsScreen';
import SupportQuestionsScreen from './features/Support/SupportQuestionsScreen';
import SupportAnswerScreen from './features/Support/SupportAnswerScreen';

import { isLoggedIn, shouldShowIntro, verifyDeviceToken } from './features/Auth/AuthSlice';
import { isTrue } from './utils/stringUtl';
import GameModeScreen from './features/Games/GameModeScreen';
import GameInstructionsScreen from './features/Games/GameInstructionsScreen';
import GameInProgressScreen from './features/Games/GameInProgressScreen';
import GameEndResultScreen from './features/Games/GameEndResultScreen';
import IntroSlide from './features/Auth/IntroSlide';
import LoginScreen from './features/Auth/LoginScreen';
import SignupScreen from './features/Auth/SignupScreen';
import SignupProfileScreen from './features/Auth/SignupProfileScreen';
import ForgotPasswordScreen from './features/Auth/ForgotPasswordScreen';
import VerifyEmailScreen from './features/Auth/VerifyEmailScreen';
import ResetPasswordScreen from './features/Auth/ResetPasswordScreen';
import ResetPasswordSuccessScreen from './features/Auth/ResetPasswordSuccessScreen';
import GameBoostPurchaseSuccessfulScreen from './features/Store/GameBoostPurchaseSuccessfulScreen';
import GamePlanPurchaseSuccessfulScreen from './features/Store/GamePlanPurchaseSuccessfulScreen';
import GameStoreScreen from './features/Store/GameStoreScreen';
import GameStoreItemsPurchaseFailed from './features/Store/GameStoreItemsPurchaseFailedScreen';
import LeaderBoardFilter from './features/Leaderboard/LeaderBoardFilter';
import TriviaInstructionsScreen from './features/Games/TriviaInstructionsScreen';
import TriviaEndResultScreen from './features/Games/TriviaEndResultScreen';
// import TournamentScreen from './features/Games/TournamentScreen';
import LiveTriviaLeaderBoard from './features/LiveTrivia/LiveTriviaLeaderboard';
import LiveTriviasScreen from './features/Games/LiveTriviasScreen';
import ChallengeSelectPlayerScreen from './features/Games/ChallengeSelectPlayerScreen';
import AcceptDeclineChallengeScreen from './features/Games/AcceptDeclineChallengeScreen';
import ChallengeEndGameScreen from './features/Games/ChallengeEndGameScreen';
import ChallengeGameInProgressScreen from './features/Games/ChallengeGameInProgressScreen';
import ChallengeGameInstructionsScreen from './features/Games/ChallengeGameInstructionScreen';
import MyChallengesScreen from './features/Games/MyChallengesScreen';
import MyChallengesScoreScreen from './features/Games/MyChallengesScoreScreen.js';
import SignupVerifyEmailScreen from './features/Auth/SignupVerifyEmailScreen';
import EmailVerifiedScreen from './features/Auth/EmailVerifiedScreen';
import ChallengeNotPendingScreen from './features/Games/ChallengeNotPendingScreen';
import SelectGameCategoryScreen from './features/Games/SelectGameCategoryScreen';
import ChallengeInstructionsScreen from './features/Games/ChallengeInstructionScreen';

const AppStack = createNativeStackNavigator();

function AppRouter() {
	const dispatch = useDispatch();

	const [loading, setLoading] = useState(true);

	const token = useSelector(state => state.auth.token);
	const showIntro = useSelector(state => state.auth.showIntro);

	const notificationListener = useRef();
	const responseListener = useRef();
	const [notification, setNotification] = useState(false);
	const [pushToken, setPushToken] = useState('');

	Notifications.setNotificationHandler({
		handleNotification: async () => ({
			shouldShowAlert: true,
			shouldPlaySound: false,
			shouldSetBadge: false,
		}),
	});

	booststrapAxios(token); //sets basic api call params

	//during app restart, check localstorage for these info
	useEffect(() => {
		const _1 = dispatch(isLoggedIn());
		const _2 = dispatch(shouldShowIntro());

		Promise.all([_1, _2]).then(() => {
			setLoading(false);
		});
	}, []);

	useEffect(() => {
		if (isTrue(token)) {
			registerForPushNotificationsAsync().then(device_token => {
				setPushToken(device_token);
				// console.log("preparing to dispatch token to server", device_token);
				dispatch(verifyDeviceToken(device_token))

			});

			// This listener is fired whenever a notification is received while the app is foregrounded
			Notifications.addNotificationReceivedListener(notification => {
				console.log("foreground received", notification);
			});

			Notifications.addNotificationResponseReceivedListener(response => {
				console.log("from background", response)
			});

			// return () => {
			// 	Notifications.removeNotificationSubscription(notificationListener.current);
			// 	Notifications.removeNotificationSubscription(responseListener.current);
			// };
		}
	}, [token]);

	if (loading) {
		return <PageLoading spinnerColor="#0000ff" />
	}

	if (showIntro) {
		return <IntroSlide />;
	}

	return (
		<AppStack.Navigator screenOptions={{ headerStyle: { backgroundColor: 'white' } }} >
			{isTrue(token) ?
				(
					<>
						<AppStack.Screen options={{ headerShown: false }} name="AppRouter" component={HomeRouter} />

						<AppStack.Screen name="Leaderboard" component={ExtendedLeaderboard} options={{ title: 'Leaderboards', headerRight: () => <LeaderBoardFilter /> }} />
						<AppStack.Screen name="LiveTriviaLeaderboard" component={LiveTriviaLeaderBoard}
							options={{
								title: 'Leaderboard',
								headerStyle: {
									backgroundColor: '#072169',
								},
								headerTintColor: '#FFFF',
							}}
						/>

						{/* game */}
						<AppStack.Screen name="GameMode" component={GameModeScreen} options={{ title: 'Game Mode' }} />
						<AppStack.Screen name="SelectGameCategory" component={SelectGameCategoryScreen} options={{
							title: 'Select Game',
							headerStyle: {
								backgroundColor: '#5d5fef',
							},
							headerTintColor: '#FFFF',
						}} />
						<AppStack.Screen name="GameInstructions" component={GameInstructionsScreen} options={{ title: 'Game Instructions' }} />
						<AppStack.Screen name="ChallengeInstructions" component={ChallengeInstructionsScreen} options={{ title: 'Game Instructions' }} />
						<AppStack.Screen name="GameInProgress" component={GameInProgressScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="GameEndResult" component={GameEndResultScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="ChallengeSelectPlayer" component={ChallengeSelectPlayerScreen} options={{ title: 'Challenge - Select a player' }} />
						<AppStack.Screen name="ChallengeGameInstruction" component={ChallengeGameInstructionsScreen} options={{ title: 'Game Instructions' }} />
						<AppStack.Screen name="ChallengeGameInProgress" component={ChallengeGameInProgressScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="ChallengeEndGameScreen" component={ChallengeEndGameScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="AcceptDeclineChallenge" component={AcceptDeclineChallengeScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="MyChallengesScore" component={MyChallengesScoreScreen} options={{
							title: 'Scores',
							headerStyle: {
								backgroundColor: '#701F88',
							},
							headerTintColor: '#FFFF',
						}} />
						<AppStack.Screen name="MyChallenges" component={MyChallengesScreen} options={{
							title: 'My Challenges',
							headerStyle: {
								backgroundColor: '#701F88',
							},
							headerTintColor: '#FFFF',
						}} />

						<AppStack.Screen name="TriviaInstructions" component={TriviaInstructionsScreen} options={{ title: 'Game Instructions' }} />
						<AppStack.Screen name="TriviaEndResult" component={TriviaEndResultScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="LiveTrivias" component={LiveTriviasScreen} options={{
							title: 'Live Trivia',
							headerStyle: {
								backgroundColor: '#072169',
							},
							headerTintColor: '#FFFF',
						}} />



						{/** wallet */}
						<AppStack.Screen name="FundWallet" component={FundWalletScreen} options={{ title: 'Fund Wallet' }} />
						<AppStack.Screen name="Transactions" component={TransactionScreen} options={{ title: 'Transactions' }} />
						<AppStack.Screen name="FundWalletCompleted" component={FundWalletCompleted} options={{ headerShown: false }} />

						{/* user profile */}
						<AppStack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'Profile' }} />
						<AppStack.Screen name="EditDetails" component={EditProfileDetailsScreen} options={{ title: 'Edit Details' }} />
						<AppStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
						<AppStack.Screen name="UserStats" component={UserStatsScreen} options={{ title: 'Stats' }} />
						<AppStack.Screen name="AchievementsMilestone" component={AchievementsMilestoneScreen} options={{ title: 'Milestones' }} />
						<AppStack.Screen name="BankDetails" component={BankDetailsScreen} options={{ title: 'Bank Details' }} />


						{/** store */}
						<AppStack.Screen name="GameStore" component={GameStoreScreen} options={{ title: 'Store', headerShadowVisible: false }} />
						<AppStack.Screen name="GameBoostPurchaseSuccessful" component={GameBoostPurchaseSuccessfulScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="GamePlanPurchaseSuccessful" component={GamePlanPurchaseSuccessfulScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="GameStoreItemsPurchaseFailed" component={GameStoreItemsPurchaseFailed} options={{ headerShown: false }} />

						<AppStack.Screen name="Invite" component={InviteFriendsScreen} options={{ title: 'Invite Friends' }} />
					</>
				) :
				(

					<AppStack.Group screenOptions={{ title: "", headerShadowVisible: false }}>
						{/* unauthenticated */}
						<AppStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="Signup" component={SignupScreen} options={{ headerShown: false }} />
						<AppStack.Screen name="SignupProfile" component={SignupProfileScreen} />
						<AppStack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
						<AppStack.Screen name="VerifyEmail" component={VerifyEmailScreen} />
						<AppStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
						<AppStack.Screen name="ResetPasswordSuccess" component={ResetPasswordSuccessScreen} />
						<AppStack.Screen name="SignupVerifyEmail" component={SignupVerifyEmailScreen} options={{ headerShown: false }} />
					</AppStack.Group >
				)
			}

			{/** general */}
			<AppStack.Screen name="Terms" component={TermsAndConditionsScreen} options={{ title: 'Terms & Conditions' }} />
			<AppStack.Screen name="Privacy" component={PrivacyPolicyScreen} options={{ title: 'Privacy Policy' }} />
			<AppStack.Screen name="Support" component={SupportQuestionsScreen} options={{ title: 'Support' }} />
			<AppStack.Screen name="Answer" component={SupportAnswerScreen} options={{ title: 'Details' }} />
			<AppStack.Screen name="EmailVerified" component={EmailVerifiedScreen} options={{ headerShown: false }} />
			<AppStack.Screen name="ChallengeNotPending" component={ChallengeNotPendingScreen} options={{ headerShown: false }} />
			{/* <AppStack.Screen name="Tournament" component={TournamentScreen} options={{ title: 'Tournament' }} /> */}
		</AppStack.Navigator >
	)
}

export default AppRouter;

const booststrapAxios = async function (token) {
	axios.defaults.baseURL = Constants.manifest.extra.apiBaseUrl;
	console.log(axios.defaults.baseURL);
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
	if (Device.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
			const { status } = await Notifications.requestPermissionsAsync();
			finalStatus = status;
		}
		if (finalStatus !== 'granted') {
			alert('Failed to get push token for push notification!');
			return;
		}
		deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
		console.log('this is device token', deviceToken);
	} else {
		alert('Must use physical device for Push Notifications');
	}

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