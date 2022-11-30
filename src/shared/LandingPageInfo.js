import { View, Text, Image, Pressable } from 'react-native'
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
     <Image
          resizeMode='cover'
            source={require('../../assets/images/infoImage1.png')}
       style={styles.image1} />
    </View>
    <View style={styles.landingImage2}>
      <Image 
        resizeMode='cover'
        source={require('../../assets/images/infoImage2.png')} 
        style={styles.image2}/>
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
        source={require('../../assets/images/infoImage3.png')} 
        style={styles.image3} />
    </View>
     </View>
  )
}


const styles = EStyleSheet.create({
    container:{
        alignItems:'center',
    },
    
    landingImage: {
        flex:1,
        width: responsiveScreenWidth(100),
        padding:"3rem",
        paddingBottom:0,
        marginHorizontal:'2rem'
    },

    image1:{
        // height:'100%',
        width:'100%',
        marginTop:'-5rem'
    },

    landingImage2: {
        flex:1,
        width: "70%",
        position:'relative',
        marginVertical: 20
    },

    image2:{
      // height:'100%',
      width:'100%',
      marginLeft:'-2rem'
    },

    extraInfo: {
      position:'absolute',
      top:0,
      height:400,
      width:210,
      right:'-2rem',
      padding:'1rem',
      backgroundColor:'#ef2f55',
      boxShadow:'0 5px 20px rgba(239, 82, 47, 0.4)',
    },

    extraTitle:{
      fontSize:'1.7rem',
      fontFamily:'graphik-bold',
      lineHeight:'2.3rem',
      color:'#fff',
      marginVertical:20,
      alignItems:'flex-start'   
    },

    extraText:{
      fontSize:'1rem',
      lineHeight:'2rem',
      paddingTop:'0.8rem',
      borderTopWidth:1,
      color:'#fff',
      fontFamily:'graphik-medium',
      borderColor:'#fff',
      marginVertical:10
    },

    extraBtn:{
      padding:'0.8rem',
      borderWidth:1,
      borderColor:'#fff',
      marginTop:30,
      alingSelf:'flex-end',
      alignItems:'center',
      borderRadius:30,
      backgroundColor:'#ef2f55'
    },

    btnText:{
      fontSize:'0.8rem',
      color:'#fff',
      fontFamily:'graphik-medium'
    },

    landingImage3:{
      flex:1,
        width: responsiveScreenWidth(100),
        // padding:"3rem",
        paddingLeft:'3rem',
        paddingRight:'3rem',
        marginHorizontal:'2rem',
    },

    image3:{
      width:'100%',
      marginTop:0,
      marginBottom:10
    }
})
export default LandingPageInfo