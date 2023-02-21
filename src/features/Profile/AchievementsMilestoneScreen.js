import * as React from 'react';
import { Text, View, Image, ScrollView, Pressable } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import { LinearProgress } from 'react-native-elements';
import { useDispatch, useSelector } from 'react-redux';
import { formatNumber } from '../../utils/stringUtl';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { LinearGradient } from 'expo-linear-gradient';
import { getAchievements } from './AchievementSlice';



export default function AchievementsMilestoneScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);
    
    const achievements = useSelector(state => state.common.achievements);
    const achievementBadges = useSelector(state => state.achievementSlice)
    const dispatch = useDispatch();

    React.useEffect(()=>{
        // update recent in background
        dispatch(getAchievements());
    }, [])

    const nextLevel = achievements.find(item => item.point_milestone > 100);

    const combinedList = (achievementBadges?.all || []).map(_item =>{
        const achieved = (achievementBadges?.mine || []).find(val => val.id === _item.id);
        
        if(achieved == undefined) return _item;

        return achieved;

    });

    // console.log(combinedList.length)

    return (
        <LinearGradient
            colors={['rgb(255, 254, 250)', 'rgb(255, 251, 237)',
                'rgb(250, 197, 2)',
            ]}
            start={[0.5, 0]}
            end={[0.5, 1]}
            style={styles.container}
        >
            <ScrollView >
                <View style={styles.content}>
                    {/* <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        title={`${nextLevel.title}`}
                        description={`${nextLevel.title}`}
                        progress={1}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        title={`${nextLevel.title}`}
                        description={`${nextLevel.title}`}
                        progress={0.5}
                    /> */}

                    {
                        combinedList.map((_item, key) =>{
                            return (
                                <Badges key={key} milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                                    title={`${_item?.title || ""}`}
                                    description={`${_item?.description || ""}`}
                                    reward={`${_item.reward} ${_item.reward_type === 'POINTS' ? 'pts' : 'NGN'}`}
                                    progress={(()=>{
                                        let total = (_item.milestone * _item.milestone_count);
                                        let count = _item.count;
                                        if(count != undefined){
                                            // already achieving
                                            return (count / total);
                                        }else{
                                            return 0;
                                        }
                                    })()}
                                />
                            )
                        })
                    }
                    
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const Badges = ({ milestoneIcon, progress, title, description, reward = 'Get 60pts' }) => {
    const disabled = progress === 1
    return (
        <>
        <View style={[styles.status, { opacity: disabled? 0.4 : 1}]}>
            <Image
                source={milestoneIcon}
                style={styles.milestoneIcon}
            />
            <View style={styles.details}>
                <Text style={styles.detailsTitle}>{title}</Text>
                <Text style={styles.detailsDesc}>{description}</Text>
            </View>
            <View>
                <LinearProgress
                    color='#EF2F55'
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
        flex: 1
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
        lineHeight: '2rem'
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
        lineHeight: '1rem'
    },
    milestoneIcon: {
        width: normalize(60),
        height: normalize(60),
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
        backgroundColor: '#752A00',
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: '0.4rem'
    },
    reward: {
        color: '#fff',
        fontSize: '0.69rem',
        fontFamily: 'graphik-regular',
    }
});
