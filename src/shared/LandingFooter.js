import { View, Text, Image, Pressable, Linking } from 'react-native'
import React from 'react'
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet'

const LandingFooter = () => {
    const navigation = useNavigation()

  return (
    <View style={styles.landingFooter}>
      <View style={styles.footerLogo}>
        <Image source={require('../../assets/images/logo-small.png')} />
      </View>
      <View style={styles.footerLinkContainer}>
        <Pressable onPress={() => navigation.navigate('Terms')}> 
            <Text style={styles.linkLabel}>Terms and Conditions</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Support')}> 
            <Text style={styles.linkLabel}>FAQ</Text>
        </Pressable>
        <Pressable onPress={() => navigation.navigate('Privacy')}>
            <Text style={styles.linkLabel}>Privacy and Policy</Text>
        </Pressable>
      </View>
      <View style={styles.socialMediaLinks}>
        <View>
            <Text style={styles.copyrightTexts}>Copyright Cashingames.</Text>
            <Text style={styles.copyrightTexts}>All Rights Reserved.</Text>
        </View>
        <View style={styles.socialMediaIcons}>
        <FontAwesome5 name="twitter" size={24} color="#fff"  style={styles.icon}
        onPress={() => Linking.openURL('https://www.twitter.com/cashingamesng')}/>
        <FontAwesome5 name="instagram" size={24} color="#fff" style={styles.icon}
        onPress={() => Linking.openURL('https://www.instagram.com/cashingames')} />
        <FontAwesome5 name="facebook" size={24} color="#fff" 
        style={styles.icon}
        onPress={() => Linking.openURL('https://www.facebook.com/cashingames')}/>
        </View>
      </View>
    </View>
  )
}


const styles = EStyleSheet.create({
    landingFooter:{
        backgroundColor:'#141B2E',
        paddingVertical:'2rem'
    },
    footerLogo:{
        alignItems:'center',
        marginVertical:'2rem'
    },
    footerLinkContainer:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        width:'100%',
        marginBottom:'2rem'
    },

    linkLabel:{
        color:'#fff'
    },

    socialMediaLinks:{
        flexDirection:'row',
        justifyContent:'space-evenly',
        alignItems:'center',
        borderTopWidth:1,
        borderColor:'#989BA31A',
        paddingTop:'2rem'
    },

    copyrightTexts:{
        color:'#fff',
        fontSize:'0.9rem',
        color: '#B5B1B1',
        marginVertical:'0.5rem'
    },
    socialMediaIcons:{
        flexDirection:'row',
        justifyContent:'space-between',
        gap:'2rem'
    },

    icon:{
        marginHorizontal:'1rem'
    }
})
export default LandingFooter