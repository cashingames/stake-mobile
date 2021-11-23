import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { useNavigation } from '@react-navigation/native';
import HeaderBack from './HeaderBack';

const PageHeader = ({ title }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <HeaderBack onPress={() => navigation.navigate('WalletScreen')} />
            <Text style={styles.headerTextStyle}>{title}</Text>
        </View>
    )
}
export default PageHeader;

const styles = StyleSheet.create({
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
    },

    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
    },
});
