import * as React from 'react';
import { Text, View, ScrollView, Platform } from 'react-native';
import normalize from '../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../utils/useApplyHeaderWorkaround';
import LottieAnimations from '../shared/LottieAnimations';
import { useNavigation } from '@react-navigation/native';


const InviteFriendsScreen = () => {
    useApplyHeaderWorkaround(navigation.setOptions);
    const navigation = useNavigation

    return (
        <ScrollView style={styles.container}>
            <LottieAnimations
                animationView={require('../../assets/friends.json')}
                width={normalize(160)}
                height={normalize(160)}
            />
            <Heading />
            <Instructions />
        </ScrollView>

    );
}

const Heading = () => {
    return (
        <View style={styles.heading}>
            <Text style={styles.value}>We value friendship</Text>
            <Text style={styles.points}>with your referrals</Text>
        </View>
    )
}

const Instructions = () => {
    return (
        <>
            <Text style={styles.instructions}>
                Refer your friends to us and get 2 bonus games for each friend referred, and has played at least 1 game,
                and also stand a chance of winning exciting prizes.
            </Text>
        </>
    )
}

export default InviteFriendsScreen;

const styles = EStyleSheet.create({
    container: {
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18)
    },

    heading: {
        marginVertical: normalize(30),
    },
    headingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    value: {
        fontSize: '1.5rem',
        fontFamily: 'graphik-medium',
        color: '#151C2F',
        marginBottom: Platform.OS === 'ios' ? normalize(10) : normalize(0),
    },
    points: {
        fontSize: '1.5rem',
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    instructions: {
        fontSize: '0.95rem',
        fontFamily: 'graphik-regular',
        color: '#151C2F',
        lineHeight: '1.7rem',
        opacity: 0.6,
        marginBottom: normalize(40),
    },
    inviteLink: {
        color: 'rgba(0, 0, 0, 0.6)',
        fontSize: '0.79rem',
        fontFamily: 'graphik-medium',
        lineHeight: '1.2rem',
        marginBottom: normalize(12),
    },
    link: {
        fontSize: '0.73rem',
        fontFamily: 'graphik-medium',
        lineHeight: '1.1rem',
        color: '#151C2F',
        width: '80%',
    },
    linkContainer: {
        backgroundColor: '#FFFF',
        paddingVertical: normalize(10),
        paddingHorizontal: normalize(15),
        borderRadius: 16,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    shareIcons: {
        display: 'flex',
        flexDirection: 'row'
    },
    iconText: {
        color: '#EB5757',
        fontSize: '0.55rem',
        fontFamily: 'graphik-bold',
    },
    icon: {
        marginLeft: normalize(10),
        alignItems: 'center'
    },
});
