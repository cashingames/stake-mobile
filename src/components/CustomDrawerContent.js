import React from 'react';
import {
    View,
    StyleSheet,
    Image,
    Text,
} from 'react-native';
import {
    DrawerContentScrollView,
    DrawerItem,
    DrawerItemList,
} from '@react-navigation/drawer';
import { normalize } from '../constants/NormalizeFont';

function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView contentContainerStyle={styles.container} {...props}>
            <View style={styles.menu}>
                <DrawerItemList  labelStyle={styles.itemLabel} {...props}  />
            </View>
            <DrawerItem
                label="Help"
                labelStyle={styles.itemLabel}
            />
        </DrawerContentScrollView>
    );
}
export default CustomDrawerContent;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // height: '100%',
    },
    sideHeader: {
        // flex: 1,
        alignItems: 'center',
    },
    logo: {
        resizeMode: 'contain',
        width: normalize(100),
        height: normalize(80),
    },
    userName: {
        fontSize: normalize(21),
        fontFamily: 'Roboto_900Black',
        color: '#181818',
        fontWeight: 'bold',
        textTransform: 'uppercase',
    },
    userPhone: {
        color: '#545252',
        fontSize: normalize(12),
        fontFamily: 'Roboto_400Regular',
        marginVertical: normalize(10),
    },
    viewProfile: {
        fontSize: normalize(12),
        color: '#2B4257',
        fontFamily: 'Roboto_700Bold',
        fontWeight: '700',
        lineHeight: normalize(14),
        textTransform: 'uppercase',
    },
    menu: {
        // flex: 2,
        // marginLeft: normalize(10),
    },
    itemLabel: {
        fontFamily: 'graphik-regular',
        color: 'red',
        fontSize: normalize(24),
    },
    logoutContainer: {
        alignItems: 'center',
        justifyContent: 'flex-end',
        marginBottom: normalize(20),
    },
    logoutText: {
        fontFamily: 'Roboto_400Regular',
        color: '#CE0303',
        fontSize: normalize(12),
        lineHeight: normalize(19),
    },
});
