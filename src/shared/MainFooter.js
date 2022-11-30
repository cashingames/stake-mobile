import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet'

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
        padding:'2.5rem'
    },
    mainFooterHeader:{
      fontSize:'1.5rem',
      fontFamily:'graphik-medium',
      color:'#fff',
      marginVertical:'2rem'
    },
    mainFooterText:{
      color:'#fff',
      marginVertical:'0.2rem',
      fontSize:'1rem',
      fontFamily:'graphik-regular',
      lineSpacing:'2rem'
    },

    mainFooterBtn:{
      padding:'0.8rem',
      borderWidth:1,
      borderColor:'#fff',
      marginTop:30,
      alingSelf:'flex-end',
      alignItems:'center',
      borderRadius:30,
      backgroundColor:'#ef2f55',
      width:158
    },
    mainFooterBtnText:{
      fontSize:'0.8rem',
      color:'#fff',
      fontFamily:'graphik-medium'
    }
})

export default MainFooter