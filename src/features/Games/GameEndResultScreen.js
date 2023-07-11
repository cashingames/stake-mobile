import React, { useState } from 'react';
import { Text, View, Image, ScrollView, Pressable, BackHandler, Platform, ImageBackground } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import EStyleSheet from 'react-native-extended-stylesheet';
import UserName from '../../shared/UserName';
import { getUser } from '../Auth/AuthSlice';
import StakeWinnings from '../../shared/StakeWinnings';
import Constants from 'expo-constants';
import logToAnalytics from '../../utils/analytics';
import { isTrue } from '../../utils/stringUtl';
import { Ionicons } from '@expo/vector-icons';
import AppButton from '../../shared/AppButton';


export default function GameEndResultScreen({ navigation }) {
	const dispatch = useDispatch();
	const user = useSelector(state => state.auth.user);
	const pointsGained = useSelector(state => state.game.pointsGained);
	const amountWon = useSelector(state => state.game.amountWon);
	const withStaking = useSelector(state => state.game.withStaking);
	const correctCount = useSelector(state => state.game.correctCount);
	const totalCount = useSelector(state => state.game.totalCount);
	const wrongCount = useSelector(state => state.game.wrongCount);
	const practiceMode = useSelector(state => state.game.practiceMode);
	const cashMode = useSelector(state => state.game.cashMode);
	const walletSource = useSelector(state => state.game.walletSource);
    const username = user.firstName === '' ? user.username?.charAt(0) : (user.firstName?.charAt(0) + user.lastName?.charAt(0))
	const isGameEnded = useSelector(state => state.game.isEnded);
	const [loading, setLoading] = useState(false);


	const onPlayButtonClick = () => {
		setLoading(true);
		logToAnalytics('exhibition_play_again_clicked', {
			'id': user.username,
			'phone_number': user.phoneNumber,
			'email': user.email
		});
		navigation.navigate("Games")
		setLoading(false);

	}

	const onHomeButtonClick = async () => {
		navigation.navigate('Home')
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

	const reviewStaking = () => {
		logToAnalytics('review_staking', {
			'id': user.username,
			'phone_number': user.phoneNumber,
			'email': user.email
		})
		navigation.navigate("ReviewStake")
	}

	// useEffect(() => {
	// 	// update recent in background
	// 	dispatch(getAchievements());
	// }, [])

	return (
		<ImageBackground source={require('../../../assets/images/success-background.png')} style={{ flex: 1 }} resizeMethod="resize">
			<ScrollView style={styles.container}>
				<View style={styles.trophy}>
					{isTrue(user.avatar) ?
						<Image
							style={styles.emoji}
							source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${user.avatar}` }}

						/>
						:
						<View style={styles.avatar}>
							<Text style={styles.avatarText}>{username}</Text>
						</View>

					}
				</View>
				<UserName userName={user.firstName} />
				{withStaking && cashMode &&
					<Winnings amountWon={amountWon} onPress={reviewStaking} walletSource={walletSource} />
				}
				{practiceMode &&
					<DemoWinnings amountWon={amountWon} />
				}

				<FinalScore pointsGained={pointsGained} correctCount={correctCount} wrongCount={wrongCount} totalCount={totalCount} />
				<View style={styles.gameButtons}>
					<AppButton onPress={onPlayButtonClick} text='Stake again' disabled={loading} textStyle={styles.againText} style={styles.stakeButton} disabledStyle={styles.disabled} />
					<Pressable style={styles.homeButton} onPress={onHomeButtonClick}>
						<Text style={styles.buttonText}>Return to home</Text>
					</Pressable>
				</View>
			</ScrollView>
		</ImageBackground>

	);
}

const Winnings = ({ amountWon, onPress, walletSource }) => {
	return (
		<View style={styles.winningsContainer}>
			<StakeWinnings amountWon={amountWon} />
			{walletSource === 'deposit_balance' &&
				<Pressable onPress={onPress} style={styles.reviewButton}>
					<Text style={styles.reviewStake}>Review Stake</Text>
					<Ionicons name="chevron-forward" size={22} color='#E05C28' />
				</Pressable>
			}
		</View>
	)
}

const DemoWinnings = ({ amountWon }) => {
	return (
		<View style={styles.winningsContainer}>
			<StakeWinnings amountWon={amountWon} />
		</View>
	)
}


const FinalScore = ({ pointsGained, correctCount, totalCount, wrongCount }) => {
	return (
		<View style={styles.finalScore}>
			<Text style={styles.finalScoreText}>Game play statistics</Text>
			<View style={styles.scoreContainer}>
				<Text style={styles.pointTitle}>Questions answered</Text>
				<Text style={styles.point}>{totalCount}</Text>
			</View>
			<View style={styles.scoreContainer}>
				<Text style={styles.pointTitle}>Answered correctly</Text>
				<Text style={styles.point}>{correctCount}</Text>
			</View>
			<View style={styles.scoreContainer}>
				<Text style={styles.pointTitle}>Answered wrongly</Text>
				<Text style={styles.point}>{wrongCount}</Text>
			</View>
			<View style={styles.scoreContainer}>
				<Text style={styles.pointTitle}>Points earned</Text>
				<Text style={styles.point}>{pointsGained} pts</Text>
			</View>
		</View>
	)
}



const styles = EStyleSheet.create({
	container: {
		flex: 1,
		paddingTop: responsiveScreenWidth(25),
		paddingHorizontal: normalize(18),
		paddingBottom: normalize(20),
	},
	trophy: {
		alignItems: 'center',
		justifyContent: 'center'
	},
	emoji: {
		width: normalize(80),
		height: normalize(80),
		borderRadius: 50,
		borderWidth: 1,
		borderColor: '#072169',
		backgroundColor: '#fff'
	},
	avatar: {
        width: normalize(80),
        height: normalize(80),
        backgroundColor: '#FDCCD4',
        borderRadius: 100,
        borderColor: ' rgba(0, 0, 0, 0.1)',
        borderWidth: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        fontSize: '1.7rem',
        color: '#072169',
        fontFamily: 'gotham-bold',
        textTransform: 'uppercase'
    },
	finalScore: {
		display: 'flex',
		flexDirection: 'column',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: '#fff',
		borderRadius: 16,
		marginBottom: responsiveScreenWidth(12),
		padding: Platform.OS === 'ios' ? normalize(25) : normalize(20),
		borderWidth: 1,
		borderColor: '#E5E5E5',
		elevation: 2,
		shadowColor: 'rgba(0, 0, 0, 0.25)',
		shadowOffset: { width: 0.5, height: 1 },
		shadowOpacity: 0.1,
	},
	finalScoreText: {
		color: '#072169',
		fontFamily: 'gotham-bold',
		fontSize: '1.3rem',
		marginBottom: '.7rem'
	},
	scoreContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		marginVertical: '1rem'
	},
	pointTitle: {
		color: '#072169',
		fontSize: '1.1rem',
		fontFamily: 'gotham-medium',
	},
	point: {
		color: '#072169',
		fontFamily: 'sansation-regular',
		fontSize: '1.1rem',
		marginLeft: '.7rem'
	},
	homeButton: {
		marginVertical: 5,
		backgroundColor: 'none',
		borderWidth: 2,
		borderColor: '#072169',
		paddingVertical: normalize(19),
		borderRadius: 13,
		alignItems: 'center'
	},
	stakeButton: {
		marginBottom: 20,
		marginTop: 0,
		paddingVertical: normalize(19),
	},
	buttonText: {
		fontFamily: 'gotham-medium',
		fontSize: '1.1rem',
		color: '#072169'
	},
	againText: {
		fontFamily: 'gotham-medium',
		fontSize: '1.1rem',
	},
	disabled: {
		backgroundColor: '#EA8663'
	},
	gameButtons: {
		display: 'flex',
		flexDirection: 'column',
		marginBottom: responsiveScreenHeight(18),
		paddingHorizontal: '2rem'
	},
	winningsContainer: {
		alignItems: 'center',
		backgroundColor: '#FFFF',
		paddingVertical: Platform.OS === 'ios' ? normalize(24) : normalize(20),
		marginBottom: normalize(20),
		borderRadius: 13,
		borderWidth: 1,
		borderColor: '#E5E5E5',
		elevation: 2,
		shadowColor: 'rgba(0, 0, 0, 0.25)',
		shadowOffset: { width: 0.5, height: 1 },
		shadowOpacity: 0.1,
	},
	reviewButton: {
		flexDirection: 'row',
		alignItems: 'center'
	},
	reviewStake: {
		color: '#E05C28',
		fontFamily: 'gotham-bold',
		fontSize: '1.1rem',
	},

});
