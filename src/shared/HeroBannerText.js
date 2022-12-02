import { View, Text, Image } from 'react-native'
import React from 'react'
import EStyleSheet from 'react-native-extended-stylesheet';


const HeroBannerText = () => {
  return (
    <View>
      <View style={styles.bannerText}>
      <Text style={styles.red}>
        Play and <Text style={styles.bText}>compete </Text></Text>      
        <Text style={styles.bText}>with family and</Text> 
        <Text style={styles.bText}>friends</Text>
        </View>
        <View style={styles.bannerText2}>
          <Text style={styles.bText2}>Show You are the true</Text>
          <Text style={styles.bText2}>Champion Today!</Text>
        </View>
        </View>
  )
}

const styles = EStyleSheet.create({
    bannerText:{
      alignItems:'center',
      backgroundColor:'#fff'
    },
    
    red:{
      color:'#EF2F55',
      fontSize:'2.3rem',
      fontFamily:'graphik-bold'
    },

   bText:{
      textAlign:'center',
      color:'#000',
      fontSize:'2.3rem',
      fontFamily:'graphik-bold',
      lineHeight:'3.5rem'
   },

   bannerText2:{
    alignItems:'center',
    marginTop:'3rem'
   },

   bText2:{
    color: 'rgba(0, 0, 0, 0.6)',
    fontSize: '1rem',
    fontFamily:'graphik-medium',
    lineHeight:'1.6rem'
   }
})

export default HeroBannerText






