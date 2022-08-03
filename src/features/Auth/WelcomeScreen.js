import React from "react";
import { Text, View } from "react-native";
import AppButton from "../../shared/AppButton";
import { useNavigation } from '@react-navigation/native';
import { useSelector } from "react-redux";
import { isTrue } from "../../utils/stringUtl";



const WelcomeScreen = () => {
    const navigation = useNavigation();
    const token = useSelector(state => state.auth.token);
    console.log(token)


    const goToDashboard = () => {
        if (isTrue(token)) {
            navigation.navigate('AppRouter')
        }
    }

    return (
        <View>
            <Text>Welcome</Text>
            <AppButton text="Proceed" onPress={goToDashboard} />
        </View>
    )
}
export default WelcomeScreen;