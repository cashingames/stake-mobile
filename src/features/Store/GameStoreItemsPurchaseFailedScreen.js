import React from 'react';
import { Text, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Constants from 'expo-constants';
import AppButton from '../../shared/AppButton';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';

const GameStoreItemsPurchaseFailed = ({ route }) => {
    const params = route.params;
    const navigation = useNavigation();
    return (
        <View style={styles.topContainer}>
            <View style={styles.container}>
                <Text style={styles.paymentHeader}>Payment Unsuccessful....</Text>
                <View style={styles.image}>
                    <Image
                        source={{ uri: `${Constants.expoConfig.extra.assetBaseUrl}/${params.boost_image}` }}
                        style={styles.boostIcon}
                    />
                </View>
                <Text style={styles.message}>Sorry {params.boost_name} purchase was not successful</Text>
            </View>
            <View style={styles.congratsButtons}>
                <AppButton text="Let's try again" onPress={() => navigation.navigate('GameStore')} style={styles.actionButton} />
                <AppButton text="Contact Support" onPress={() => navigation.navigate('Home')} style={styles.actionButton} />
            </View>
        </View>
    )
}
export default GameStoreItemsPurchaseFailed;


const styles = EStyleSheet.create({
    topContainer: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        paddingHorizontal: responsiveScreenWidth(8),
        justifyContent: 'center'

    },
    container: {
        marginBottom: responsiveScreenWidth(15),
    },
    image: {
        alignItems: 'center',
        marginVertical: normalize(15)
    },
    boostIcon: {
        width: normalize(115),
        height: normalize(115),
    },
    paymentHeader: {
        fontFamily: 'gotham-bold',
        fontSize: '1.5rem',
        textAlign: 'center',
        color: '#1C453B',
    },
    message: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem',
        textAlign: 'center',
        color: '#1C453B',
        lineHeight: '1.6rem',
    },
    congratsButtons: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    actionButton: {
        marginTop: normalize(5),
    },
});
