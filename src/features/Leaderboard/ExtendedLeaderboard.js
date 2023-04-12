import React, { useEffect, useRef, useState } from 'react';
import { Text, View, ScrollView, StatusBar, Alert } from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import CategoryLeaderboard from '../../shared/CategoryLeaderboard';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import PageLoading from '../../shared/PageLoading';
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
import AppHeader from '../../shared/AppHeader';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import { Pressable } from 'react-native';
import Loader from '../../shared/Loader';
import LottieAnimations from '../../shared/LottieAnimations';
import TopIcons from '../../shared/TopIcons';


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
    const [forceRender, setForceRender] = useState(true);
    const globalCount = useRef(0);

    useEffect(() => {
        dispatch(getGlobalLeaders());
        dispatch(getCategoryLeaders()).then(() => setLoading(false))
        setCategory(leaders)
    }, []);

    useEffect(() => {
        setCategory(leaders)
    }, [])
    useFocusEffect(
        React.useCallback(() => {
            dispatch(getGlobalLeaders());
            dispatch(getCategoryLeaders());
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
                <AppHeader title="Leaderboard" />

                <ScrollView stickyHeaderIndices={[0]}>
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
                </ScrollView>
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
        flex: 1,
        paddingVertical: responsiveScreenHeight(2)

    },
    animation: {
        alignItems: 'center'
    },
    global: {
        // paddingHorizontal: normalize(15),
        marginTop: normalize(40),
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
        marginHorizontal: normalize(5),
        marginHorizontal: '1rem',
        alignItems: 'flex-start',
        paddingVertical: responsiveScreenHeight(2),

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
    }
});
