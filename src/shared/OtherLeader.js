import * as React from 'react';
import { StyleSheet, Text, View, Image} from 'react-native';
import { normalize } from '../constants/NormalizeFont';

function OtherLeader({ othersAvatar, othersPoints, subLeaderFirstName, subLeaderLastName, position, indexArrow }) {
    return (
        <View style={styles.container}>
            <OtherLeaderAvatar
            othersAvatar={othersAvatar}
            othersPoints={othersPoints}
            subLeaderFirstName={subLeaderFirstName}
            subLeaderLastName={subLeaderLastName}
            />
             <OtherLeaderPosition
                position={position}
                indexArrow={indexArrow}
            />
        </View>
    );
}

const OtherLeaderAvatar = ({ othersAvatar, othersPoints, subLeaderFirstName, subLeaderLastName }) => {
    return (
       <View style={styles.avatar}>
            <Image
                style={styles.profilePic}
                source= {othersAvatar}
            />
            <View style={styles.username}>
                <Text style={styles.names}>{subLeaderFirstName} {subLeaderLastName}</Text>
                <Text style={styles.point}>{othersPoints}pts</Text>
                </View>
            </View>
    )
}

const OtherLeaderPosition = ({ position, indexArrow }) => {
    return (
        <View style={styles.position}>
            <View style={styles.rank}>
            <Text style={styles.rankText}>{position}</Text>
            </View>
            <Image
                style={styles.arrow}
                source={indexArrow}
            />
        </View>
    )
}
export default OtherLeader;

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(15)
    },
    profilePic: {
        width: normalize(30),
        height: normalize(30),
        backgroundColor:'#FFFF',
        borderRadius: 50,
    },
    arrow: {
        marginLeft: normalize(7)
    },
    avatar: {
        display: 'flex',
        flexDirection: 'row',
       
    },
    position: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        marginLeft: normalize(10),
    },
    names  : {
        color: '#535761',
        fontSize: normalize(12),
        fontFamily: 'graphik-bold',
    },
    rank: {
        backgroundColor: '#C4C4C4',
        paddingHorizontal: normalize(7),
        paddingVertical: normalize(3),
        borderRadius: 5
    },
    rankText: {
        color: '#535761',
        fontSize: normalize(10),
        fontFamily: 'graphik-bold',
    },
    point: {
        color: '#BDBDBD',
        fontSize: normalize(8),
        fontFamily: 'graphik-bold',
    },
});