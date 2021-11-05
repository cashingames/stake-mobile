import * as React from 'react';
import { StyleSheet, Text, View, Image, ScrollView, } from 'react-native';
import { normalize } from '../constants/NormalizeFont';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import * as Progress from 'react-native-progress';
import HeaderBack from '../components/HeaderBack';

export default function AchievementsMilestone({ navigation }) {

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView>
                <View style={styles.header}>
                    <View style={styles.headerBack}>
                        <HeaderBack onPress={() => navigation.navigate('UserProfile')} />
                        <Text style={styles.headerTextStyle}>Achievements</Text>
                    </View>
                    <Text style={styles.textStyle}>Milestones</Text>
                </View>
                <View style={styles.content}>
                    <MilestoneStatus milestoneIcon={require('../../assets/images/regal_small.png')}
                        pointsProgress='125/2000'
                        milestoneName='Regal'
                        progress={0.08}
                    />
                    <MilestoneCards />
                </View>
            </ScrollView>

        </SafeAreaView>
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
            />
        </View>
    )
}

const MilestoneCard = ({ cards }) => {
    return (
        <View style={styles.card}>
            <Image
                source={cards.milestoneIcon}
                style={styles.icon}
            />
            <Text style={styles.name}>{cards.milestoneName}</Text>
            <Text style={styles.point}>{cards.points}</Text>
        </View>
    )
}
const MilestoneCards = () => {
    const navigation = useNavigation();

    const cards = [
        {
            id: 1,
            milestoneIcon: require('../../assets/images/sage1.png'),
            milestoneName: 'Sage',
            points: 2000
        },
        {
            id: 2,
            milestoneIcon: require('../../assets/images/regal1.png'),
            milestoneName: 'Regal',
            points: 2000
        },
        {
            id: 3,
            milestoneIcon: require('../../assets/images/knight1.png'),
            milestoneName: 'Knight',
            points: 2000
        },
        {
            id: 4,
            milestoneIcon: require('../../assets/images/conqueror1.png'),
            milestoneName: 'Conqueror',
            points: 2000
        }
    ]

    return (
        <View style={styles.cards}>
            {cards.map((cards) => <MilestoneCard cards={cards} />)}
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
    header: {
        borderColor: 'rgba(0, 0, 0, 0.15)',
        borderBottomWidth: normalize(1),
        paddingHorizontal: normalize(20),
        paddingTop: normalize(15),
        backgroundColor: '#FFFF',
    },
    headerBack: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerTextStyle: {
        fontSize: normalize(14),
        fontFamily: 'graphik-medium',
        color: 'black',
        marginLeft: normalize(15),
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
        backgroundColor: '#FFFF',
        width: normalize(130),
        marginBottom: normalize(20),
        height: normalize(180),
        borderRadius: 11,
        borderWidth: 1,
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
    }
});
