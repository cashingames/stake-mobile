import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, StatusBar, Alert } from 'react-native';
import CategoryLeaderboard from '../../shared/CategoryLeaderboard';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth, responsiveWidth } from '../../utils/normalize';
import GlobalTopLeaders from '../../shared/GlobalTopLeaders';
import OtherLeaders from '../../shared/OtherLeaders';
import {
    getCategoryLeaders,
    getGlobalLeaders,
} from '../CommonSlice';
import { useDispatch, useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import EStyleSheet from 'react-native-extended-stylesheet';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import { Pressable } from 'react-native';
import LottieAnimations from '../../shared/LottieAnimations';
import TopIcons from '../../shared/TopIcons';
import { Image } from 'react-native';


function ExtendedLeaderboard(props) {
    const navigation = props.navigation;

    useApplyHeaderWorkaround(navigation.setOptions);
    const dispatch = useDispatch();
    const leaders = useSelector(state => state.common.globalLeaders)
    const categoryLeaders = useSelector(state => state.common.categoryLeaders)
    const [loading, setLoading] = useState(true);
    const [leaderCategories, setLeaderCategories] = useState(['Global', 'Music', 'Football', 'General'])
    const [selectedLeaderboard, setSelectedLeaderboard] = useState('Global');
    const [category, setCategory] = useState()

    useFocusEffect(
        React.useCallback(() => {
            dispatch(getGlobalLeaders());
            dispatch(getCategoryLeaders()).then(() => setLoading(false));
            setCategory(leaders)
        }, [])
    );

    const showLeaders = (leaderboard) => {
        setSelectedLeaderboard(leaderboard)
        switch (leaderboard) {
            case "Music":
                setCategory(categoryLeaders[leaderboard]);
                break;
            case "Football":
                setCategory(categoryLeaders[leaderboard]);
                break;
            case "General":
                setCategory(categoryLeaders[leaderboard]);
                break;
            default:
                setCategory(leaders)
        }
    }
    return (
        <MixedContainerBackground>
            <View style={styles.container}>
                <TopIcons />
                <View>
                    <Pressable
                        style={styles.closeBtn}
                        onPress={() => navigation.goBack(null)}>
                        <Image style={styles.closeIcon} source={require('../../../assets/images/close-icon.png')} />
                    </Pressable>
                    <Text style={styles.title}>Leaderboard</Text>
                </View>
                <View stickyHeaderIndices={[0]}>
                    <View style={styles.leaderContainer}>
                        <View style={styles.leaderboardBtn}>
                            {leaderCategories.map((leaderboard, i) => {
                                return (
                                    <Pressable key={i}
                                        style={[styles.btn, { borderBottomColor: selectedLeaderboard === leaderboard ? '#699BF7' : {}, borderBottomWidth: selectedLeaderboard === leaderboard ? 2 : 0 }]}
                                        onPress={() => showLeaders(leaderboard)}
                                    >
                                        <Text style={styles.btnText}>{leaderboard}</Text>
                                    </Pressable>
                                )
                            })}
                        </View>
                    </View>
                    {loading ?
                        <View style={styles.loader}>
                            <LottieAnimations
                                animationView={require('../../../assets/white-loader.json')}
                                width={normalize(100)}
                                height={normalize(100)}
                            />
                        </View>
                        :
                        <>
                            <GlobalLeaderboard leaders={category ?? []} />
                        </>

                    }
                </View>
            </View>
        </MixedContainerBackground>
    )
}
 
function GlobalLeaderboard({ leaders }) {
    return (
        <View style={styles.global}>
            <GlobalTopLeaders leaders={leaders} />
            <OtherLeaders leaders={leaders} otherStyles={styles.otherLeaders} />
        </View>

    )
}
export default ExtendedLeaderboard;

const styles = EStyleSheet.create({
    container: {
        height: responsiveHeight(100),
        paddingVertical: responsiveHeight(2),
    },
    animation: {
        alignItems: 'center'
    },
    global: {
        marginTop: responsiveHeight(100) * 0.05,
        height: responsiveHeight(80),
        borderRadius: 12,
    },
    leaderContainer: {
        alignItems: 'center',
    },
    leaderboardBtn: {
        flexDirection: 'row',
        paddingHorizontal: responsiveScreenWidth(7),
        backgroundColor: '#1E2237',
        borderRadius: 12,
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    btn: {
        marginHorizontal: '1rem',
        alignItems: 'flex-start',
        paddingVertical: responsiveHeight(100) * 0.03,

    },
    btnText: {
        fontSize: '0.85rem',
        fontFamily: 'blues-smile',
        color: '#fff',
        textAlign: 'center'
    },
    loader: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1
    },
    closeBtn:{
        alignItems: 'flex-end',
        paddingHorizontal:responsiveWidth(2),
    },
    closeIcon: {
        width: 50,
        height: 50
    },
    title: {
        textAlign: 'center',
        color: "#fff",
        fontFamily: 'blues-smile',
        fontSize: '2rem',
        marginTop: responsiveHeight(-30) * 0.06,
        marginBottom: normalize(10)
    },
});
