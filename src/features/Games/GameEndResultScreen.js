import React, { useRef, useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, Pressable, BackHandler, StatusBar, Platform } from 'react-native';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from '../../utils/normalize';
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
import AchievementPopup from '../../shared/AchievementPopup';


export default function GameEndResultScreen({ navigation }) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.user);
	const pointsGained = useSelector(state => state.game.correctCount);
	const minimumBoostScore = useSelector(state => state.common.minimumBoostScore)
	const isGameEnded = useSelector(state => state.game.isEnded);
	const [loading, setLoading] = useState(false);
	const [showText, setShowText] = useState(true);
	const [lastRunDate, setLastRunDate] = useState();
	const [modalVisible, setModalVisible] = useState(false);
	const [sumOfPlans, setSumOfPlans] = useState(0);
	const [achievementPopup, setAchievementPopup] = useState(false)

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
					<GameSettings navigationHandler={() => navigation.navigate('Games')} />
				</View>
			</View>

			<AchievementPopup setAchievementPopup={setAchievementPopup} achievementPopup={achievementPopup} />
		</QuizContainerBackground>
	);
}

const EndGameData = ({ homeNavigation, playAgain, pointsGained, minimumBoostScore }) => {
	const coinsEarned = useSelector(state => state.game.coinsEarned);
	return (
		<View style={styles.endImageCase}>
			{pointsGained > 2 ?
				<ImageBackground style={styles.endImage} resizeMode="contain" source={require('../../../assets/images/endgame-image.png')}>
					<Text style={styles.winText}>You win</Text>
					<View style={styles.starIcons}>
						{pointsGained >= 8 &&
							<>
								<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/win-star.png')} />
								<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/win-star.png')} />
								<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/win-star.png')} />
							</>
						}
						{pointsGained >= 5 && pointsGained < 8 &&
							<>
								<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/win-star.png')} />
								<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/win-star.png')} />
								<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/loss-star.png')} />
							</>
						}
						{pointsGained >= 3 && pointsGained < 5 &&
							<>
								<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/win-star.png')} />
								<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/loss-star.png')} />
								<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/loss-star.png')} />
							</>
						}
					</View>
					<View style={styles.pointsCase}>
						<Text style={styles.point}>You Scored {pointsGained} Points</Text>
					</View>
					<View style={styles.winPoints}>
						<Text style={styles.pointEarned}>+{coinsEarned}</Text>
						<View style={styles.btnContainer}>
							<Pressable onPress={homeNavigation}>
								<Image style={styles.btn} source={require('../../../assets/images/okay.png')} />
							</Pressable>
							<Pressable onPress={playAgain}>
								<Image style={styles.btn} source={require('../../../assets/images/replay.png')} />
							</Pressable>
						</View>
					</View>
					<View style={styles.winnerProfile}>
						<Image style={styles.winnerImage} resizeMode="contain" source={require('../../../assets/images/winner-picture.png')} />
					</View>
				</ImageBackground>
				:
				<ImageBackground style={styles.endImage} resizeMode="contain" source={require('../../../assets/images/lose-endgame.png')}>
					<Text style={styles.winText}>You Lose!</Text>
					<View style={styles.starIcons}>
						<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/loss-star.png')} />
						<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/loss-star.png')} />
						<Image style={styles.star} resizeMode="contain" source={require('../../../assets/images/loss-star.png')} />
					</View>
					<View style={styles.pointsCase}>
						<Text style={styles.point}>You Scored {pointsGained} Points</Text>
					</View>
					<View style={styles.winPoints}>
						<Text style={styles.zeroPoint}>{coinsEarned}</Text>
						<View style={styles.btnContainer}>
							<Pressable onPress={homeNavigation}>
								<Image style={styles.btn} source={require('../../../assets/images/okay.png')} />
							</Pressable>
							<Pressable onPress={playAgain}>
								<Image style={styles.btn} source={require('../../../assets/images/replay.png')} />
							</Pressable>
						</View>
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
		height: responsiveHeight(100),
		paddingVertical: responsiveHeight(2),
	},
	endImageCase: {
		alignItems: 'center',
		height: responsiveHeight(80),
		justifyContent: 'center',
	},
	endImage: {
		height: responsiveHeight(50),
		width: responsiveWidth(80),
		alignItems: 'center'
	},
	winText: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '1.5rem',
		marginVertical: responsiveHeight(100) * 0.038
	},
	starIcons: {
		flexDirection: 'row',
		justifyContent: 'center',
		width: '100%',
		marginTop: responsiveHeight(1.3)
	},
	star: {
		height: 60,
		width: 60,
		marginHorizontal: responsiveWidth(2)
	},
	pointsCase: {
		alignItems: 'center',
		width: responsiveWidth(46),
		marginVertical: responsiveHeight(100) * 0.003,
		zIndex: 10
	},
	point: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '1.5rem',
		textAlign: 'center'
	},
	winPoints: {
		position: 'absolute',
		top: responsiveHeight(29),
		marginVertical: responsiveHeight(.60),
	},
	pointEarned: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '2.2rem',
		paddingLeft: Platform.OS === "android" && responsiveHeight(100) > 850 ? responsiveWidth(100) * 0.02 : responsiveWidth(100) * 0.03,
		paddingTop: responsiveHeight(100) * 0.01,
	},
	zeroPoint: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '2.2rem',
		paddingLeft: Platform.OS === "android" && responsiveHeight(100) > 850 ? responsiveWidth(100) * 0.02 : responsiveWidth(100) * 0.09,
		paddingTop: responsiveHeight(100) * 0.01
	},
	btnContainer: {
		flexDirection: 'row',
		marginTop: responsiveHeight(100) * 0.018
	},
	btn: {
		height: 50,
		width: 50,
		marginHorizontal: responsiveWidth(2)
	},
	loserProfile: {
		position: 'absolute',
		right: Platform.OS === 'ios' ? responsiveWidth(-17) : responsiveWidth(-13),
		bottom: responsiveHeight(8)
	},
	loserImage: {
		width: normalize(139),
		height: normalize(135)
	},
	winnerImage: {
		height: responsiveHeight(50),
		width: responsiveWidth(35),
	},
	winnerProfile: {
		position: 'absolute',
		left: responsiveWidth(55),
		top: responsiveHeight(20),
	},
	setting: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: responsiveHeight(88),
	}

});
