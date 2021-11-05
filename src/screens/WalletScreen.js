import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, Pressable, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { normalize } from '../constants/NormalizeFont';
// import currency from "../services/currency";
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../components/Header';
import { useNavigation } from '@react-navigation/native';

export default function WalletScreen({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <Header title="Wallet" />
                <WalletBalance />
                <FundButton />
                <UserEarnings point="5000" />
                <TransactionLink />
            </ScrollView>
        </SafeAreaView>
    );
}
const WalletBalance = () => {
    return (
        <View style={styles.balance}>
            <Text style={styles.walletTitle}>Wallet Balance</Text>
            <Text style={styles.availableAmount}>&#8358;10,002.00</Text>
        </View>
    )
};

const FundButton = () => {
    return (
        <View style={styles.buttonContainer}>
            <Pressable
                style={() => [
                    {
                        backgroundColor:
                            '#EF2F55'
                    },
                    styles.button
                ]}
            >
                <Text style={styles.fundButton}>Fund Wallet</Text>
            </Pressable>
        </View>
    )
};

const UserEarnings = ({ point }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.earnings}>
            <Text style={styles.earningText}>Your available point balance</Text>
            <View style={styles.earningContainer}>
                <Text style={styles.earningAmount}>{point}pts</Text>
            </View>
        </View>
    )
};

const TransactionLink = () => {
    const navigation = useNavigation();
    return (
        <View style={styles.link}>
            <Text style={styles.linkTitle}>See Transactions</Text>
            <TouchableOpacity onPress={() => navigation.navigate('TransactionScreen')}>
                <Ionicons name="md-arrow-forward-sharp" size={24} color="#EF2F55" />
            </TouchableOpacity>
        </View>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F5FF'
    },
    balance: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: normalize(38),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        backgroundColor: '#fff',
    },
    walletTitle: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: '#7C7D7F'
    },
    availableAmount: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(30),
        color: '#333333'
    },
    buttonContainer: {
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
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
    fundButton: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
        color: '#FFFF'
    },
    earnings: {
        backgroundColor: '#fff',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(15),
        marginHorizontal: normalize(18),
        marginVertical: normalize(18),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
    },
    earningText: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: 'rgba(0, 0, 0, 0.5)'
    },
    earningAmount: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(22),
        color: 'black'
    },
    earningContainer: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    earningLink: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
    },
    link: {
        backgroundColor: '#E5E5E5',
        paddingVertical: normalize(8),
        paddingHorizontal: normalize(15),
        marginHorizontal: normalize(18),
        marginVertical: normalize(5),
        borderRadius: 8,
        borderWidth: normalize(1),
        borderColor: 'rgba(0, 0, 0, 0.15)',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    linkTitle: {
        color: '#EF2F55',
        fontFamily: 'graphik-medium',
        fontSize: normalize(12),
    }
});
