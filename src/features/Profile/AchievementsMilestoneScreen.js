import * as React from 'react';
import { Text, View, Image, ScrollView, Pressable } from 'react-native';
import normalize, { responsiveHeight, responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import { LinearProgress } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumber } from '../../utils/stringUtl';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { LinearGradient } from 'expo-linear-gradient';
import { getAchievements } from './AchievementSlice';
import MixedContainerBackground from '../../shared/ContainerBackground/MixedContainerBackground';
import GameArkLogo from '../../shared/GameArkLogo';
import AppHeader from '../../shared/AppHeader';
import TopIcons from '../../shared/TopIcons';



export default function AchievementsMilestoneScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const achievements = useSelector(state => state.common.achievements);
    const achievementBadges = useSelector(state => state.achievementSlice)
    const dispatch = useDispatch();

    React.useEffect(() => {
        // update recent in background
        dispatch(getAchievements());
    }, [])

    let combinedList = (achievementBadges?.all || []).map(_item => {
        const achieved = (achievementBadges?.mine || []).find(val => val.id === _item.id);
        if (achieved == undefined) return _item;
        return achieved;
    });

    // sort
    // let sortedCombinedList = [];
    for (let i = 0; i < combinedList.length; i++) {
        for (let k = i; k > 0; k--) {
            const temp1 = combinedList[k - 1];
            const temp2 = combinedList[k];
            if (temp1.id > temp2.id) {
                combinedList[k - 1] = temp2;
                combinedList[k] = temp1;
            }
        }
    }
    return (
        <MixedContainerBackground>
            <View
                style={styles.container}
            >
                    <TopIcons />
                    <AppHeader title="Achievements" />
                <ScrollView >
                    <View style={styles.content}>
                        {
                            combinedList.map((_item, key) => {
                                return (
                                    <Badges key={key} milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${_item?.medal || _item?.logoUrl}` }}
                                        title={`${_item?.title || ""}`}
                                        description={`${_item?.description || ""}`}
                                        // reward={`${_item.reward} ${_item.reward_type === 'POINTS' ? 'pts' : 'NGN'}`}
                                        reward={`${_item.reward} ${_item.reward_type === 'POINTS' ? 'coins' : 'coins'}`}
                                        progress={(() => {
                                            let total = (_item.milestone * _item.milestone_count);
                                            let count = _item.count;
                                            if (count != undefined) {
                                                // already achieving
                                                if (_item.is_claimed == "1") return 1;
                                                return (count / total);
                                            } else {
                                                return 0;
                                            }
                                        })()}
                                    />
                                )
                            })
                        }

                    </View>
                </ScrollView>
            </View>
        </MixedContainerBackground>
    );
}

const Badges = ({ milestoneIcon, progress, title, description, reward = 'Get 60pts' }) => {
    const disabled = progress === 1
    return (
        <>
            <View style={[styles.status, { opacity: disabled ? 0.4 : 1 }]}>
                <Image
                    source={milestoneIcon}
                    style={styles.milestoneIcon}
                    resizeMode="contain"
                />
                <View style={styles.details}>
                    <Text style={styles.detailsTitle}>{title}</Text>
                    <Text style={styles.detailsDesc}>{description.charAt(0).toUpperCase() + description.slice(1).toLowerCase()}</Text>
                </View>
                <View>
                    <LinearProgress
                        color='#2D53A0'
                        value={progress}
                        trackColor='#F0BACB'
                        variant="determinate"
                        style={styles.progressBar}
                    />
                    <Pressable style={styles.btn}>
                        <Text style={styles.reward}>{disabled ? 'Earned' : reward}</Text>
                    </Pressable>
                </View>
            </View>
        </>
    )
}


const styles = EStyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: responsiveHeight(2),
    },
    content: {
        marginHorizontal: normalize(18),
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: normalize(20),
    },
    status: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        height: 80,
        borderColor: '#D9D9D9',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(10),
        borderRadius: 11,
        marginVertical: normalize(14),
    },
    detailsTitle: {
        fontSize: '1rem',
        fontFamily: 'graphik-medium',
        textAlign: 'center',
        marginBottom: '0.5rem',
        color: '#fff',
        textTransform: 'capitalize'
    },
    statusText: {
        fontSize: '0.69rem',
        marginTop: normalize(8),
        fontFamily: 'graphik-regular',
        color: 'black',
        opacity: 0.6
    },
    detailsDesc: {
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
        textAlign: 'center',
        width: '11rem',
        marginBottom: '0.5rem',
        lineHeight: '1rem',
        color: '#fff',
    },
    milestoneIcon: {
        width: 45,
        height: 45,
    },
    unlocked: {
        fontSize: '0.69rem',
        color: '#EB5757',
        fontFamily: 'graphik-medium',
    },
    padlock: {
        width: normalize(35),
        height: normalize(35)
    },
    progressBar: {
        width: 66,
        height: 10,
        borderRadius: 16
    },
    btn: {
        height: 22,
        width: 66,
        backgroundColor: '#0A1F45',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '0.4rem'
    },
    reward: {
        color: '#fff',
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
    },
});
