import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, TextInput } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HeaderBack from '../components/HeaderBack';
import { Ionicons } from '@expo/vector-icons';

export default function DuelSelectPlayer({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={styles.contentContainer}>
                <View style={styles.header}>
                    <HeaderBack onPress={() => navigation.navigate('GameInstructionsDuel')} />
                    <Text style={styles.headerTextStyle}>Duel - Select A Player</Text>
                    <TouchableOpacity>
                        <View style={styles.invite}>
                            <Ionicons name="md-add" size={18} color="#EF2F55" />
                            <Text style={styles.inviteFriends}>Invite Friends</Text>
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={styles.content}>
                    <SearchFriends />
                    <OnlinePlayers />
                    <OfflinePlayers />
                    <SendInvites />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const SearchFriends = () => {
    return (
        <View style={styles.search}>
            <Ionicons name="search" size={18} color="#524D4D" style={styles.icon} />
            <TextInput
                style={styles.input}
                placeholder="Search your friend’s name"
                keyboardType="default"
            />
        </View>
    )
}

const PlayerDetails = ({ player }) => {
    return (
        <View style={styles.playerDetails}>
            <View style={styles.playerAvatar}>
                <Image
                    source={player.playerAvatar}
                    style={styles.avatar}
                />
                <Text style={styles.playerName}>{player.playerName}</Text>
            </View>
            <Text style={styles.playerRank}>{player.rank}</Text>
        </View>
    )
}

const PlayersDetails = ({ playerName, rank }) => {
    const players = [
        {
            id: 1,
            playerAvatar: require('../../assets/images/user-icon.png'),
            playerName: "Aruna Joy",
            rank: 'Master',
        },
        {
            id: 2,
            playerAvatar: require('../../assets/images/user-icon.png'),
            playerName: "Mary Jane",
            rank: 'Novice',
        },
        {
            id: 3,
            playerAvatar: require('../../assets/images/user-icon.png'),
            playerName: "Jay Richard",
            rank: 'Master',
        }
    ]
    return (
        <View style={styles.players}>
            {players.map((player) => <PlayerDetails player={player} />)}
        </View>
    )
}

const OnlinePlayers = () => {
    return (
        <View>
            <Text style={styles.online}>Online</Text>
            <PlayersDetails />
        </View>
    )
}

const OfflinePlayers = () => {
    return (
        <View>
            <Text style={styles.online}>Offline</Text>
            <PlayersDetails />
        </View>
    )
}

const SendInvites = () => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity onPress={() => navigation.navigate('DuelScreen')}>
            <View style={styles.send}>
                <Text style={styles.sendText}>Send Invite</Text>
            </View>
        </TouchableOpacity>

    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    contentContainer: {
        backgroundColor: '#F8F9FD',
    },
    content: {
        paddingHorizontal: normalize(18),
        paddingBottom: normalize(50),
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
        backgroundColor: '#FFFF',
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
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
    input: {
        fontSize: normalize(10),
        fontFamily: 'graphik-regular',
        width: normalize(125),
        color: 'black'
    },
    search: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFF',
        paddingVertical: normalize(6),
        paddingHorizontal: normalize(10),
        borderRadius: 8,
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderWidth: normalize(1),
        marginVertical: normalize(10)
    },
    icon: {
        opacity: 0.4,
        marginRight: normalize(5)
    },
    avatar: {
        width: normalize(25),
        height: normalize(25),
        backgroundColor: '#FFFF',
        borderRadius: 50,
        borderColor: '#6FCF97',
        borderWidth: normalize(1),
        marginRight: normalize(10)
    },
    playerDetails: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: normalize(16),
        backgroundColor: '#E9E8E8',
        borderRadius: 45,
        paddingVertical: normalize(12),
        paddingHorizontal: normalize(10)
    },
    playerAvatar: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    },
    playerName: {
        fontSize: normalize(10),
        fontFamily: 'graphik-medium',
        color: '#333333'
    },
    playerRank: {
        fontSize: normalize(8),
        fontFamily: 'graphik-regular',
        color: '#828282'
    },
    online: {
        fontSize: normalize(12),
        fontFamily: 'graphik-bold',
        color: '#219653',
        marginBottom: normalize(20)
    },
    players: {
        marginBottom: normalize(25)
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
    }

});
