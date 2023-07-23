import { Pressable, Text, View } from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import normalize from "../../utils/normalize";
import { formatCurrency } from '../../utils/stringUtl';
import { Ionicons } from "@expo/vector-icons";



export default function ({ title, value, action }) {
    return (
        <View style={styles.container}>
            <View style={styles.totalHeader}>
                <Text style={styles.totalTitleText}>{title}</Text>
                <View style={styles.currencyHeader}>
                    <Text style={styles.currencyText}>NGN</Text>
                    <Text style={styles.currencyAmount}>{formatCurrency(value)}</Text>
                </View>
            </View>
            {action && <Pressable onPress={action.clicked} style={styles.fundingButton}>
                <Text style={styles.fundingText}>{action.text}</Text>
                <Ionicons name="chevron-forward" size={22} color="#fff" />
            </Pressable>}
        </View>
    )
}

const styles = EStyleSheet.create({
    container: {
        backgroundColor: '#fff',
        // marginHorizontal: normalize(18),
        borderRadius: 13,
        borderColor: '#E5E5E5',
        borderWidth: 1,
        paddingHorizontal: '1rem',
        paddingVertical: '1.4rem',
        marginBottom: '1.5rem',
        elevation: 2,
        shadowColor: '#000000',
        shadowOffset: { width: 0.5, height: 1 },
        shadowOpacity: 0.25,
        flexDirection:'row',
        justifyContent:'space-between',
        alignItems:'center'

    },
    totalTitleText: {
        color: '#1C453B',
        fontFamily: 'gotham-medium',
        fontSize: '1rem',
    },
    currencyHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: '.5rem'
    },
    currencyText: {
        color: '#1C453B',
        fontFamily: 'gotham-bold',
        fontSize: '1.2rem',
        marginRight: '.3rem'
    },
    currencyAmount: {
        color: '#1C453B',
        fontFamily: 'sansation-regular',
        fontSize: '1.2rem',
    },
    fundingButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 20,
        paddingHorizontal: '.6rem',
        paddingVertical: '.4rem',
        backgroundColor: '#E15220'
    },
    fundingText: {
        color: '#FFF',
        fontFamily: 'gotham-medium',
        fontSize: '.85rem',
    },
    totalHeader: {
        flexDirection: 'column',
    },
})