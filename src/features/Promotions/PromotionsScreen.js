import React, { useState } from "react";
import { Image, ImageBackground, Pressable, ScrollView, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import normalize from "../../utils/normalize";
import logToAnalytics from "../../utils/analytics";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";


const PromotionsScreen = () => {
    const [isNewPromotion, setIsNewPromotion] = useState(false);
    const user = useSelector(state => state.auth.user);


    const promotions = [
        {
            "id": 1,
            "bannerImage": require('../../../assets/images/trivia-banner.png'),
            "name": 'Weekly trivia'
        },
        {
            "id": 2,
            "bannerImage": require('../../../assets/images/trivia-banner.png'),
            "name": 'Wise weekly trivia'
        },
    ]

    return (
        <ImageBackground source={require('../../../assets/images/game-play-background.png')}
            style={{ flex: 1 }}
            resizeMethod="resize">
            <ScrollView style={isNewPromotion ? styles.container : {}} contentContainerStyle={!isNewPromotion ? styles.noContainer : {}}>
                {!isNewPromotion ?
                    <View>
                        <View style={styles.imageAvatar}>
                            <Image
                                source={require('../../../assets/images/gift-dynamic.png')}
                                style={styles.avatar}
                            />
                        </View>
                        <Text style={styles.noPromotionsText}>No promotions yet, check back later</Text>
                    </View>
                    :
                    <View>
                        {
                            promotions.map((promotion, i) => <PromotionBanner key={i} promotion={promotion} user={user}
                            />)
                        }
                    </View>
                }
            </ScrollView>
        </ImageBackground>
    )
}

const PromotionBanner = ({ promotion, user }) => {
    const navigation = useNavigation();

    const viewPromotion = () => {
        logToAnalytics("promotions_button_clicked", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email,
            'promotion_title':promotion.name,
        })
        navigation.navigate('Promotion', {
            promotion_title: promotion.name,
        })
    }
    return (
        <Pressable style={styles.bannerContainer} onPress={viewPromotion}>
            <Image
                source={promotion.bannerImage}
                style={styles.triviaAvatar}
            />
        </Pressable>
    )
}

export default PromotionsScreen;

const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: normalize(14),
        paddingTop: normalize(22)
    },
    noContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: normalize(14),

    },
    imageAvatar: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatar: {
        width: '8rem',
        height: '8rem',
    },
    noPromotionsText: {
        fontSize: '1.4rem',
        color: '#072169',
        fontFamily: 'gotham-medium',
        textAlign: 'center',
        lineHeight: '1.8rem'
    },
    bannerContainer: {
        alignItems:'center',
        marginBottom:'1.1rem'
    },
    triviaAvatar: {
        borderRadius: 13,
        width: normalize(320),
        height: normalize(245),

    }
})