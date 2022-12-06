import { View, Text, Image, Pressable } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import { isLoggedIn } from '../features/Auth/AuthSlice'
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from '../utils/normalize';


const LandingPageHeader = ({onPress, goToDashboard}) => {

  const userToken = useSelector(state => state.auth.token)

  return (
    <View style={styles.landingHeader}>
       <Image
            source={require('../../assets/images/logo-small.png')}
        />
        { userToken ?
        <Pressable style={styles.link}
        onPress={goToDashboard}>
          <Text style={styles.linkText}>Dashboard</Text>
        </Pressable>
        :
        <Pressable style={styles.link} 
        onPress={onPress}>
          <Text style={styles.linkText}>Sign in</Text>
        </Pressable>
}
    </View>
  )
}


export default LandingPageHeader


const styles = EStyleSheet.create({
    landingHeader:{
        backgroundColor: '#F7F7FF',
        display:'flex',
        flexDirection:'row',
        paddingVertical:'1rem',
        paddingHorizontal:'1rem',
        paddingBottom:'0.5rem',
        justifyContent:'space-between',
        alignItems:'center'
    },
    link:{
      backgroundColor:'#ef2f55',
      paddingBottom:normalize(8),
      paddingTop:normalize(4),
      paddingHorizontal:'0.9rem',
      borderRadius:30
    },
    linkText:{
      color:'#fff',
      fontFamily:'graphik-medium',
      fontSize:'.8rem',
    }
})