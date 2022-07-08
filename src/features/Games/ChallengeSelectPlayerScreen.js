import React, { useEffect, useState, useRef } from 'react';
import { Text, View, Image, ScrollView, TextInput, Pressable, Alert } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector, useDispatch } from 'react-redux';
import { isTrue } from '../../utils/stringUtl';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { fetchUserFriends, searchUserFriends } from '../CommonSlice';
import PageLoading from '../../shared/PageLoading';
import AppButton from '../../shared/AppButton';
import { setSelectedFriend, unselectFriend } from './GameSlice';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ChallengeInviteSent from '../../shared/ChallengeInviteSent';


export default function ChallengeSelectPlayerScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const refRBSheet = useRef();
    const [loading, setLoading] = useState(true)
    const userFriends = useSelector(state => state.common.userFriends);
    const selectedOpponent = useSelector(state => state.game.selectedFriend);
    console.log(selectedOpponent)
    const [search, setSearch] = useState("");

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
        navigation.navigate('Home')
    }

    const sendInvite = () => {
        openBottomSheet()
    }

    useEffect(() => {
        dispatch(fetchUserFriends()).then(() => setLoading(false));

        return () => (
            dispatch(unselectFriend())
        )
    }, []);


    const onSearchFriends = () => {
        console.log('clicking')
        dispatch(searchUserFriends(
            search
        ))
    }


    const onSelectedFriend = (userFriend) => {
        dispatch(setSelectedFriend(userFriend));
    }
    if (loading) {
        return <PageLoading spinnerColor="#0000ff" />
    }

    return (
        <ScrollView style={styles.container} keyboardShouldPersistTaps='always'>
            <View style={styles.search}>
                <Ionicons name="search" size={18} color="#524D4D" style={styles.icon} />
                <TextInput
                    style={styles.input}
                    placeholder="Search friend’s name"
                    onChangeText={setSearch}
                    keyboardType="default"
                />
                <Pressable style={styles.searchButton} onPress={onSearchFriends}>
                    <Text style={styles.searchText}>Search</Text>
                </Pressable>
            </View>
            <View style={styles.boards}>
                {userFriends.map((userFriend, i) => <FriendDetails key={i} userFriend={userFriend}
                    isSelected={userFriend.id === selectedOpponent?.id}
                    onSelect={onSelectedFriend}
                />)}
            </View>
            <AppButton text="Send Invite" disabled={!selectedOpponent} onPress={sendInvite} />

            <ChallengeInviteSent
                refBottomSheet={refRBSheet}
                onClose={closeBottomSheet}
            />

        </ScrollView>
    );
}


const FriendDetails = ({ userFriend, onSelect, isSelected }) => {

    return (
        <Pressable style={[styles.friendDetails, isSelected ? [styles.selected] : {}]} onPress={() => onSelect(userFriend)} >
            <View style={styles.friendLeft}>
                <Image
                    source={isTrue(userFriend.avatar) ? { uri: userFriend.avatar } : require("../../../assets/images/user-icon.png")}
                    style={styles.avatar}
                />
                <Text style={[styles.friendName, isSelected ? { color: "#FFFF" } : {}]}>{userFriend.username}</Text>
            </View>
            <Ionicons name={isSelected && "checkmark-circle"} size={24} color={isSelected && "#EF2F55"} />
        </Pressable>
    )
}





const styles = EStyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
        paddingHorizontal: normalize(18),
    },

    search: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFF',
        paddingVertical: responsiveScreenWidth(1.5),
        paddingHorizontal: responsiveScreenWidth(3),
        borderRadius: 4,
        borderColor: '#E9E8E8',
        borderWidth: 1,
        marginVertical: responsiveScreenWidth(5)
    },
    searchButton: {
        backgroundColor: '#EF2F55',
        marginLeft: 'auto',
        paddingHorizontal: '0.7rem',
        paddingVertical: '0.3rem',
        borderRadius: 10,
    },
    searchText: {
        fontSize: '0.6rem',
        fontFamily: 'graphik-regular',
        color: '#FFFF'
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
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(16),
        backgroundColor: '#E9E8E8',
        borderRadius: 45,
        paddingVertical: responsiveScreenWidth(2),
        paddingHorizontal: normalize(15),
    },
    friendLeft: {
        flexDirection: 'row',
        alignItems: 'center',
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
