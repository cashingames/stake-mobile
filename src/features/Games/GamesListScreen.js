import React from "react";
import { ImageBackground, Platform, ScrollView, StatusBar, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize, { responsiveScreenWidth } from "../../utils/normalize";
import { useFocusEffect } from "@react-navigation/native";
import GamesCardsList from "../../shared/GameCardsList";





const GamesListScreen = ({ navigation }) => {

    useFocusEffect(
        React.useCallback(() => {
            if (Platform.OS === "android") {
                StatusBar.setTranslucent(true);
                StatusBar.setBackgroundColor("transparent");
                return;
            }
            StatusBar.setBarStyle('dark-content');
            return () => {
                if (Platform.OS === "android") {
                    StatusBar.setTranslucent(true)
                    return;
                }
                StatusBar.setBarStyle('dark-content');
            }
        }, [])
    );


    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <View style={styles.gamesContainer}>
                <GamesCardsList />
                </View>
            </ScrollView>
        </ImageBackground>
    )
}


export default GamesListScreen;

const styles = EStyleSheet.create({
    contentContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(20),
        paddingTop:'3rem'
    },
    gamesContainer: {
      marginTop: '2rem'
    },
})