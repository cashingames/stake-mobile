import * as React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { responsiveScreenWidth } from '../utils/normalize';
import { formatNumber } from '../utils/stringUtl';
import EStyleSheet from 'react-native-extended-stylesheet';
import TopLeader from './TopLeader';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';



function GlobalTopLeaders({ leaders }) {
    const navigation = useNavigation();

    const topLeaders = leaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { username: "..." };
    const secondLeader = topLeaders[1] ?? { username: "..." };
    const thirdLeader = topLeaders[2] ?? { username: "..." };
    return (
        <View style={styles.contentContainer}>
            <View style={styles.headerContainer}>
                <View></View>
                {/* <Text style={styles.title}>Top Players</Text> */}
            </View>
            <View style={styles.content}>
                <TopLeader
                    podPosition={require('../../assets/images/position3.png')}
                    name={`${thirdLeader.username}`}
                    point={`${formatNumber(thirdLeader.points ? `${thirdLeader.points}` : 0)} pts`}
                    avatar={thirdLeader.avatar} />
                <TopLeader
                    podPosition={require('../../assets/images/position1.png')}
                    name={`${firstLeader.username}`}
                    point={`${formatNumber(firstLeader.points ? `${firstLeader.points}` : 0)} pts`}
                    avatar={firstLeader.avatar} />
                <TopLeader
                    podPosition={require('../../assets/images/position2.png')}
                    name={`${secondLeader.username}`}
                    point={`${formatNumber(secondLeader.points ? `${secondLeader.points}` : 0)} pts`}
                    avatar={secondLeader.avatar} />
            </View>
        </View>
    )
}
export default GlobalTopLeaders;

const styles = EStyleSheet.create({
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#FAC502',
        paddingHorizontal: responsiveScreenWidth(5.5),
        paddingTop: responsiveScreenWidth(5.5),
        // borderRadius: 15,
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 1.5,
        borderColor:Platform.OS === 'ios' ? '#E0E0E0': '#FFFF'
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingTop: responsiveScreenWidth(6.5),
    },
    title: {
        // textAlign: 'center',
        fontSize: '.8rem',
        // lineHeight: '1.3rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
    },

    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '2rem'
    },
    extendedText: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        textDecoration: 'underline',
    },
    viewText: {
        // textAlign: 'center',
        fontSize: '.6rem',
        // lineHeight: '1.3rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    headerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },

});
