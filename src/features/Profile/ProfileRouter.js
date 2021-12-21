import React from 'react';
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import UserProfileScreen from './UserProfileScreen';
import EditDetailsScreen from './EditDetailsScreen';
import UserStatsScreen from './UserStatsScreen';
import ChangePasswordScreen from './ChangePasswordScreen';
import AchievementsMilestoneScreen from './AchievementsMilestoneScreen';
import BankDetailsScreen from './BankDetailsScreen';


const ProfileStack = createNativeStackNavigator();

const ProfileRouter = () => {

    return (

        <ProfileStack.Navigator screenOptions={{ title: "" }}>
            <ProfileStack.Screen name="EditDetails" component={EditDetailsScreen} options={{ title: 'Edit Details' }} />
            <ProfileStack.Screen name="ChangePassword" component={ChangePasswordScreen} options={{ title: 'Change Password' }} />
            <ProfileStack.Screen name="UserStats" component={UserStatsScreen} options={{ title: 'Stats' }} />
            <ProfileStack.Screen name="AchievementsMilestone" component={AchievementsMilestoneScreen} options={{ title: 'Milestones' }} />
            <ProfileStack.Screen name="BankDetails" component={BankDetailsScreen} options={{ title: 'Bank Details' }} />
        </ProfileStack.Navigator>
    );
}

export default ProfileRouter