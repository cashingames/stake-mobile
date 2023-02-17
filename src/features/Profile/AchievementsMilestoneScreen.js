import * as React from 'react';
import { Text, View, Image, ScrollView, Pressable } from 'react-native';
import normalize, { responsiveScreenHeight, responsiveScreenWidth } from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import Constants from 'expo-constants';
import { LinearProgress } from 'react-native-elements';
import { useSelector } from 'react-redux';
import { formatNumber } from '../../utils/stringUtl';
import useApplyHeaderWorkaround from '../../utils/useApplyHeaderWorkaround';
import { LinearGradient } from 'expo-linear-gradient';



export default function AchievementsMilestoneScreen({ navigation }) {
    useApplyHeaderWorkaround(navigation.setOptions);

    const achievements = useSelector(state => state.common.achievements);
    // const user = useSelector(state => state.auth.user);

    const nextLevel = achievements.find(item => item.point_milestone > 100);
    const nextLevelProgress = 60 / 60;
    const nextLevelProgress2 = 10 / 60;

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
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress}
                        points={100}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={100}
                    />
                    <Badges milestoneIcon={{ uri: `${Constants.manifest.extra.assetBaseUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${formatNumber(10)}/${formatNumber(60)}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={nextLevelProgress2}
                        points={10}
                    />
                </View>
            </ScrollView>
        </LinearGradient>
    );
}

const Badges = ({ milestoneIcon, points, progress }) => {
    const disabled = points === 100
    return (
        <>
        <View style={[styles.status, { opacity: disabled? 0.4 : 1} ]}>
            <Image
                source={milestoneIcon}
                style={styles.milestoneIcon}
            />
            <View style={styles.details}>
                <Text style={styles.detailsTitle}>Good Starter</Text>
                <Text style={styles.detailsDesc}>Exhaust all 5 daily free games at a go</Text>
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
                    <Text style={styles.reward}>{disabled ? 'Earned' : 'Get 60pts'}</Text>
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
