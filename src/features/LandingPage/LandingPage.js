import React from 'react';
import {
    ScrollView,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import LandingPageHeader from '../../shared/LandingPageHeader';
import LandingBanner from '../../shared/LandingBanner';
import LandingPageInfo from '../../shared/LandingPageInfo';
import MainFooter from '../../shared/MainFooter';
import LandingFooter from '../../shared/LandingFooter';


const LandingPage = ({navigation}) => {
    // const navigation = useNavigation();

    const goToLogin = () => {
        navigation.navigate('Login')
    }

    const goToDashboard = () => {
        navigation.navigate('AppRouter')
    }

    const goToSignup = () => {
        navigation.navigate('Signup')
      }

    return (
        <SafeAreaView>
            <ScrollView style={{backgroundColor:'#fff'}}>
                    <LandingPageHeader onPress={goToLogin} goToDashboard={goToDashboard} />
                    <LandingBanner onPress={goToSignup} />
                    <LandingPageInfo />
                    <MainFooter />
                    <LandingFooter />
            </ScrollView>
        </SafeAreaView>
    )
}

export default LandingPage;
