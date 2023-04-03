import React, { useRef } from "react";
import { Text, View, ScrollView, Pressable, Image } from 'react-native';
import { useSelector } from 'react-redux';
import EStyleSheet from "react-native-extended-stylesheet";
import useApplyHeaderWorkaround from "../../utils/useApplyHeaderWorkaround";
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from "../../utils/normalize";
import AppButton from './../../shared/AppButton';
import useSound from "../../utils/useSound";
import QuizContainerBackground from "../../shared/ContainerBackground/QuizContainerBackground";

export default function GameInstructionsScreen({ navigation }) {
  useApplyHeaderWorkaround(navigation.setOptions);
  const { playSound } = useSound(require('../../../assets/sounds/open.wav'))
  const goToGame = () => {
    navigation.navigate('SelectGameCategory')
  }

  return (
    <>
      <View style={styles.logo}>
        <View style={styles.imageContainer}>
        <Image style={styles.smallLogo} source={require('../../../assets/images/ga-logo-small.png')} />
        </View>
        <Pressable style={styles.icons} onPress={() => navigation.goBack(null)}>
          <Image style={styles.imageIcons} source={require('../../../assets/images/close-icon.png')} />
        </Pressable>
      </View>
      <QuizContainerBackground>

      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.title}>Game Instructions</Text>
          <ExhibitionInstructions />
          <View style={styles.btnContainer}>
          <AppButton
            text='Proceed to play'
            onPress={goToGame}
            style={styles.proceedBtn}
            textStyle={styles.btnText}
          />
          </View>
        </ScrollView>
      </View>
      </QuizContainerBackground>
    </>
  );
};



const ExhibitionInstructions = () => {
  return (
    <>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0031'}.</Text>
        <Text style={styles.instructionText}>There are 10 questions per session.
          You are required to answer these 10 questions in 60 seconds</Text>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0032'}.</Text>
        <Text style={styles.instructionText}>Click on the “Next” button after answering each question to
          progress to the next question.</Text>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0033'}.</Text>
        <Text style={styles.instructionText}>At the end of the session, you will see your total score</Text>
      </View>
      <View style={styles.instruction}>
        <Text style={styles.unicode}>{'\u0034'}.</Text>
        <Text style={styles.instructionText}>Click “Play again” to start another session in winning
          more points to climb the leader board.</Text>
      </View>
    </>
  )
};

const styles = EStyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F5FF',
    opacity:0.8,
    paddingHorizontal: normalize(18),
    paddingTop: normalize(20),
    paddingBottom: normalize(5)
  },
  logo: {
    alignItems: 'flex-end',
    flexDirection: 'row',
    paddingRight: responsiveScreenWidth(4),
    paddingVertical: responsiveScreenHeight(3),
    backgroundColor: '#15397D',
    justifyContent:'space-between'
  },
  imageContainer:{
    // backgroundColor:'white',
    flex:1,
    alignItems:'flex-end'
  },
  imageIcons: {
    width: 50,
    height: 50,
    marginLeft: normalize(60)

  },
  smallLogo: {
    width: 150,
    height: 95,
    // marginRight: normalize(60)
  },
  instruction: {
    flexDirection: 'row',
    marginBottom: normalize(15)
  },
  title:{
    textAlign:'center',
    fontSize:'1rem',
    fontFamily: 'blues-smile',
    color:'#15397D'
  },
  instructionHeader: {
    fontSize: '0.9rem',
    fontFamily: 'graphik-medium',
    color: '#15397D',
    lineHeight: '1.4rem',
    textAlign: 'justify',
    width: responsiveScreenWidth(80),
    marginBottom: normalize(35)
  },
  unicode: {
    fontSize: '1.5rem',
    fontFamily: 'graphik-bold',
    color: '#15397D',
    marginRight: normalize(10)
  },
  instructionText: {
    fontSize: '0.9rem',
    fontFamily: 'graphik-medium',
    color: '#15397D',
    lineHeight: '1.3rem',
    textAlign: 'justify',
    width: responsiveScreenWidth(80)
  },
  btnContainer:{
    alignItems:'center'
  },
  proceedBtn:{
    backgroundColor:'#15397D',
    // paddingVertical:'1rem',
    paddingHorizontal:'4rem',
    justifyContent:'center',
    borderRadius:20,
    // height:normalize(54)
  },
  btnText:{
    fontFamily:'blues-smile',
    fontSize:'.7rem',
  }

});