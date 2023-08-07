import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import GamesListScreen from '../Games/GamesListScreen';
import NotificationsScreen from '../Notifications/NotificationsScreen';
import ContactUs from '../Support/ContactUs';


const Tab = createBottomTabNavigator();

const HomeRouter = () => {

    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: "#1C453B", tabBarInactiveTintColor: '#1c453b87',
            headerTitleAlign: 'center', tabBarLabelStyle: { fontSize: 13, fontFamily: 'bubble-regular' },
            tabBarStyle: { backgroundColor: '#EFF2F6', height: 73, paddingBottom: 16 }
        }} >
            <Tab.Screen name="Home" component={HomeScreen}
                options={{
                    headerShown: false,
                    tabBarLabel: 'Home',
                    tabBarIcon: ({ color }) => (
                        <Ionicons name="home" color={color} size={30} />
                    ),
                }} />
            <Tab.Screen name="Games" component={GamesListScreen} options={{
                title: 'All Games',
                tabBarLabel: 'Games',
                headerStyle: {
                    backgroundColor: '#FFFF',
                },
                headerTitleStyle: {
                    fontFamily: 'bubble-regular',
                    fontSize: 25,
                },
                // headerTransparent: true,
                headerTintColor: '#1C453B',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="game-controller" color={color} size={35} />
                ),
            }} />
            <Tab.Screen name="Contact Us" component={ContactUs} options={{
                title: 'Contact Us',
                tabBarLabel: 'Contact',
                headerStyle: {
                    backgroundColor: '#FFFF',
                },
                headerTintColor: '#1C453B',
                headerTitleStyle: {
                    fontFamily: 'bubble-regular',
                    fontSize: 25,
                },
                tabBarIcon: ({ color }) => (
                    <Ionicons name="help-circle" color={color} size={35} />
                ),
            }} />
            <Tab.Screen name="Notification" component={NotificationsScreen} options={{
                title: 'Notifications',
                tabBarLabel: 'Notifications',
                headerStyle: {
                    backgroundColor: '#FFFF',
                },
                headerTitleStyle: {
                    fontFamily: 'bubble-regular',
                    fontSize: 25,
                },
                headerTintColor: '#1C453B',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="mail" color={color} size={35} />
                ),
            }} />
        </Tab.Navigator>
    );
}


export default HomeRouter;