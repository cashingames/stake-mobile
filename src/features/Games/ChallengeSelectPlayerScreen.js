import React, { useEffect, useState, useRef, useCallback } from 'react';
import { Text, View, Image, ScrollView, TextInput, Pressable, Alert, ActivityIndicator, } from 'react-native';
import normalize, { responsiveScreenWidth } from '../../utils/normalize';
import { Ionicons } from '@expo/vector-icons';
import EStyleSheet from 'react-native-extended-stylesheet';
import { useSelector, useDispatch } from 'react-redux';
import { isTrue } from '../../utils/stringUtl';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { fetchUserFriends, searchUserFriends } from '../CommonSlice';
import PageLoading from '../../shared/PageLoading';
import { sendFriendInvite, setSelectedFriend, unselectFriend } from './GameSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import ChallengeInviteSuccessText from '../../shared/ChallengeInviteSuccessText';
import UniversalBottomSheet from '../../shared/UniversalBottomSheet';
import { debounce } from 'lodash';
import analytics from '@react-native-firebase/analytics';
import ChallengeStakingBottomSheet from '../../shared/ChallengeStakingBottomSheet';


export default function ChallengeSelectPlayerScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const refRBSheet = useRef();
    const [loading, setLoading] = useState(true)
    const activeCategory = useSelector(state => state.game.gameCategory);
    const userFriends = useSelector(state => state.common.userFriends);
    const selectedOpponent = useSelector(state => state.game.selectedFriend);
    const user = useSelector(state => state.auth.user)
    const [search, setSearch] = useState("");
    const [searching, setSearching] = useState(false);
    const [sending, setSending] = useState(false)
    const [noDATA, setNoData] = useState(false)
    const features = useSelector(state => state.common.featureFlags);

    const isChallengeStakingFeatureEnabled = features['challenge_game_staking'] !== undefined && features['challenge_game_staking'].enabled;

    const openBottomSheet = () => {
        refRBSheet.current.open()
    }

    const closeBottomSheet = () => {
        refRBSheet.current.close()
        navigation.navigate('Home')
    }
    const closeStakeBottomSheet = () => {
        refRBSheet.current.close()
    }


    const sendInvite = () => {
        setSending(false)
        dispatch(sendFriendInvite({
            opponentId: selectedOpponent.id,
            categoryId: activeCategory.id
        }
        ))
            .then(unwrapResult)
            .then(async result => {
                await analytics().logEvent("challenge_invite_sent_without_staking", {
                    'id': user.username,
                    'phone_number': user.phoneNumber,
                    'email': user.email
                })
                openBottomSheet()
            })
            .catch((rejectedValueOrSerializedError) => {
                setSending(true)
                Alert.alert(rejectedValueOrSerializedError.message)
            });
        setSending(false)
    }


    const initiateChallengeStaking = async () => {
        setSending(false)
        openBottomSheet()
        await analytics().logEvent("challenge_staking_option", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
    }

    useEffect(() => {
        dispatch(fetchUserFriends()).then(() => setLoading(false));
        return () => (
            dispatch(unselectFriend())
        )
    }, []);


    const onSearchFriends = () => {
        console.log('clicking')
        setSearching(true)
        dispatch(searchUserFriends(
            search
        )).then(() => setSearching(false))
        if (userFriends.length === 0) {
            setNoData(true)
            console.log(noDATA)
        } else {
            setNoData(false)
        }
    }

    useEffect(() => {
        if (search.length >= 2) {
            findFriends(search);
            setNoData(false)
        } else {
            setSearching(false);
        }
    }, [search]);

    const findFriends = useCallback(
        debounce(name => {
            setSearching(true);
            dispatch(searchUserFriends(name)).then(() => setSearching(false));
        }, 500),
        []
    )


    const onSelectedFriend = (userFriend) => {
        dispatch(setSelectedFriend(userFriend));
        setSending(true)
        setSearching(false)
    }

    const stakeCash = async () => {
        closeStakeBottomSheet();
        await analytics().logEvent("challenge_staking_initiated", {
            'id': user.username,
            'phone_number': user.phoneNumber,
            'email': user.email
        })
        navigation.navigate('ChallengeStaking', { selectedOpponent: selectedOpponent })
    }


    if (loading) {
        return <PageLoading spinnerColor="#0000ff" />
    }

    return (
        <View style={styles.container}>
            <ScrollView keyboardShouldPersistTaps='always'>
                <View style={styles.search}>
                    <Ionicons name="search" size={18} color="#524D4D" style={styles.icon} />
                    <TextInput
                        style={styles.input}
                        placeholder="Search friend’s name"
                        onChangeText={setSearch}
                        keyboardType="default"
                    />
                    <Pressable style={styles.searchButton} onPress={onSearchFriends}>
                        {searching ?
                            <ActivityIndicator size="small" color="#FFFF" />
                            :
                            <Text style={styles.searchText}>Search</Text>
                        }
                    </Pressable>
                </View>

                <View style={styles.boards}>
                    {/* <Text style={styles.note}>Note: You can select up to 3 friends at a time</Text> */}
                    {noDATA ?
                        <Text style={styles.noDataText}>No Data</Text>
                        :
                        <>

                            {
                                userFriends.map((userFriend, i) => <FriendDetails key={i} userFriend={userFriend}
                                    isSelected={userFriend.id === selectedOpponent?.id}
                                    onSelect={onSelectedFriend}
                                />)
                            }
                        </>
                    }
                </View>
                {isChallengeStakingFeatureEnabled ?
                    <UniversalBottomSheet
                        refBottomSheet={refRBSheet}
                        height={285}
                        subComponent={<ChallengeStakingBottomSheet
                            stakeCash={stakeCash}
                        // selectedOpponent={selectedOpponent.id}
                        // activeCategory={activeCategory.id}
                        />}
                    />
                    :
                    <UniversalBottomSheet
                        refBottomSheet={refRBSheet}
                        height={445}
                        subComponent={<ChallengeInviteSuccessText onClose={closeBottomSheet} />}
                    />
                }
            </ScrollView>
            <SendInviteButton onPress={isChallengeStakingFeatureEnabled ? initiateChallengeStaking : sendInvite} disabled={!selectedOpponent || !sending} />
            {/* <SendInviteButton onPress={selectedOpponents.length > 1 ? sendInvite : initiateChallengeStaking} disabled={!selectedOpponents || !sending} /> */}
        </View>
    );
}

const SendInviteButton = ({ onPress, disabled }) => {
    return (
        <Pressable onPress={onPress} style={[styles.selectButton, disabled ? styles.disabled : {}]} disabled={disabled} >
            <Ionicons name='checkmark-sharp' size={30} color='#FFFF' />
        </Pressable>
    )
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
    noDataText: {
        fontSize: '0.8rem',
        fontFamily: 'graphik-medium',
        color: '#000000',
        textAlign: 'center',
        alignItems: 'center'
    },
    note: {
        fontSize: '0.7rem',
        fontFamily: 'graphik-medium',
        color: '#000000',
        // textAlign: 'center',
        alignItems: 'center',
        marginBottom: '1rem',
        opacity: 0.7
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
    selectButton: {
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        width: 60,
        height: 60,
        elevation: 5,
        backgroundColor: '#EF2F55',
        position: 'absolute',
        right: 0,
        bottom: 0,
        margin: normalize(18)
    },
    disabled: {
        backgroundColor: '#DFCBCF'
    },

});
