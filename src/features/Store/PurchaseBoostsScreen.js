import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import normalize from '../../utils/normalize';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { backendUrl } from '../../utils/BaseUrl';
import { useSelector } from 'react-redux';


export default function () {

    const boosts = useSelector(state => state.common.boosts);

    return (
        <View style={styles.availableBoosts}>
            <Text style={styles.title}>Get Boosts</Text>
            <View style={styles.boostCards}>
                {boosts.map((boost, i) => <BoostCard key={i} boost={boost} />)}
            </View>
        </View>
    );
}



const BoostCard = ({ boost }) => {
    return (
        <TouchableOpacity>
            <View style={styles.boostContainer}>
                <View style={styles.iconContainer}>
                    <Image
                        source={{ uri: `${backendUrl}/${boost.icon}` }}
                        style={styles.boostIcon}
                    />
                    <View style={styles.hr}><Text></Text></View>
                </View>
                <Text style={styles.boostName}>{boost.name}</Text>
                <Text style={styles.number}>x{boost.pack_count}</Text>
                <Text style={styles.description}>{boost.description}</Text>
                <View style={styles.buy}>
                    <Text style={styles.buyWithPoint}>{boost.point_value}pts</Text>
                    <Text style={styles.buyWithCash}>&#8358;{boost.currency_value}</Text>
                </View>
            </View>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({

    availableBoosts: {
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(20),
    },
    title: {
        fontFamily: 'graphik-medium',
        fontWeight: '900',
        fontSize: normalize(22),
        color: '#151C2F',
    },
    boostCards: {
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginTop: normalize(15),

    },
    boostContainer: {
        alignItems: 'center',
        backgroundColor: '#FFFF',
        borderRadius: 11,
        marginBottom: normalize(20),
        width: normalize(130),
        borderWidth: normalize(1),
        borderColor: '#E0E0E0',
        paddingBottom: normalize(15),
        paddingHorizontal: normalize(10),
    },

    iconContainer: {
        backgroundColor: '#FFFF',
        alignItems: 'center',
        height: normalize(75),
        width: normalize(55),
        borderRadius: 10,
        elevation: 12,
    },
    boostIcon: {
        marginTop: normalize(12),
        width: normalize(26),
        height: normalize(26),
    },
    hr: {
        borderBottomColor: '#F8A700',
        borderBottomWidth: normalize(5),
        width: normalize(23),
        borderRadius: 5,
        opacity: 0.4
    },
    boostName: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(10),
        color: '#EF2F55',
        marginTop: normalize(10),
    },
    number: {
        fontFamily: 'graphik-bold',
        fontSize: normalize(8),
        color: '#FF932F',
        marginTop: normalize(4),
    },
    description: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(7),
        color: '#828282',
        marginTop: normalize(4),
        textAlign: 'center'
    },
    buy: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: normalize(4),
    },
    buyWithPoint: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(11),
        color: 'rgba(21, 28, 47, 0.6)',
        marginRight: normalize(15)
    },
    buyWithCash: {
        fontFamily: 'graphik-medium',
        fontSize: normalize(8),
        color: '#151C2F',
    },
});
