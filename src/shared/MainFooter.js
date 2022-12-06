import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet'
import { responsiveScreenWidth } from '../utils/normalize';

const MainFooter = () => {
  const navigation = useNavigation()
  return (
    <View style={styles.mainFooter}>
      <Text style={styles.mainFooterHeader}>Welcome Bonus</Text>
      <Image source={require('../../assets/images/bonus.png')}/>
      <Text style={styles.mainFooterText}>Join our live trivia and</Text>
      <Text style={styles.mainFooterText}>win amazing prizes</Text>
      <Pressable style={styles.mainFooterBtn} onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.mainFooterBtnText}>Register Here</Text>
      </Pressable>      
    </View>
  )
}


const styles = EStyleSheet.create({
    mainFooter:{
        marginTop:'3rem',
        alignItems:'center',
        backgroundColor:'#EF2F55',
        padding:'.8rem'
    },
    mainFooterHeader:{
      fontSize:'1.2rem',
      fontFamily:'graphik-medium',
      color:'#fff',
      marginVertical:'1rem'
    },
    mainFooterText:{
      color:'#fff',
      marginVertical:'0.2rem',
      fontSize:'.8rem',
      fontFamily:'graphik-regular',
      lineSpacing:'2rem'
    },

    mainFooterBtn:{
      paddingVertical:'0.6rem',
      paddingHorizontal:'1rem',
      borderWidth:1,
      borderColor:'#fff',
      marginTop:responsiveScreenWidth(4),
      alingSelf:'flex-end',
      alignItems:'center',
      borderRadius:30,
      backgroundColor:'#ef2f55',
    },
    mainFooterBtnText:{
      fontSize:'0.7rem',
      color:'#fff',
      fontFamily:'graphik-medium'
    }
})

export default MainFooter