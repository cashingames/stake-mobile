import * as React from 'react';
import { StyleSheet, Text, View, ScrollView, Image } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import OtherLeaders from '../components/OtherLeaders';

function CategoryLeaderboard({ category }) {
    return (
        <ScrollView>
            <View style={styles.category}>
                <Text style={styles.categoryTitle}>{category}</Text>
                <CategoryTopLeaders />
                <OtherLeaders />
            </View>
        </ScrollView>
    )


    function CategoryTopLeaders() {
        return (
            <View style={styles.topLeaders}>
                {/* {games.map( (game: any) =><GameCard game={game} />)} */}
                <CategoryTopLeader position='3' name='Zubby Nwajigba' point='3000' avatar={require('../../assets/images/user-icon.png')} />
                <CategoryTopLeader topLeaderStyle={styles.firstPosition} position='1' name='Joy Bewa' point='8000' avatar={require('../../assets/images/user-icon.png')} />
                <CategoryTopLeader position='2' name='Chimdia Anyiam' point='5000' avatar={require('../../assets/images/user-icon.png')} />
            </View>
        )
    }

    function CategoryTopLeader({ avatar, name, position, point, topLeaderStyle }) {
        return (
            <View style={[styles.topLeader, topLeaderStyle]}>
                <Image
                    style={styles.avatar}
                    source={avatar}
                />
                <Text style={styles.number}>{position}</Text>
                <Text style={styles.leaderName}>{name}</Text>
                <View style={styles.leaderPoint}>
                    <Text style={styles.point}>{point}</Text>
                </View>
            </View>
        )
    }
} export default CategoryLeaderboard;

const styles = StyleSheet.create({
    categories: {
        display: 'flex',
        flexDirection: 'row',
    },
    categoryTitle: {
        fontSize: normalize(16),
        color: '#000',
        fontFamily: 'graphik-medium',
        lineHeight: normalize(30),
        textAlign: 'center',
        marginVertical: normalize(10)
    },
    category: {
        paddingVertical: normalize(20),
        paddingHorizontal: normalize(15),
        marginRight: normalize(5)
    },
    topLeader: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    topLeaders: {
        display: 'flex',
        flexDirection: 'row',
        backgroundColor: '#9C3DB8',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingHorizontal: normalize(30),
        paddingTop: normalize(40),
        paddingBottom: normalize(25),
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
    },
    icon: {

    },
    leaderPoint: {
        alignItems: 'center',
    },
    point: {
        color: '#FFFF',
        fontSize: normalize(8),
        fontFamily: 'graphik-regular',
        backgroundColor: '#828282',
        paddingVertical: normalize(2),
        paddingHorizontal: normalize(6),
        borderRadius: 10,
        marginTop: normalize(8),
        textAlign: 'center',
    },
    leaderName: {
        color: '#FFFF',
        fontSize: normalize(10),
        fontFamily: 'graphik-bold',
        width: normalize(75),
        textAlign: 'center',
    },
    avatar: {
        width: normalize(40),
        height: normalize(40),
        backgroundColor: '#FFFF',
        borderRadius: 50,
        marginBottom: normalize(5)
    },
    number: {
        backgroundColor: '#f0b802',
        paddingVertical: normalize(1),
        paddingHorizontal: normalize(1),
        textAlign: 'center',
        position: 'absolute',
        right: 10,
        top: 0,
        borderWidth: 2,
        borderColor: 'white',
        borderRadius: 50,
        width: normalize(16),
        height: normalize(16),
        color: 'white',
        fontFamily: 'graphik-regular',
    },
    firstPosition: {
        top: normalize(-30)
    }
});
