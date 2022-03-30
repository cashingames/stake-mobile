import React, { useEffect, useState } from 'react';
import { Text, View, Image, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { useNavigation } from '@react-navigation/native';
import { SearchBar } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector, useDispatch } from 'react-redux';
import { backendUrl, } from '../../utils/BaseUrl';
import AppButton from '../../shared/AppButton';
import { isTrue } from '../../utils/stringUtl';
import { sendFriendInvite, setSelectedFriend } from './GameSlice';
import { unwrapResult } from '@reduxjs/toolkit';

export default function DuelSelectPlayerScreen({ navigation }) {
    const friends = useSelector(state => state.auth.user.friends)
    const [searchText, setSearchText] = useState('');
    const [filteredFriends, setFilteredFriends] = useState(friends);
    useEffect(() => {

        if (searchText == '') {
            setFilteredFriends(friends);
            return;
        }

        var result = friends.filter(friend => {
            if (friend.username.toLowerCase().includes(searchText.toLowerCase()) ||
                friend.fullName.toLowerCase().includes(searchText.toLowerCase())
            ) {
                return true;
            }
            return false;
        });

        setFilteredFriends(result);

    }, [searchText])

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.content}>
                <View style={styles.search}>
                    <Ionicons name="search" size={18} color="#524D4D" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search your friend’s name"
                        onChangeText={setSearchText}
                        keyboardType="default"
                    />
                </View>
                <View>
                    <View style={styles.players}>
                        {filteredFriends.map((friend, i) => <FriendDetails friend={friend} key={i} />)}
                    </View>
                </View>
                <SendInvites />
            </ScrollView>
        </SafeAreaView>
    );
}


const FriendDetails = ({ friend }) => {
    const dispatch = useDispatch();
    const opponentId = useSelector(state => state.game.selectedFriend.id)
    const selectedFriend = (friend) => {
        dispatch(setSelectedFriend(friend));
        console.log("mountain")
        console.log(friend)
    }
    return (
        <Pressable style={[styles.friendDetails, opponentId=== friend.id ? styles.selected : {}]} onPress={() => { selectedFriend(friend) }}>
            <Image
                source={isTrue(friend.avatar) ? { uri: `${backendUrl}/${friend.avatar}` } : require("../../../assets/images/user-icon.png")}
                style={styles.avatar}
            />
            <Text style={[styles.friendName, opponentId=== friend.id ? styles.selectedText : {}]}>{friend.username}</Text>
        </Pressable>
    )
}

const SendInvites = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const opponentId = useSelector(state => state.game.selectedFriend.id)
    const categoryId = useSelector(state => state.game.gameCategory.id)
    const gameTypeId = useSelector(state => state.game.gameType.id)
    console.log(JSON.stringify(categoryId) + 'this is category');
    console.log(JSON.stringify(gameTypeId) + 'this is type');
    console.log(JSON.stringify(opponentId) + 'this is opponent');
    const sendInvite = () => {
        dispatch(sendFriendInvite({
            opponentId,
            categoryId,
            gameTypeId
        }))
            .then(unwrapResult)
            .then(() => {
                console.log('sent')
                navigation.navigate('DuelScreen');
            })
            .catch((rejectedValueOrSerializedError) => {
                console.log(rejectedValueOrSerializedError);
                Alert.alert('failed to send invite')
                navigation.navigate('Home');
            });

    }

    return (
        <AppButton onPress={sendInvite} text='Send Invite' />
    )
}


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
    },

    content: {
        paddingHorizontal: normalize(18),
        paddingBottom: normalize(50),
    },
    search: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFF',
        paddingVertical: responsiveScreenWidth(1.5),
        paddingHorizontal: responsiveScreenWidth(3),
        borderRadius: 8,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderWidth: 1,
        marginVertical: responsiveScreenWidth(5)
    },
    icon: {
        opacity: 0.4,
        marginRight: normalize(5)
    },
    input: {
        fontSize: '0.6rem',
        fontFamily: 'graphik-regular',
        width: '100%',
        color: 'black'
    },
    select: {
        fontSize: '0.8rem',
        fontFamily: 'graphik-medium',
        color: '#219653',
        marginBottom: responsiveScreenWidth(5)
    },
    players: {
        marginBottom: responsiveScreenWidth(10)
    },
    friendDetails: {
        display: 'flex',
        flexDirection: 'row',
        // justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(16),
        backgroundColor: '#E9E8E8',
        borderRadius: 45,
        paddingVertical: responsiveScreenWidth(2),
        paddingHorizontal: normalize(15),
    },
    selected: {
        backgroundColor: '#151C2F',
        borderWidth: 1,
        borderColor: '#EF2F55',
    },
    avatar: {
        width: normalize(30),
        height: normalize(30),
        backgroundColor: '#FFFF',
        borderRadius: 50,
        borderColor: '#6FCF97',
        borderWidth: 1,
        marginRight: normalize(12)
    },
    selectedText: {
        color: '#FFFF'
    },
    friendName: {
        fontSize: '0.7rem',
        fontFamily: 'graphik-regular',
        color: '#333333'
    },
    invite: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    inviteFriends: {
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
        color: '#EF2F55',
    },
    playerRank: {
        fontSize: normalize(8),
        fontFamily: 'graphik-regular',
        color: '#828282'
    },

    send: {
        backgroundColor: '#EF2F55',
        alignItems: 'center',
        paddingVertical: normalize(15),
        borderRadius: 8,
        marginTop: normalize(10),
    },
    sendText: {
        color: '#FFFF',
        fontSize: normalize(12),
        fontFamily: 'graphik-medium',
    },

});
