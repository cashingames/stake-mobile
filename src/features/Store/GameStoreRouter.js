import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PurchaseBoostsScreen from './PurchaseBoostsScreen';
import MyBoostsScreen from './MyBoostsScreen';

const Toptab = createMaterialTopTabNavigator();

export default function GameStoreRouter({ navigation }) {

    return (
        <Toptab.Navigator
            screenOptions={{
                tabBarLabelStyle: { fontSize: 12, fontFamily: 'graphik-medium', },
                tabBarStyle: { backgroundColor: '#FFFF' },
                tabBarIndicatorStyle: { backgroundColor: '#EB5757' },
                tabBarPressColor: "#fff" // compulsory, fixes wrong/slow color when tabbing between screens
            }}
            transitionStyle={{}}
            tab
            sceneContainerStyle={{
                backgroundColor: '#F8F9FD'
            }}
        >
            <Toptab.Screen name="PurchaseBoosts" component={PurchaseBoostsScreen} options={{ tabBarLabel: 'Purchase', }} />
            <Toptab.Screen name="MyBoosts" component={MyBoostsScreen} options={{ tabBarLabel: 'My Items' }} />
        </Toptab.Navigator>
    );
}
