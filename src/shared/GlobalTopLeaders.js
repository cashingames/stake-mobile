import * as React from 'react';
import { Platform, Pressable, Text, View } from 'react-native';
import { responsiveScreenHeight, responsiveScreenWidth } from '../utils/normalize';
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
            </View>
            <View style={styles.content}>
                <TopLeader
                    name={`${secondLeader.username}`}
                    point={`${formatNumber(secondLeader.points ? `${secondLeader.points}` : 0)} pts`}
                    avatar={secondLeader.avatar} 
                    style={styles.second}
                    position={2}
                    imageStyle={styles.secondImage}
                    positionStyle={styles.secondPosition}/>
                 <TopLeader
                    name={`${firstLeader.username}`}
                    point={`${formatNumber(firstLeader.points ? `${firstLeader.points}` : 0)} pts`}
                    avatar={firstLeader.avatar}
                    style={styles.first}
                    position={1}
                    imageStyle={styles.firstImage} 
                    positionStyle={styles.firstPosition}/>
                <TopLeader
                    name={`${thirdLeader.username}`}
                    point={`${formatNumber(thirdLeader.points ? `${thirdLeader.points}` : 0)} pts`}
                    avatar={thirdLeader.avatar} 
                    style={styles.third}
                    position={3}
                    imageStyle={styles.thirdImage} 
                    positionStyle={styles.thirdPosition}/> 
            </View>
        </View>
    )
}
export default GlobalTopLeaders;

const styles = EStyleSheet.create({
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: responsiveScreenWidth(5.5),
        paddingTop: responsiveScreenWidth(5.5),
        borderRadius: 15,
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingTop: responsiveScreenWidth(6.5),
    },
    third: {
        backgroundColor:'#0A1F45',
        alignItems:'center',
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        paddingHorizontal:responsiveScreenWidth(4),
        paddingVertical:responsiveScreenHeight(2)
    },
    thirdImage:{
        height:65,
        width:65,
        borderRadius:50,
        backgroundColor:'#fff',
        marginTop:-50,
        borderColor:'#00D95F',
        borderWidth:3
    },
    thirdPosition:{
        backgroundColor:'#00D95F'
    },
    first: {
        backgroundColor:'#2D53A0',
        alignItems:'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal:responsiveScreenWidth(4),
        paddingVertical:responsiveScreenHeight(2),
        height:153
    },
    firstImage:{
        height:75,
        width:75,
        borderRadius:50,
        backgroundColor:'#fff',
        borderColor:'#FFAA00',
        borderWidth:3
    },
    firstPosition:{
        backgroundColor:'#FFAA00'
    },
    second: {
        backgroundColor:'#0A1F45',
        alignItems:'center',
        borderTopLeftRadius: 12,
        borderBottomLeftRadius: 12,
        paddingHorizontal:responsiveScreenWidth(4),
        paddingVertical:responsiveScreenHeight(2)
    },
    secondImage:{
        height:65,
        width:65,
        borderRadius:50,
        backgroundColor:'#fff',
        marginTop:-60,
        borderColor:'#009BD6',
        borderWidth:3
    },
    secondPosition:{
        backgroundColor:'#009BD6'
    },
});
