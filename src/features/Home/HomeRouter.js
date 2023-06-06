import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import GamesListScreen from '../Games/GamesListScreen';
import HelpPages from '../Support/HelpPages';
import NotificationsScreen from '../Notifications/NotificationsScreen';


const Tab = createBottomTabNavigator();

const HomeRouter = () => {

    return (
        <Tab.Navigator screenOptions={{
            tabBarActiveTintColor: "#072169", tabBarInactiveTintColor: '#0721697d',
            headerTitleAlign: 'center', tabBarLabelStyle: { fontSize: 11, fontFamily: 'bubble-regular' },
            tabBarStyle: { backgroundColor: '#EFF2F6', height: 71, paddingBottom: 15 }
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
                    fontSize: 23,
                },
                // headerTransparent: true,
                headerTintColor: '#072169',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="game-controller" color={color} size={30} />
                ),
            }} />
            <Tab.Screen name="Contact Us" component={HelpPages} options={{
                title: 'Help',
                tabBarLabel: 'Help',
                headerStyle: {
                    backgroundColor: '#FFFF',
                },
                headerTintColor: '#072169',
                headerTitleStyle: {
                    fontFamily: 'bubble-regular',
                    fontSize: 23,
                },
                tabBarIcon: ({ color }) => (
                    <Ionicons name="help-circle" color={color} size={30} />
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
                    fontSize: 23,
                },
                headerTintColor: '#072169',
                tabBarIcon: ({ color }) => (
                    <Ionicons name="mail" color={color} size={30} />
                ),
            }} />
        </Tab.Navigator>
    );
}


export default HomeRouter;