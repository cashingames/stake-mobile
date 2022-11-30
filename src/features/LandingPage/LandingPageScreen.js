import React, {useState, useEffect} from 'react';
import {
    Pressable,
    Text,
    View,
    ScrollView,
    Platform
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import LandingPageHeader from './LandingPageHeader';
import LandingBanner from './LandingBanner'
import LandingPageInfo from './LandingPageInfo';
import MainFooter from './MainFooter';
import LandingFooter from './LandingFooter';

export default function LandingPageScreen({navigation}) {
    return (
        <SafeAreaView>
            <ScrollView>
                    <LandingPageHeader />
                    <LandingBanner />
                    <LandingPageInfo />
                    <MainFooter />
                    <LandingFooter />
            </ScrollView>
        </SafeAreaView>
    )
}
