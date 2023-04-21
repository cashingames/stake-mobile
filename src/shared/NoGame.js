import React, { useEffect } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from '../utils/normalize';
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import GoToStore from './GoToStore';
import AppButton from './AppButton';
import MixedContainerBackground from './ContainerBackground/MixedContainerBackground';
import TopIcons from './TopIcons';
import { ImageBackground } from 'react-native';
import { Pressable } from 'react-native';
import GameSettings from './GameSettings';
import useSound from '../utils/useSound';

const NoGame = () => {
	const navigation = useNavigation();
	const visitStore = () => {
		navigation.navigate('GameStore')
	}

	const { playSound } = useSound(require('../../assets/sounds/loss.wav'))

	useEffect(() => {
		playSound()
	}, [])

	return (
		<MixedContainerBackground>
			<View style={styles.noGames}>
				<TopIcons />
				<View style={styles.endImageCase}>
					<ImageBackground style={styles.endImage} resizeMode='contain' source={require('../../assets/images/no-game.png')}>
						<Text style={styles.titleText}>Out of lives</Text>
						<View style={styles.livesCase}>
							<Text style={styles.liveText}>Get lives or come back in the next 3 hrs</Text>
						</View>
						<View style={styles.heartCase}>
							<ImageBackground resizeMode='contain' style={styles.heart} source={require('../../assets/images/heart-icon.png')}>
								<Text style={styles.heartText}>+15</Text>
							</ImageBackground>
						</View>
						<View style={styles.livesPriceCase}>
							<Text style={styles.priceText}>N1000</Text>
						</View>
						<View style={styles.storeLink}>
							<ImageBackground source={require('../../assets/images/button-case.png')} >
								<Pressable style={styles.btn}
									onPress={visitStore}
								>
									<Text style={styles.btnText}>Buy</Text>
								</Pressable>
							</ImageBackground>
						</View>
					</ImageBackground>
				</View>
				<View style={styles.setting}>
					<GameSettings onPress={() => navigation.goBack(null)} />
				</View>
			</View>
		</MixedContainerBackground>
	)
}

export default NoGame;

const styles = EStyleSheet.create({
	noGames: {
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
	titleText: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize:'1.5rem',
		marginVertical: Platform.OS === 'ios' ? '1.6rem' : '2rem'
	},
	heart: {
		height: responsiveHeight(12),
		width: responsiveWidth(30),
		alignItems: 'center',
		justifyContent: 'center'
	},
	heartCase: {
		alignItems: 'center',
		marginTop: responsiveHeight(100) * 0.02,
	},
	heartText: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '1.7rem',
		marginTop:  responsiveHeight(100) * 0.02,
	},
	point: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '2rem',
		textAlign: 'center'
	},
	livesCase: {
		marginTop: responsiveHeight(100) * 0.02,
		paddingHorizontal: responsiveScreenWidth(4),
		alignItems: 'center',
	},
	liveText: {
		color: '#575EE8',
		fontFamily: 'blues-smile',
		fontSize: '.8rem',
		textAlign: 'center',
		width:Platform.OS === "ios" ? normalize(200) : normalize(150)

	},
	livesPriceCase: {
		flexDirection: 'row',
		marginVertical: responsiveHeight(100) * 0.01
	},
	priceText: {
		color: '#FFD839',
		fontFamily: 'blues-smile',
		fontSize: '1.8rem',
		textAlign: 'center'
	},
	storeLink: {
		alignItems: 'center',
		marginTop:5
	},
	btn: {
		height: 53,
		width: 89,
		alignItems: 'center',
		justifyContent: 'center',
	},
	btnText: {
		color: '#A92101',
		fontFamily: 'blues-smile',
		fontSize: '1.4rem'
	},
	setting: {
		position: 'absolute',
		left: 0,
		right: 0,
		top: responsiveHeight(88),
	}


})