import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from './UserProfileScreen';
import EditDetailsScreen from './EditDetailsScreen';
import ChangePasswordScreen from './ChangePasswordScreen';

const ProfileStack = createNativeStackNavigator();

const ProfileRouter = () => {

    return (

        <ProfileStack.Navigator screenOptions={{ title: "" }}>
            <ProfileStack.Screen name="UserProfile" component={UserProfileScreen} options={{ title: 'Profile' }} />
            <ProfileStack.Screen name="EditDetails" component={EditDetailsScreen} options={{ title: 'Edit Details' }} />
            <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
        </ProfileStack.Navigator>
    );
}

export default ProfileRouter