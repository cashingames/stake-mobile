import * as React from 'react';
import { StyleSheet, View, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import normalize from '../utils/normalize';

const Header = ({ options }) => {
    const navigation = useNavigation();

    return (
        <View style={styles.headerIcons}>
            <TouchableOpacity onPress={() => navigation.navigate('Home')}>
                <Image
                    style={styles.pageIcon}
                    source={require('../../assets/images/Home.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('GameScreen')}>
                <Image
                    style={styles.pageIcon}
                    source={require('../../assets/images/gamepad.png')}
                />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('WalletScreen')}>
                <Image
                    style={styles.pageIcon}
                    source={require('../../assets/images/smallpurse.png')}
                />
            </TouchableOpacity>
        </View>
    )
}
export default Header;

const styles = StyleSheet.create({

    headerIcons: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    pageIcon: {
        marginLeft: normalize(20),
        width: normalize(20),
        height: normalize(20),
    },
});
