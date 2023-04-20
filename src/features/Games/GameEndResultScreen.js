import React, { useRef, useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, Pressable, BackHandler, StatusBar, Platform } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import GameEndClockAnimation from '../../shared/GameEndClockAnimation';
import UserName from '../../shared/UserName';
import NoGame from '../../shared/NoGame';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import { getUser } from '../Auth/AuthSlice';
import analytics from '@react-native-firebase/analytics';
import StakeWinnings from '../../shared/StakeWinnings';
import Boostspopup from '../../shared/BoostPopUp';
import { PopGoogleReviewLogic } from '../../shared/GoogleReview';
import { getAchievements } from '../Profile/AchievementSlice';
import useSound from '../../utils/useSound';
import QuizContainerBackground from '../../shared/ContainerBackground/QuizContainerBackground';
import TopIcons from '../../shared/TopIcons';
import { ImageBackground } from 'react-native';
import GameSettings from '../../shared/GameSettings';


export default function GameEndResultScreen({ navigation }) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.user);
	const pointsGained = useSelector(state => state.game.pointsGained);
	const amountWon = useSelector(state => state.game.amountWon);
	const withStaking = useSelector(state => state.game.withStaking);
	const minimumBoostScore = useSelector(state => state.common.minimumBoostScore)
	const isGameEnded = useSelector(state => state.game.isEnded);
	const [loading, setLoading] = useState(false);
	const [showText, setShowText] = useState(true);
	const [lastRunDate, setLastRunDate] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const [sumOfPlans, setSumOfPlans] = useState(0);
	const activePlan = useSelector(state => state.auth.user.activePlans ?? []);
	const bonusGame = activePlan?.find((item) => item.name === 'Bonus Games')
	const newUser = useSelector(state => state.auth.user.joinedOn);
	const newUserDate = newUser.slice(0, 10);
	let formattedDate = new Date().toISOString().split('T')[0];
	const { playSound } = useSound(require('../../../assets/sounds/game-completed2.wav'))
	const buttonSound = useSound(require('../../../assets/sounds/open.wav'))

	const logFreeGamesExhausted = () => {
		const currentDate = new Date().toLocaleDateString();
		if (lastRunDate !== currentDate) {
			if (formattedDate === newUserDate && bonusGame && bonusGame.game_count === 0) {
				analytics().logEvent('new_user_FG_exhausted', {
					'id': user.username,
					'phone_number': user.phoneNumber,
					'email': user.email
				});
			}
			if (formattedDate !== newUserDate && bonusGame && bonusGame.game_count === 0) {
				analytics().logEvent('free_game_exhausted', {
					'id': user.username,
					'phone_number': user.phoneNumber,
					'email': user.email
				});
			}
			setLastRunDate(currentDate);
		}
	};

	const refRBSheet = useRef();

	const openBottomSheet = () => {
		refRBSheet.current.open()
	}

	const closeBottomSheet = () => {
		refRBSheet.current.close()
	}

	const onPlayButtonClick = async () => {
		setLoading(true);
		analytics().logEvent('exhibition_play_again_clicked', {
			'id': user.username,
			'phone_number': user.phoneNumber,
			'email': user.email
		});
		if (bonusGame && bonusGame.game_count === 2) {
			analytics().logEvent('two_free_games_left', {
				'id': user.username,
				'phone_number': user.phoneNumber,
				'email': user.email
			});
		};
		logFreeGamesExhausted()
		buttonSound.playSound()
		navigation.navigate("SelectSubCategory")
		setLoading(false);

	}

	const onHomeButtonClick = async () => {
		if (bonusGame && bonusGame.game_count === 2) {
			analytics().logEvent('two_free_games_left', {
				'id': user.username,
				'phone_number': user.phoneNumber,
				'email': user.email
			});
		};
		buttonSound.playSound()
		logFreeGamesExhausted()
		navigation.navigate('Dashboard')
	}

	useFocusEffect(
		React.useCallback(() => {
			dispatch(getUser())
		}, [])
	)

	useFocusEffect(
		React.useCallback(() => {
			const onBackPress = () => isGameEnded
			BackHandler.addEventListener('hardwareBackPress', onBackPress);

			return () =>
				BackHandler.removeEventListener('hardwareBackPress', onBackPress);
		}, [isGameEnded])
	);

	useFocusEffect(
		React.useCallback(() => {
			StatusBar.setTranslucent(true)
			StatusBar.setBackgroundColor("transparent")
			StatusBar.setBarStyle('light-content');
			return () => {
				StatusBar.setTranslucent(true)
				StatusBar.setBarStyle('dark-content');
			}
		}, [])
	);

	useEffect(() => {
		// Change the state every second or the time given by User.
		const interval = setInterval(() => {
			setShowText((showText) => !showText);
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	useEffect(() => {
		if ((pointsGained <= minimumBoostScore) && (Platform.OS === "android")) {
			setModalVisible(true)
		} else {
			setModalVisible(false)
		}
	}, [pointsGained])

	useEffect(() => {
		const reducer = (accumulator, curr) => accumulator + curr;
		var x = activePlan && activePlan.filter(a => a.name === "Bonus Games")
		var y = x.map(b => b.game_count).reduce(reducer, 0)
		setSumOfPlans(y ?? 0);
	}, [activePlan]);

	useEffect(() => {
		(async () => {
			// this is the trigger
			const isReviewed = await PopGoogleReviewLogic(sumOfPlans, user.email)
		})()
	}, [sumOfPlans])

	// update achievement after game session
	useEffect(() => {
		// update recent in background
		dispatch(getAchievements());
	}, [])

	useEffect(() => {
		playSound()
	}, [])

	return (
		<QuizContainerBackground>
			<View style={styles.container}>
				<TopIcons />
				<EndGameData homeNavigation={onHomeButtonClick} playAgain={onPlayButtonClick} pointsGained={pointsGained} minimumBoostScore={minimumBoostScore} />
				<View style={styles.setting}>
					<GameSettings onPress={() => navigation.navigate('Games')}/>
				</View>
			</View>
		</QuizContainerBackground>
	);
}

const EndGameData = ({ homeNavigation, playAgain, pointsGained, minimumBoostScore }) => {
	return (
		<View style={styles.endImageCase}>
			{pointsGained > Number(minimumBoostScore)?
				<ImageBackground style={styles.endImage} source={require('../../../assets/images/no-game.png')}>
					<Text style={styles.winText}>You win</Text>
					<View style={styles.starIcons}>
						<Image style={styles.star} source={require('../../../assets/images/win-star.png')} />
						<Image style={styles.star} source={require('../../../assets/images/win-star.png')} />
						<Image style={styles.star} source={require('../../../assets/images/win-star.png')} />
					</View>
					<View style={styles.pointsCase}>
						<Text style={styles.point}>You Scored {pointsGained} Points</Text>
					</View>
					{/* <View style={styles.winPoints}>
						<Text style={styles.pointEarned}>+10</Text>
					</View> */}
					<View style={styles.btnContainer}>
						<Pressable onPress={homeNavigation}>
							<Image style={styles.btn} source={require('../../../assets/images/okay.png')} />
						</Pressable>
						<Pressable onPress={playAgain}>
							<Image style={styles.btn} source={require('../../../assets/images/replay.png')} />
						</Pressable>
					</View>
					<View style={styles.winnerProfile}>
						<Image style={styles.winnerImage} source={require('../../../assets/images/winner-picture.png')} />
					</View> 
				</ImageBackground>
				:
				<ImageBackground style={styles.endImage} source={require('../../../assets/images/no-game.png')}>
					<Text style={styles.winText}>You Lose!</Text>
					<View style={styles.starIcons}>
						<Image style={styles.star} source={require('../../../assets/images/loss-star.png')} />
						<Image style={styles.star} source={require('../../../assets/images/loss-star.png')} />
						<Image style={styles.star} source={require('../../../assets/images/loss-star.png')} />
					</View>
					<View style={styles.pointsCase}>
						<Text style={styles.point}>You Scored {pointsGained} Points</Text>
					</View>
					{/* <View style={styles.winPoints}>
					<Text style={styles.pointEarned}>-10</Text>
				</View> */}
					<View style={styles.btnContainer}>
						<Pressable onPress={homeNavigation}>
							<Image style={styles.btn} source={require('../../../assets/images/okay.png')} />
						</Pressable>
						<Pressable onPress={playAgain}>
							<Image style={styles.btn} source={require('../../../assets/images/replay.png')} />
						</Pressable>
					</View>
					<View style={styles.loserProfile}>
						<Image style={styles.loserImage} source={require('../../../assets/images/loser-profile.png')} />
					</View>
				</ImageBackground>

			}
		</View>
	)
}
const styles = EStyleSheet.create({
	container: {
		flex: 1,
		paddingVertical: responsiveScreenHeight(2),
	},
	endImageCase: {
		alignItems: 'center',
		// paddingTop: responsiveScreenHeight(3.5),
		marginVertical: Platform.OS === 'ios' ? responsiveScreenHeight(15) : responsiveScreenHeight(6),
	},
	endImage: {
		height: 413,
		width: 300,
		alignItems: 'center'
	},
	winText: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: Platform.OS === 'ios' ? '1.6rem' :'2rem',
		marginVertical: Platform.OS === 'ios' ? '1.6rem' : '2rem'
	},
	starIcons: {
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
		marginTop: responsiveScreenHeight(1.5)
	},
	star: {
		height: 66,
		width: 64,
		marginHorizontal: responsiveScreenWidth(2)
	},
	pointsCase: {
		alignItems: 'center',
		width: 198,
		marginVertical: normalize(20),
		zIndex:10
	},
	point: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: Platform.OS === 'ios' ? '1.7rem'  : '2rem',
		textAlign: 'center'
	},
	winPoints: {
		marginVertical: responsiveScreenHeight(.60),
		marginRight: normalize(60)
		// width:'100%'
	},
	pointEarned: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '2.5rem'
	},
	btnContainer: {
		flexDirection: 'row',
		marginTop: normalize(10)
	},
	btn: {
		height: 50,
		width: 50,
		marginHorizontal: responsiveScreenWidth(2)
	},
	loserProfile: {
		position: 'absolute',
		right: Platform.OS === 'ios' ? responsiveScreenWidth(-17) : responsiveScreenWidth(-13),
		bottom: responsiveScreenHeight(8)
	},
	loserImage: {
		width: normalize(139),
		height: normalize(135)
	},
	winnerImage:{
		width:normalize(145),
		height:normalize(254)
	},
	winnerProfile:{
		position: 'absolute',
		left: responsiveScreenWidth(50),
		top: Platform.OS === 'ios' ? responsiveScreenHeight(27) : responsiveScreenHeight(25)
	}

});
