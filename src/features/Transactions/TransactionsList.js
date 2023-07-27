import { ScrollView, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import normalize from "../../utils/normalize";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../../utils/stringUtl";
import AppButton from '../../shared/AppButton';
import TabBarTab from "./TabBarTab";

const Tab = createMaterialTopTabNavigator();

export default function ({ transactions, onFetchMore }) {

    return (
        <Tab.Navigator
            style={styles.container}
            tabBar={props => <TabBarTab {...props} />}
            screenOptions={{
                tabBarLabelStyle: styles.tabBarLabel,
                activeTabBarLabelContainerStyle: { backgroundColor: '#E15220', borderRadius: 20, },
                tabBarLabelContainerStyle: { paddingHorizontal: 10, paddingVertical: 5, },
                tabBarIndicatorStyle: { backgroundColor: 'transparent' },
                tabBarInactiveTintColor: '#1C453B',
                tabBarActiveTintColor: '#FFF',
                tabBarStyle: styles.tabBarStyle,
                tabBarGap: 0
            }}>
            <Tab.Screen name="All">
                {(props) => <ListComponent {...props} extraData={{
                    transactions,
                    filter: false,
                    // viewMoreClicked: onFetchMore
                }} />
                }
            </Tab.Screen>
            <Tab.Screen name="Credit">
                {(props) => <ListComponent {...props} extraData={{
                    transactions,
                    filter: true,
                    // viewMoreClicked: onFetchMore
                }} />
                }
            </Tab.Screen>
            <Tab.Screen name="Debit">
                {(props) => <ListComponent {...props} extraData={{
                    transactions,
                    filter: true,
                    // viewMoreClicked: onFetchMore
                }} />
                }
            </Tab.Screen>
        </Tab.Navigator>
    );
}

function ListComponent({ extraData, route }) {
    const { transactions, filter, viewMoreClicked } = extraData;
    const data = filter ?
        transactions.filter(x => x.type == route.name.toUpperCase()) :
        transactions;

    if (data.length == 0)
        return (
            <View style={styles.emptyStateContainer}>
                <Text style={styles.emptyState}>No transaction records</Text>
            </View>
        )
    return (
        <ScrollView style={styles.items}>
            {
                data.map(item => <RenderItem key={item.id} item={item} />)
            }
            {/* <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={viewMoreClicked} /> */}
        </ScrollView>
    )
}

function RenderItem({ item }) {
    return (

        <View style={styles.transactionDetails}>
            <View style={styles.narationDetails}>
                <Ionicons name="ellipse" size={30} color={item.type === "DEBIT" ? '#EB2121' : '#00FFA3'} />
                <View style={styles.typeAndDate}>
                    <Text style={styles.transactionType}>{item.description}</Text>
                    <Text style={styles.transactionDate}>{item.transactionDate}</Text>
                </View>
            </View>
            <View>
                <View style={styles.amountDetails}>
                    {item.type === "DEBIT" ?
                        <Ionicons name="remove" size={22} color='#072169' style={{ fontFamily: 'gotham-medium' }} />
                        : <Ionicons name="add" size={22} color='#072169' style={{ fontFamily: 'gotham-medium' }} />
                    }
                    <Text style={styles.transactionAmount}>&#8358;{formatCurrency(item.amount)}</Text>
                </View>
            </View>
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        display: 'flex',
        flex: 1,
        backgroundColor: '#F9FBFF',
        // paddingHorizontal: normalize(22),
        paddingVertical: normalize(15)

    },
    emptyStateContainer: {
        flex: 1,
        backgroundColor: '#F9FBFF',
        justifyContent:'center',
        alignItems:'center'
    },
    emptyState: {
        color:'#072169',
        fontFamily:'sansation-regular',
        fontSize:'1.5rem'
    },
    items: {
        backgroundColor: '#F9FBFF',
        flex: 1,
        // paddingHorizontal: 22,
        paddingVertical: 30
    },
    narationDetails: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    typeAndDate: {
        marginLeft: '.5rem'
    },
    transactionType: {
        color: '#072169',
        fontFamily: 'gotham-medium',
        fontSize: '.9rem',
        width: '10.5rem',
        marginBottom: '.4rem'
    },
    transactionDate: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '.7rem',
        width: '10.5rem'
    },
    transactionDetails: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: '1.8rem'
    },

    amountDetails: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    transactionAmount: {
        color: '#072169',
        fontFamily: 'sansation-regular',
        fontSize: '.9rem',
        // width: '4rem',
    },
    buttonText: {
        fontFamily: 'gotham-medium',
        fontSize: '1.1rem'
    },
    tabBarStyle: {
        borderRadius: 35,
        marginBottom: '1.3rem',
        marginTop: 0,
        backgroundColor: '#EFF2F6',
        marginHorizontal: '2.8rem'
    },
    tabBarLabel: {
        fontSize: '0.75rem',
        fontFamily: 'gotham-bold',
        textTransform: 'capitalize'
    }
})