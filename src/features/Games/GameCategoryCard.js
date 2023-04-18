import { Ionicons } from "@expo/vector-icons";
import { Image, Pressable, Text, View } from "react-native";
import EStyleSheet from "react-native-extended-stylesheet";
import Animated, { BounceInRight, SlideInRight } from "react-native-reanimated";
import normalize from "../../utils/normalize";
import { formatNumber, isTrue } from "../../utils/stringUtl";
import { randomEnteringAnimation } from "../../utils/utils";
import Constants from 'expo-constants';


export default ({ category, onSelect, isSelected, activeCategory,activeSubcategory,onSubCategorySelected }) => {
    return (
        <Animated.View style={styles.card} entering={BounceInRight.duration(2000)}>
            <Pressable onPress={() => onSelect(category)} >
                <View style={styles.categoryCardTopRow}>
                    <Text style={styles.cardTitle}>{category.name} Quiz</Text>
                </View>
                {/* <View style={styles.categoryCardTopRow}>
                    <Text style={styles.cardInstruction}>{formatNumber(category.played)} times played </Text>
                </View> */}
            </Pressable>
        </Animated.View>
    )
}


const styles = EStyleSheet.create({

    card: {
        width: '100%',
        height:55,
        paddingHorizontal: normalize(20),
        borderRadius: normalize(20),
        marginBottom: normalize(10),
        backgroundColor: '#15397D',
        borderBottomColor: '#0D2859',
        borderBottomWidth: 4,
        justifyContent:'center'
    },
    cardIcon: {
        width: 40,
        height: 15,
        borderRadius: normalize(10)
    },
    cardTitle: {
        fontSize: '1.5rem',
        color: '#FFFF',
        fontFamily: 'blues-smile',
        marginVertical: normalize(8),
    },
    cardInstruction: {
        fontSize: '0.73rem',
        color: '#FFFF',
        fontFamily: 'graphik-regular',
    },
    checkbox: {
        // backgroundColor: '#FFFF',
    },
    categoryCardTopRow: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    checkIcon: {
        backgroundColor: '#EF2F55',
        borderRadius: 10,
        height: normalize(16),
        width: normalize(16),
        textAlign: 'center',
    },

});