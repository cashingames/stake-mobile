
import { View, Text, Image } from 'react-native'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet';
import HeroBannerText from './HeroBannerText';


const LandingBanner = () => {
  return (
    <View style={styles.banner}>
      <HeroBannerText />
        <View style={styles.clipContainer}>
          <View style={styles.bubble}></View>
          <View style={styles.clickMe}>
            <View style={styles.play}>
              <Image source={require('../../assets/images/play.png')} />
            </View>
           <Text style={styles.clickMeText}>Click Me</Text>
           <View style={styles.bubble2}></View>
          </View>
        </View>
        <View>
       <Image
          resizeMode='cover'
            source={require('../../assets/images/landingImg.png')}
        style={styles.img}/>
         <View style={styles.bubble3}></View>
           <View style={styles.bubble4}></View>
           </View>
    </View>
  )
}

export default LandingBanner

const styles = EStyleSheet.create({
    banner:{
        width:'100%',
        paddingTop:'3rem'
    },

   clipContainer:{
      flexDirection:'row',
      justifyContent:'space-between',
      alignItems:'center',
      gap:22
   },

   bubble:{
      height:108,
      width:108,
      borderRadius:100,
      marginLeft:-35,
      backgroundColor:'#6C15C9'
   },

   clickMe:{
      flex:1,
      height:56,
      backgroundColor:"#151C2F",
      marginLeft:15,
      borderRadius:30,
      marginRight:"-2rem",
      marginTop:'2rem',
      flexDirection:'row',
      alignItems:"center",
   }, 

   play:{
    alignItems:'center',
    height:40,
    width:40,
    backgroundColor:'#EF2F55',
    marginLeft:'0.5rem',
    justifyContent:'center',
    borderRadius:100
   },

   clickMeText:{
    flex:1,
    color:'#fff',
    fontFamily:'graphik-medium',
    fontSize:'1rem',
    paddingRight:'4rem',
    alignItems:'center',
    textAlign:'center'
   },

   bubble2:{
      position:'absolute',
      height:90,
      width:90,
      borderRadius:100,
      backgroundColor:'#E24066',
      top:'-255%',
      right:0,
   },

   bubble3:{
    position:'absolute',
    height:60,
    width:60,
    borderRadius:100,
    backgroundColor:'#6C15C9',
    top:'5%',
    right:-5,
 },

 bubble4:{
  position:'absolute',
  height:30,
  width:30,
  borderRadius:100,
  backgroundColor:'#E24066',
  bottom:'50%',
  right:3,
},

    img:{
        width:'100%',
        height:240,
        marginTop:'2rem'
    }
})