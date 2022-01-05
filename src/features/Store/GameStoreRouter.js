import React from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PurchaseBoostsScreen from './PurchaseBoostsScreen';
import MyBoostsScreen from './MyBoostsScreen';

const Toptab = createMaterialTopTabNavigator();

export default function GameStoreRouter({ navigation }) {

    return (

            <Toptab.Screen name="PurchaseBoosts" component={PurchaseBoostsScreen} options={{ tabBarLabel: 'Purchase', }} />
    );
}
