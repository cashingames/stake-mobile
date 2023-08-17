import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Image, ImageBackground, ScrollView, View, Text } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../../utils/normalize";
import AppButton from "../../shared/AppButton";
import { useNavigation } from "@react-navigation/native";

const PromotionScreen = ({ route }) => {
    const navigation = useNavigation();
    const params = route.params;


    const goBack = () => {
        navigation.navigate('Promotions')
    }
    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <View style={styles.headerContainer}>
                <Ionicons name='chevron-back-sharp' size={29} color='#1C453B' style={{ marginLeft: 10 }} onPress={goBack} />
                <Text style={styles.headerText}>{params.promotion_title}</Text>
                {/* <Text style={styles.headerText}>Weekly</Text> */}
                <View></View>
            </View>
            <ScrollView style={styles.container}>
                <Image
                    source={params.inner_banner}
                    style={styles.banner}
                />
                <View style={styles.detailsMainContainer}>
                    {/* <View style={styles.detailsContainer}>
                        <Text style={styles.detailsHeader}>About</Text>
                        <Text style={styles.detailsText}>
                            The Company has the right to cancel the bets, wins, bonuses, Jackpots, or any
                            other prizes displayed or provided to the Player due to
                            any technical, mechanical, or software bug or error.
                        </Text>
                    </View> */}
                    <View style={styles.detailsContainer}>
                        <Text style={styles.detailsHeader}>Description</Text>
                        <Text style={styles.detailsText}>{params.promotion_description}</Text>
                    </View>
                </View>
                {/* <AppButton text='Activate offer' style={styles.activateButton} textStyle={styles.buttonText} /> */}

            </ScrollView>
        </ImageBackground>
    )
}
export default PromotionScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingBottom: normalize(14)
    },
    headerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: '1.5rem',
        alignItems: 'center',
        paddingTop: normalize(60),
    },
    banner: {
        width: '100%',
        height: normalize(138)
    },
    headerText: {
        fontSize: 23,
        color: '#1C453B',
        fontFamily: 'gotham-bold',
    },
    detailsMainContainer: {
        marginVertical: '2rem'
    },
    detailsContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: normalize(22),
        marginBottom: '1rem',
    },
    detailsHeader: {
        fontSize: '1.3rem',
        color: '#1C453B',
        fontFamily: 'bubble-regular',
        marginBottom:'.5rem'
    },
    detailsText: {
        fontSize: '1rem',
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        textAlign: 'center',
        lineHeight: '1.3rem'
    },
    activateButton: {
        // backgroundColor: '#E15220',
        marginVertical: 25,
        paddingVertical: normalize(19),
        marginHorizontal: normalize(22)
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },
})