import React, { useEffect } from 'react';
import { View, Text, Image, Platform } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize';
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
					<ImageBackground style={styles.endImage} source={require('../../assets/images/no-game.png')}>
						<Text style={styles.titleText}>Out of lives</Text>
						<View style={styles.livesCase}>
							<Text style={styles.liveText}>Buy extra lives now or play again tomorrow!</Text>
						</View>
						<View style={styles.heartCase}>
							<ImageBackground style={styles.heart} source={require('../../assets/images/heart-icon.png')}>
								<Text style={styles.heartText}>+15</Text>
							</ImageBackground>
						</View>

						<View style={styles.livesPriceCase}>
							<Text style={styles.priceText}>N1000</Text>
						</View>
						<View style={styles.storeLink}>
						<ImageBackground  source={require('../../assets/images/button-case.png')} >
							<Pressable style={styles.btn}
								onPress={visitStore}
							>
								<Text style={styles.btnText}>Buy</Text>
							</Pressable>
						</ImageBackground>
						</View>
					</ImageBackground>	
				</View>
				<GameSettings onPress={() => navigation.goBack(null)} />
			</View>
		</MixedContainerBackground>
	)
}

export default NoGame;

const styles = EStyleSheet.create({
	noGames: {
		flex: 1,
		height: '100%',
		paddingVertical: responsiveScreenHeight(2)
	},
	endImageCase: {
		alignItems: 'center',
		paddingTop: responsiveScreenHeight(3.5),
		marginVertical: responsiveScreenHeight(8),
	},
	endImage: {
		height: 413,
		width: 300,
		alignItems: 'center',

	},
	titleText: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '1.5rem',
		marginVertical: '2.4rem'
	},
	heart: {
		width: 143,
		height: 109,
		marginTop: normalize(10),
		alignItems:'center',
		justifyContent:'center'
	},
	heartCase: {
		alignItems: 'center',
		width: 178
	},
	heartText:{
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '2rem',
		marginTop: normalize(20)
	},
	point: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '2rem',
		textAlign: 'center'
	},
	livesCase: {
		marginVertical: responsiveScreenHeight(.60),
		paddingHorizontal: responsiveScreenWidth(4),
		alignItems: 'center'
	},
	liveText: {
		color: '#fff',
		fontFamily: 'blues-smile',
		fontSize: '.8rem',
		textAlign: 'center'
	},
	livesPriceCase: {
		flexDirection: 'row',
		marginVertical: normalize(20)
	},
	priceText: {
		color: '#FFD839',
		fontFamily: 'blues-smile',
		fontSize: '1.8rem',
		textAlign: 'center'
	},
	storeLink:{
		alignItems:'center'
	},
	btn:{
		height:53,
		width:89,
		alignItems:'center',
		justifyContent:'center'
	},
	btnText: {
		color:'#A92101',
		fontFamily: 'blues-smile',
		fontSize:'1.4rem'
	}

})