import { ScrollView, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import normalize from "../../utils/normalize";
import { Ionicons } from "@expo/vector-icons";
import { formatCurrency } from "../../utils/stringUtl";
import AppButton from '../../shared/AppButton';
import { useState } from "react";

const Tab = createMaterialTopTabNavigator();

export default function ({ transactions, onFetchMore }) {

    return (
        <Tab.Navigator
            style={styles.container}
            screenOptions={{
                tabBarLabelStyle: { fontSize: 18, fontFamily: 'gotham-medium', textTransform: 'capitalize' },
                tabBarActiveTintColor: '#FFF',
                tabBarInactiveTintColor: '#1C453B',
                tabBarStyle: { backgroundColor: '#EFF2F6', borderRadius: 35, marginHorizontal: 60, marginVertical: 5 },
            }}>
            <Tab.Screen name="All">
                {(props) => <ListComponent {...props} extraData={{
                    transactions,
                    filter: false,
                    viewMoreClicked: onFetchMore
                }} />
                }
            </Tab.Screen>
            <Tab.Screen name="Credit">
                {(props) => <ListComponent {...props} extraData={{
                    transactions,
                    filter: true,
                    viewMoreClicked: onFetchMore
                }} />
                }
            </Tab.Screen>
            <Tab.Screen name="Debit">
                {(props) => <ListComponent {...props} extraData={{
                    transactions,
                    filter: true,
                    viewMoreClicked: onFetchMore
                }} />
                }
            </Tab.Screen>
        </Tab.Navigator>
    );
}

function ListComponent({ extraData, route }) {
    const [pageNo, setPageNo] = useState(1);
    const { transactions, filter, viewMoreClicked } = extraData;
    const data = filter ?
        transactions.filter(x => x.type == route.name.toUpperCase()) :
        transactions;

    function viewMore(){
        setPageNo(pageNo+1);
        if(viewMoreClicked)
            viewMoreClicked(pageNo);
    }

    if(data.length == 0)
        return <Text>Empty state</Text>
    return (
        <ScrollView style={styles.items}>
            {
                data.map(item => <RenderItem key={item.id} item={item} />)
            }
            <AppButton text='View more' isIcon={true} iconColor="#FFF" textStyle={styles.buttonText} onPress={viewMore} />
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
})