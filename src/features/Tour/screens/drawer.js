import { View, Text, Dimensions, Platform } from 'react-native'
import React, { useEffect } from 'react'
import { StyleSheet } from 'react-native'
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenHeight } from '../../../utils/normalize';
import { ScrollView } from 'react-native';
import { Image } from 'react-native';
import { Walkthroughable } from '../Walkthrouable';
import { copilot, walkthroughable, CopilotStep } from 'react-native-copilot';
import AppButton from '../../../shared/AppButton';
import { isTrue } from '../../../utils/stringUtl';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { DrawerItem } from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import { defaultToolTip } from '../Index';

const { width } = Dimensions.get('window');

function Drawer(CopilotProps) {
  const props = CopilotProps;
  const user = useSelector(state => state.auth.user);
  const navigation = useNavigation()

  useEffect(()=>{
    if(props.id === props.activeScreen){
        setTimeout(()=>{
            
            // console.log('reach11')
            CopilotProps.start()
            CopilotProps.copilotEvents.on('stop', handleTourStop)

            return () => {
                CopilotProps.copilotEvents.off('stop', handleTourStop)
            }
        }, 300)
    }
}, [props.activeScreen])

const handleTourStop = ()=>{
    // console.warn(Object.keys(CopilotProps))
    CopilotProps.goToNext()
    // navigation.navigate("LiveTriviaLeaderboard", {
    //     triviaId: 0
    // })
}

  return (
    <View style={styles.container}>

      {/* drawer container */}
      <View style={styles.contentContainer}>
        <ScrollView style={{ flex: 1 }}>

          <View style={drawStyles.sideHeader}>
              <Image
                  style={drawStyles.avatar}
                  source={isTrue(user.avatar) ? { uri: `${Constants.manifest.extra.assetBaseUrl}/${user.avatar}` } : require("../../../../assets/images/user-icon.png")}
              />
              <Text style={drawStyles.userTitle}> {user.fullName}</Text>
              <Text style={drawStyles.userName}> @{user.username}</Text>
              <CopilotStep text={
                  <View>
                      <Text style={drawStyles.tourTitle} >User Profile</Text>
                      <Text style={drawStyles.tourDesc}>Edit your profile and update your bank details</Text>
                  </View>
              } order={1} name="Order1">
                  <Walkthroughable>
                      <AppButton text="View Profile" style={drawStyles.profile} textStyle={drawStyles.profileText} onPress={() => navigation.navigate('UserProfile')} />
                  </Walkthroughable>
              </CopilotStep>
              
          </View>

          {/* 2 */}
          <View style={drawStyles.menu}>
            <CopilotStep text={
                <View>
                    <Text style={drawStyles.tourTitle} >Live Trivia</Text>
                    <Text style={drawStyles.tourDesc}>Show how fast and skilled you are by competing with lots of users and standing a chance of winning great cash prizes</Text>
                </View>
            } order={2} name="Order2">
                <Walkthroughable>
                    <DrawerItem
                        label={() =>
                            <View style={drawStyles.item}>
                                <Text style={drawStyles.itemLabel}>Live Trivia</Text>
                                <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                            </View>}
                        onPress={() => navigation.navigate('LiveTrivias')}
                        activeTintColor='#EF2F55'
                        style={drawStyles.label}
                        labelContainerStyle
                    />
                </Walkthroughable>
            </CopilotStep>
            
            <CopilotStep text={
                <View>
                    <Text style={drawStyles.tourTitle} >Challenges</Text>
                    <Text style={drawStyles.tourDesc}>Challenge a friend to a duel and also stand a chance of winning cash prizes</Text>
                </View>
            } order={3} name="Order3">
                <Walkthroughable>
                    <DrawerItem
                        label={() =>
                            <View style={drawStyles.item}>
                                <Text style={drawStyles.itemLabel}>My Challenges</Text>
                                <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                            </View>}
                        onPress={() => navigation.navigate('MyChallenges')}
                        activeTintColor='#EF2F55'
                        style={drawStyles.label}
                        labelContainerStyle
                    />
                </Walkthroughable>
            </CopilotStep>

            {Platform.OS === 'ios' ?
                <></>
                :
                <DrawerItem
                    label={() =>
                        <View style={drawStyles.item}>
                            <Text style={drawStyles.itemLabel}>Store</Text>
                            <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                        </View>}
                    onPress={() => navigation.navigate('GameStore')}
                    activeTintColor='#EF2F55'
                    style={drawStyles.label}
                    labelContainerStyle
                />
            }

            <DrawerItem
                label={() =>
                    <View style={drawStyles.item}>
                        <Text style={drawStyles.itemLabel}>Leaderboards</Text>
                        <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                    </View>}
                onPress={() => navigation.navigate('Leaderboard')}
                activeTintColor='#EF2F55'
                style={drawStyles.label}
                labelContainerStyle
            />
            
            <CopilotStep text={
                <View>
                    <Text style={drawStyles.tourTitle} >Get Help</Text>
                    <Text style={drawStyles.tourDesc}>Need help?
                        Contact us by sending us your questions and feedback or read through our FAQ</Text>
                </View>
            } order={4} name="Order4">
                <Walkthroughable>
                    <DrawerItem
                        label={() =>
                            <View style={drawStyles.item}>
                                <Text style={drawStyles.itemLabel}>Get Help</Text>
                                <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                            </View>}
                        onPress={() => navigation.navigate('Help')}
                        activeTintColor='#EF2F55'
                        style={drawStyles.label}
                        labelContainerStyle
                    />
                </Walkthroughable>
            </CopilotStep>
            
            <DrawerItem
                label={() =>
                    <View style={drawStyles.item}>
                        <Text style={drawStyles.itemLabel}>Need a Tour</Text>
                        <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                    </View>}
                onPress={() => {
                    // CopilotProps.start()
                    // dispatch(toggleAppTour(true))
                    navigation.navigate("AppTour")
                }}
                activeTintColor='#EF2F55'
                style={drawStyles.label}
                labelContainerStyle
            />
            
            <CopilotStep text={
                <View>
                    <Text style={drawStyles.tourTitle} >Invite Friends </Text>
                    <Text style={drawStyles.tourDesc}>Refer your friends and get bonuses for each friend referred and also stand a chance of winning cash prizes</Text>
                </View>
            } order={5} name="Order5">
                <Walkthroughable>
            
                    <DrawerItem
                            label={() =>
                                <View style={drawStyles.item}>
                                    <Text style={drawStyles.itemLabel}>Invite Friends</Text>
                                    <Ionicons name="chevron-forward-outline" size={24} color="#7C7D7F" />
                                </View>}
                            onPress={() => navigation.navigate('Invite')}
                            activeTintColor='#EF2F55'
                            style={drawStyles.label}
                            labelContainerStyle
                        />
                </Walkthroughable>
            </CopilotStep>
            
        </View>

        </ScrollView>
      </View>

    </View>
  )
}

const drawStyles = EStyleSheet.create({
  container: {
      flex: 1,
  },
  sideHeader: {
      alignItems: 'center',
      justifyContent: 'flex-end',
      borderBottomWidth: 1,
      borderBottomColor: "rgba(0, 0, 0, 0.1)",
      paddingTop: responsiveScreenHeight(6),
      paddingBottom: responsiveScreenHeight(2),
      backgroundColor: '#F2F5FF',
  },
  avatar: {
      width: normalize(90),
      height: normalize(90),
      borderWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      borderRadius: 100
  },
  userTitle: {
      fontSize: '0.9rem',
      lineHeight: '0.9rem',
      fontFamily: 'graphik-medium',
      color: '#000000',
      marginTop: 10,
  },
  userName: {
      color: '#333333',
      fontSize: '0.7rem',
      lineHeight: '0.7rem',
      fontFamily: 'graphik-regular',
      opacity: 0.5,
      marginVertical: 10
  },
  profile: {
      backgroundColor: '#EF2F55',
      paddingVertical: 10,
      marginVertical: 0,
      borderRadius: 32,
  },
  profileText: {
      fontSize: '0.6rem',
      lineHeight: '0.6rem',
  },
  menu: {
      // flex: 7,
  },
  label: {
      borderBottomWidth: 1,
      borderColor: 'rgba(0, 0, 0, 0.1)',
      paddingVertical: responsiveScreenHeight(0.4),
  },
  item: {
      flexDirection: 'row',
      justifyContent: 'space-between',
  },
  itemLabel: {
      color: '#151C2F',
      fontSize: '0.9rem',
      fontFamily: 'graphik-regular',
  },
  logoutContainer: {
      backgroundColor: '#FFFF',
      marginBottom: 22,
      // flex: 1,
      // justifyContent: 'flex-end'
  },
  appVersion: {
      color: '#000000',
      fontSize: '0.8rem',
      lineHeight: '0.7rem',
      fontFamily: 'graphik-regular',
      opacity: 0.7,
      marginVertical: 10,
      textAlign: 'center',
  },
  numberContainer: {
      backgroundColor: '#518EF8',
      borderWidth: 2,
      borderColor: 'white',
      borderRadius: 100,
      width: normalize(24),
      height: normalize(24),
      alignItems: 'center',
      justifyContent: 'center'
      // padding: '.1.5rem'
  },
  number: {
      textAlign: 'center',
      alignItems: 'center',
      color: '#FFFF',
      fontFamily: 'graphik-medium',
      fontSize: Platform.OS === 'ios' ? '0.5rem' : '0.5rem',
      // marginTop: Platform.OS === 'ios' ? '.3rem' : '.081rem',
  },
  notificationCount: {
      flexDirection: 'row'
  },
  tourTitle: {
      color: '#EF2F55',
      fontWeight: '600',
      fontSize: 22,
      marginBottom: 10
  }
});

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        width
    },
    contentContainer: {
      flex: 1,
      width: width * 0.8,
      backgroundColor: 'white'
    },
    tourDesc: {
        width: window.width * 0.7
    }
})

export default copilot({
  animated: true,
  overlay: 'svg',
  labels: {
      finish: 'Next',
      skip: ' '
  },
//   tooltipComponent: defaultToolTip
})(Drawer);