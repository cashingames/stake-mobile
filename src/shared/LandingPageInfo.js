import { View, Text, Image, Pressable, ImageBackground, Platform } from 'react-native'
import { responsiveScreenWidth } from '../utils/normalize'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet'
import AppButton from './AppButton'



const LandingPageInfo = () => {

  const navigation = useNavigation()
  return (
    <View style={styles.container}>
      <View style={styles.landingImage}>
        <View style={[{ transform: [{ rotate: '180deg' }] }, styles.imgText]}>
          <Text style={[{ transform: [{ rotate: '90deg' }] }, styles.landingImageText]}> Daily Challenge</Text>
        </View>
        <ImageBackground source={require('../../assets/images/gameImage.png')}
          style={{ width: 220, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={styles.imgLink}>Daily Challenge</Text>
          <Text style={styles.imgLink2}>Daily Quest</Text>
        </ImageBackground>
      </View>


      <View style={styles.landingImage2}>
        <Image
          resizeMode='cover'
          source={require('../../assets/images/infoImage2.png')}
          style={styles.image2} />
        <View style={styles.extraInfo}>
          <Text style={styles.extraTitle}> Multiplayer Level Games</Text>
          <Text style={styles.extraText}>Compete with your friends, foes, family and other Cashingamers and show them who is Number 1!!</Text>
          <Pressable style={styles.extraBtn} onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.btnText}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.landingImage3}>
        <Image resizeMode='cover'
          source={require('../../assets/images/img3.png')}
          style={styles.image3} />
        <View style={[{ transform: [{ rotate: '180deg' }] }, styles.imgText2]}>
          <Text style={[{ transform: [{ rotate: '270deg' }] }, styles.landingImageText2]}>Category Leaderboard</Text>
        </View>
      </View>
    </View>
  )
}


const styles = EStyleSheet.create({
  container: {
    alignItems: 'center',
  },

  landingImage: {
    flex: 1,
    width: responsiveScreenWidth(100),
    padding: "3rem",
    paddingBottom: 0,
    marginHorizontal: '2rem',
    marginTop: '-4rem',
    flexDirection: 'row'

  },

  imgText: {
    height: responsiveScreenWidth(80),
    width: 80,
    // padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E05C28',
  },

  landingImageText: {
    color: '#fff',
    fontSize: '1.8rem',
    width: responsiveScreenWidth(100),
    fontFamily: 'gotham-medium',
    paddingLeft: Platform.OS === 'ios' ? '3rem' : '3.5rem',
    letterSpacing: 1
  },

  imgLink: {
    padding: '1rem',
    borderRadius: 30,
    color: '#fff',
    width: '90%',
    backgroundColor: '#E24066',
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'gotham-medium'
  },

  imgLink2: {
    padding: '1rem',
    borderRadius: 30,
    color: '#fff',
    width: '90%',
    marginTop: '2rem',
    backgroundColor: '#6C15C9',
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'gotham-medium'
  },

  landingImage2: {
    flex: 1,
    width: "70%",
    position: 'relative',
    marginTop: 40
  },

  image2: {
    // height:'100%',
    width: '100%',
    marginLeft: '-2rem'
  },

  extraInfo: {
    position: 'absolute',
    top: 0,
    width: responsiveScreenWidth(50),
    right: '-2rem',
    padding: '1rem',
    backgroundColor: '#E05C28',
    boxShadow: '0 5px 20px rgba(239, 82, 47, 0.4)',

  },

  extraTitle: {
    fontSize: '1.2rem',
    fontFamily: 'gotham-bold',
    lineHeight: '2rem',
    color: '#fff',
    alignItems: 'flex-start'
  },

  extraText: {
    fontSize: '.85rem',
    lineHeight: '1.5rem',
    paddingTop: '0.8rem',
    borderTopWidth: 1,
    color: '#fff',
    fontFamily: 'gotham-medium',
    borderColor: '#fff',
    marginVertical: responsiveScreenWidth(2)
  },

  extraBtn: {
    padding: '0.8rem',
    borderWidth: 1,
    borderColor: '#fff',
    marginTop: 30,
    alingSelf: 'flex-end',
    alignItems: 'center',
    borderRadius: 30,
    backgroundColor: '#E05C28'
  },

  btnText: {
    fontSize: '0.8rem',
    color: '#fff',
    fontFamily: 'gotham-medium'
  },

  landingImage3: {
    flex: 1,
    width: responsiveScreenWidth(100),
    padding: "3rem",
    paddingBottom: 0,
    flexDirection: 'row'
  },

  imgText2: {
    height: Platform.OS === 'ios' ? responsiveScreenWidth(73.2) : responsiveScreenWidth(73.55),
    width: 80,
    // padding: 10,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#E05C28'
  },
  image3: {
    marginTop: 0,
    marginBottom: 10
  },

  landingImageText2: {
    color: '#fff',
    fontSize: '1.2rem',
    width: responsiveScreenWidth(100),
    fontFamily: 'gotham-medium',
    paddingLeft: Platform.OS === 'ios' ? '3.8rem' : '4.3rem',
    letterSpacing: 1,
  },

})
export default LandingPageInfo