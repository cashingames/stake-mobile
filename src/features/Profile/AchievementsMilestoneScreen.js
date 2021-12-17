import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, Pressable, } from 'react-native';
import normalize from '../../utils/normalize';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { backendUrl } from '../../utils/BaseUrl';
import * as Progress from 'react-native-progress';
import { useDispatch, useSelector } from 'react-redux';
import { TouchableOpacity } from 'react-native-gesture-handler';


export default function AchievementsMilestoneScreen({ navigation }) {
    const achievements = useSelector(state => state.common.achievements);
    const user = useSelector(state => state.auth.user);
    // console.log(JSON.stringify(achievements) + 'ME')

    var nextLevel = achievements.find( item => item.point_milestone > user.points);
    // console.log(nextLevel)
    // console.log(`${backendUrl}/${`${nextLevel.medal}`}`)

    return (
            <ScrollView>
                <View style={styles.content}>
                    <MilestoneStatus milestoneIcon={{ uri: `${backendUrl}/${nextLevel.medal}` }}
                        pointsProgress={`${user.points}/${nextLevel.point_milestone}`}
                        milestoneName={`${nextLevel.title}`}
                        progress={0.08}
                    />
                    <View style={styles.cards}>
                        {achievements.map((achievement, i) => <AchievementCard key= {i} userPoint={user.points} achievement={achievement} />)}
                    </View>
                </View>
            </ScrollView>
    );
}

const MilestoneStatus = ({ milestoneIcon, pointsProgress, milestoneName, progress }) => {

    console.log("here")
    console.log(milestoneIcon)
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
                style= {styles.milestoneIcon}
            />
        </View>
    )
}

const AchievementCard = ({ achievement, userPoint,  }) => {

    const disabled = userPoint < achievement.point_milestone;


    return (
        <View 
                style={[styles.card, {opacity: disabled ? 0.5 : 1}, {backgroundColor: disabled ? '#C4C4C4' : '#FFFF'}]} disabled={disabled}>
            <Image
                source={{ uri: `${backendUrl}/${achievement.medal}` }}
                style={styles.icon}
            />
            <Text style={styles.name}>{achievement.title}</Text>
            <Text style={styles.point}>{achievement.point_milestone}</Text>
        </View>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8F9FD',
    },
    content: {
        marginHorizontal: normalize(18),
        display: 'flex',
        justifyContent: 'space-between',
        marginTop: normalize(20),
    },

    textStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginBottom: normalize(10),
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
        width: normalize(130),
        marginBottom: normalize(20),
        height: normalize(180),
        borderRadius: 11,
        borderWidth: 1,
        backgroundColor:'#FFFF',
        borderColor: '#E0E0E0',
    },
    statusText: {
        fontSize: normalize(10),
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
        fontSize: normalize(10),
        marginVertical: normalize(10),
        fontFamily: 'graphik-medium',
        color: '#EB5757',
    },
    point: {
        borderTopWidth: 1,
        borderTopColor: '#828282',
        fontSize: normalize(13),
        marginVertical: normalize(10),
        fontFamily: 'graphik-medium',
        color: '#151C2F',
    },
    milestoneIcon: {
        width: normalize(40),
        height: normalize(40),
    }
});
