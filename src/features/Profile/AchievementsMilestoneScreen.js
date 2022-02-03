import * as React from 'react';
import { Text, View, Image, ScrollView } from 'react-native';
import normalize, {responsiveScreenHeight, responsiveScreenWidth} from '../../utils/normalize';
import EStyleSheet from 'react-native-extended-stylesheet';
import { backendUrl } from '../../utils/BaseUrl';
import * as Progress from 'react-native-progress';
import { useSelector } from 'react-redux';
import { Ionicons } from '@expo/vector-icons';



export default function AchievementsMilestoneScreen({ navigation }) {
    const achievements = useSelector(state => state.common.achievements);
    const user = useSelector(state => state.auth.user);

    const nextLevel = achievements.find(item => item.point_milestone > user.points);
    const nextLevelProgress = user.points / nextLevel.point_milestone;

    return (
        <ScrollView style={styles.container}>
            <View style={styles.content}>
                <MilestoneStatus milestoneIcon={{ uri: `${backendUrl}/${nextLevel.medal}` }}
                    pointsProgress={`${user.points}/${nextLevel.point_milestone}`}
                    milestoneName={`${nextLevel.title}`}
                    progress={nextLevelProgress}
                />
                <View style={styles.cards}>
                    {achievements.map((achievement, i) => <AchievementCard key={i} userPoint={user.points} achievement={achievement} />)}
                </View>
            </View>
        </ScrollView>
    );
}

const MilestoneStatus = ({ milestoneIcon, pointsProgress, milestoneName, progress }) => {

    return (
        <View style={styles.status}>
            <View>
                <Progress.Bar
                    progress={progress}
                    width={124}
                    color='#EF2F55'
                    unfilledColor='#F0BACB'
                    height={8}
                    borderRadius={16}
                    borderWidth={0}
                />
                <Text style={styles.statusText}>{pointsProgress} points to Unlock {milestoneName}</Text>
            </View>
            <Image
                source={milestoneIcon}
                style={styles.milestoneIcon}
            />
        </View>
    )
}

const AchievementCard = ({ achievement, userPoint, }) => {

    const disabled = userPoint < achievement.point_milestone;


    return (
        <View
            style={[styles.card, { opacity: disabled ? 0.5 : 1 }, { backgroundColor: disabled ? '#C4C4C4' : '#FFFF' }]} disabled={disabled}>
            <Image
                source={{ uri: `${backendUrl}/${achievement.medal}` }}
                style={styles.icon}
            />
            <Text style={styles.name}>{achievement.title}</Text>
            <Text style={styles.point}>{achievement.point_milestone}</Text>
            {disabled ?
                <Ionicons name="lock-closed" size={30} color="#7C7D7F" />
                :
                <Text style={styles.unlocked}>Unlocked</Text>
            }
        </View>
    )
}



const styles = EStyleSheet.create({
    container: {
        backgroundColor: '#F2F5FF',
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
        backgroundColor: '#FFFF',
        paddingVertical: normalize(14),
        paddingHorizontal: normalize(10),
        borderRadius: 11
    },
    cards: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginVertical: normalize(35)
    },
    card: {
        alignItems: 'center',
        width: responsiveScreenWidth(41),
        marginBottom: normalize(20),
        height: responsiveScreenHeight(30),
        borderRadius: 11,
        borderWidth: 1,
        backgroundColor: '#FFFF',
        borderColor: '#E0E0E0',
    },
    statusText: {
        fontSize: '0.69rem',
        marginTop: normalize(8),
        fontFamily: 'graphik-regular',
        color: 'black',
        opacity: 0.6
    },
    icon: {
        width: normalize(70),
        height: normalize(70),
        marginTop: normalize(20),
    },
    name: {
        fontSize: '0.69rem',
        marginVertical: normalize(10),
        fontFamily: 'graphik-medium',
        color: '#EB5757',
    },
    point: {
        borderTopWidth: 1,
        borderTopColor: '#828282',
        fontSize: '0.76rem',
        marginVertical: normalize(10),
        fontFamily: 'graphik-medium',
        color: '#151C2F',
    },
    milestoneIcon: {
        width: normalize(40),
        height: normalize(40),
    },
    unlocked: {
        fontSize: '0.69rem',
        color: '#EB5757',
        fontFamily: 'graphik-medium',
    }
});
