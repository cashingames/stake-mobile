import * as React from 'react';
import { Platform, View, Pressable } from 'react-native';
import normalize, { responsiveScreenWidth } from '../utils/normalize';
import { formatNumber } from '../utils/stringUtl';
import EStyleSheet from 'react-native-extended-stylesheet';
import MonthlyLeader from './WeeklyLeader';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from "react-redux";
import { setGameMode } from '../features/Games/GameSlice';
import WeeklyLeader from './WeeklyLeader';
import PrizePoolTitle from './PrizePoolTitle';
import { Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';



function WeeklyTopLeaders({ leaders, firstDay, lastDay, gameModes }) {
    const topLeaders = leaders?.slice(0, 3) ?? null;
    const firstLeader = topLeaders[0] ?? { username: "..." };
    const secondLeader = topLeaders[1] ?? { username: "..." };
    const thirdLeader = topLeaders[2] ?? { username: "..." };

    const navigation = useNavigation();
    const dispatch = useDispatch()

    const gameModeSelected = gameModes.find(mode => mode.name === 'EXHIBITION')

    const playGame = () => {
        dispatch(setGameMode(gameModeSelected));
        navigation.navigate('SelectGameCategory')    
    }

    return (
        <View >
            <LinearGradient
                colors={['#EF2F55', '#5D5FEF']}
                style={styles.contentContainer}
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.modalDateText}>{firstDay} - {lastDay}</Text>
                    <PrizePoolTitle />
                </View>
                <View style={styles.content}>
                    <MonthlyLeader
                        podPosition={require('../../assets/images/month-pod3.png')}
                        name={`${thirdLeader.username}`}
                        point={`${formatNumber(thirdLeader.points ? `${thirdLeader.points}` : 0)} pts`}
                        avatar={thirdLeader.avatar}
                        styleProp={styles.others}
                        avatarProp={styles.otherAvatar}
                        stage={styles.stage}
                    />
                    <MonthlyLeader
                        podPosition={require('../../assets/images/month-pod1.png')}
                        name={`${firstLeader.username}`}
                        point={`${formatNumber(firstLeader.points ? `${firstLeader.points}` : 0)} pts`}
                        avatar={firstLeader.avatar}
                        styleProp={styles.winner}
                        avatarProp={styles.avatar}
                        stage={styles.winnerStage}

                    />
                    <WeeklyLeader
                        podPosition={require('../../assets/images/month-pod2.png')}
                        name={`${secondLeader.username}`}
                        point={`${formatNumber(secondLeader.points ? `${secondLeader.points}` : 0)} pts`}
                        avatar={secondLeader.avatar}
                        styleProp={styles.others}
                        avatarProp={styles.otherAvatar}
                        stage={styles.stage}

                    />
                </View>
                <View style={styles.playContainer}>
                <Pressable
                onPress={playGame}
                    style={styles.playBtn}
                >
                    <Text style={styles.playText}>Play now</Text>
                </Pressable>
                </View>
            </LinearGradient>
        </View>
    )
}


export default WeeklyTopLeaders;

const styles = EStyleSheet.create({
    contentContainer: {
        display: 'flex',
        flexDirection: 'column',
        paddingTop: responsiveScreenWidth(3.5),
        paddingHorizontal: responsiveScreenWidth(2),
        borderTopRightRadius: 10,
        borderTopLeftRadius: 10,
        borderBottomWidth: Platform.OS === 'ios' ? 1 : 1.5,
        borderColor: Platform.OS === 'ios' ? '#E0E0E0' : '#FFFF'
    },
    prizeTitle: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
        marginLeft: '.3rem',
    },
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: '#5d5fef',
        borderRadius: 20,
        paddingHorizontal: normalize(35),
        paddingVertical: normalize(18),
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    buttonClose: {
        marginLeft: 'auto',
        marginBottom: normalize(20)
    },
    closeStyle: {
        fontSize: '0.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    modalItems: {
        marginTop: normalize(25)
    },
    modalDateText: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginBottom: normalize(10),
        textAlign: 'center'
    },
    resultContainer: {
        alignItems: 'center'
    },
    modalItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(10)

    },
    modalWinnerItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: normalize(18)
    },
    modalTopText: {
        fontSize: '1rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
        marginBottom: normalize(10),
        textAlign: 'center'
    },
    winnerItemText: {
        fontSize: '0.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
    },
    itemText: {
        fontSize: '0.7rem',
        color: '#FFFF',
        fontFamily: 'graphik-medium',
    },
    content: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        marginTop: responsiveScreenWidth(4),
    },
    title: {
        fontSize: '.8rem',
        color: '#FFFF',
        fontFamily: 'graphik-bold',
    },
    winner: {
        alignItems: 'center',
    },
    others: {
        alignItems: 'center',
        position: 'absolute',
        bottom: 75
    },
    avatar: {
        width: normalize(55),
        height: normalize(55),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    otherAvatar: {
        width: normalize(40),
        height: normalize(40),
        backgroundColor: '#FFFF',
        borderRadius: 50,
    },
    viewContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '2rem'
    },
    viewText: {
        fontSize: '.6rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    headerContainer: {
        flexDirection: 'row',
        // alignItems: 'center',
        justifyContent: 'space-between'
    },
    poolContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: '.4rem'
    },
    stage: {
        width: normalize(88),
        height: normalize(88),
    },
    winnerStage: {
        width: normalize(98),
        height: normalize(98),
    },

    playContainer: {
        alignItems:'center'
    },
    playBtn : {
        borderColor:'#fff',
        borderWidth:1.5,
        backgroundColor:'transparent',
        alignItems:'center',
        justifyContent:'center',
        marginVertical:'0.5rem',
        borderRadius:5,
        padding:'0.5rem',
        paddingTop:'0.4rem'
    },
    playText: {
        fontFamily:'graphik-medium',
        color:'#fff',
        fontSize:'0.7rem',
        lineHeight:'1rem'
    }

});
