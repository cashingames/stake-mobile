import React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable } from 'react-native';
import normalize from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function FundWalletCompleted({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <TransactionSuccessful />
            </ScrollView>
        </SafeAreaView>
    );
}
const TransactionSuccessful = () => {

    return (
        <View style={styles.success}>
            <Text style={styles.successTitle}>Successful!</Text>
            <Text style={styles.successText}>
                The transaction to fund your wallet with the amount:
                &#8358;2,000.00 has been completed
            </Text>
            <DoneButton onPress={() => navigation.navigate('WalletScreen')} text='Done' />
        </View>
    )
};

const DoneButton = ({ onPress, text }) => {
    return (
        <View style={styles.buttonContainer}>
            <Pressable
                onPress={onPress}
                style={() => [
                    {
                        backgroundColor:
                            '#EF2F55'
                    },
                    styles.button
                ]}
            >
                <Text style={styles.doneButton}>{text}</Text>
            </Pressable>
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF',
    },
    success: {
        display: 'flex',
        marginHorizontal: normalize(15),
        marginVertical: normalize(200)
    },
    image: {
        flex: 1,
    },
    successTitle: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(30),
        color: '#151C2F',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: 'center'
    },
    successText: {
        fontFamily: 'graphik-regular',
        fontSize: normalize(13),
        color: '#4F4F4F',
        alignItems: 'center',
        textAlign: 'center',
        lineHeight: normalize(22),
        marginVertical: normalize(15)
    },
    buttonContainer: {
        // borderColor: 'rgba(0, 0, 0, 0.15)',
        // borderBottomWidth: normalize(1),
        paddingVertical: normalize(20),
        backgroundColor: '#fff',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(32),
        marginHorizontal: normalize(18),
        borderRadius: 12,
        elevation: 3,
    },
    doneButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#FFFF'
    },


});
