import 'react-native-gesture-handler';
import * as React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import DashboardScreen from './DashboardScreen';
import UserProfile from './UserProfile';
import WalletScreen from './WalletScreen';
import GameScreen from './GameScreen';
import GameBoosts from './GameBoosts';
import InviteFriends from './InviteFriends';
import TermsAndConditions from './TermsAndConditions';
import PrivacyPolicy from './PrivacyPolicy';
import CustomDrawerContent from '../components/CustomDrawerContent';

const Drawer = createDrawerNavigator();

function SideNavigator() {

  return (
    <Drawer.Navigator
      drawerType={'front'}
      drawerContent={props => <CustomDrawerContent {...props} />}
      screenOptions=
      {{
        headerShown: false,
        // drawerActiveTintColor: 'red',
        // drawerLabelStyle: { fontFamily: 'graphik-regular', borderBottomColor: 'rgba(0, 0, 0, 0.1)', borderBottomWidth: 1 },
        // drawerActiveBackgroundColor:'white'
      }}
    >
      <Drawer.Screen name="Dashboard" component={DashboardScreen} />
      <Drawer.Screen name="Profile" component={UserProfile} />
      <Drawer.Screen name="Wallet" component={WalletScreen} />
      <Drawer.Screen name="Games" component={GameScreen} />
      <Drawer.Screen name="Store" component={GameBoosts} />
      <Drawer.Screen name="Invite Friends" component={InviteFriends} />
      <Drawer.Screen name="Terms & Conditions" component={TermsAndConditions} />
      <Drawer.Screen name="Privacy Policy" component={PrivacyPolicy} />
    </Drawer.Navigator>


  );
}
export default SideNavigator;
